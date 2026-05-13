import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient, type Client } from '@libsql/client'
import { initDB, PLAYER_TOKEN_SEEDS } from '@/lib/db'
import { sha256 } from '../../helpers/db'

let db: Client

beforeEach(() => {
  db = createClient({ url: ':memory:' })
})

async function tableExists(client: Client, name: string): Promise<boolean> {
  const res = await client.execute({
    sql: `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
    args: [name],
  })
  return res.rows.length === 1
}

describe('initDB', () => {
  it('creates all DM and auth tables without error', async () => {
    await initDB(db)
    for (const t of [
      'session_notes',
      'encounters',
      'campaign_state',
      'dm_sessions',
      'player_tokens',
      'player_sessions',
    ]) {
      expect(await tableExists(db, t)).toBe(true)
    }
  })

  it('is idempotent — calling twice does not throw or duplicate rows', async () => {
    await initDB(db)
    await initDB(db)
    const players = await db.execute(`SELECT COUNT(*) as n FROM player_tokens`)
    expect(Number(players.rows[0].n)).toBe(PLAYER_TOKEN_SEEDS.length)
    const state = await db.execute(`SELECT COUNT(*) as n FROM campaign_state`)
    expect(Number(state.rows[0].n)).toBe(4)
  })

  it('is concurrency-safe — parallel initDB calls do not throw or duplicate', async () => {
    // Regression: initDB() now runs from every gated route + layout, so two
    // cold-start requests can race the seed block. INSERT OR IGNORE must
    // dedupe instead of letting a UNIQUE error bubble up and fail the request.
    await Promise.all([initDB(db), initDB(db), initDB(db)])
    const players = await db.execute(`SELECT COUNT(*) as n FROM player_tokens`)
    expect(Number(players.rows[0].n)).toBe(PLAYER_TOKEN_SEEDS.length)
  })

  it('does not log the on-disk path when invoked with a non-default client', async () => {
    // Regression: previously the "✓ Database initialized at <dbPath>" line
    // printed even from tests using :memory: clients, misleading anyone
    // grepping logs. The log must be gated on `client === db`.
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    try {
      await initDB(db) // db here is the test's in-memory client, NOT the singleton
      const printedDbPath = spy.mock.calls.some((args) =>
        args.some((a) => typeof a === 'string' && a.includes('Database initialized at'))
      )
      expect(printedDbPath).toBe(false)
    } finally {
      spy.mockRestore()
    }
  })
})

describe('Token seeding', () => {
  it('seeds 4 player tokens when player_tokens is empty', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT character_name, player_name, token_hash FROM player_tokens ORDER BY character_id`)
    expect(rows.rows.length).toBe(4)
  })

  it('does not re-seed when tokens already exist', async () => {
    await initDB(db)
    // Mutate one row, then re-init
    await db.execute({
      sql: `UPDATE player_tokens SET character_name = ? WHERE character_id = ?`,
      args: ['Custom Name', 'rolando'],
    })
    await initDB(db)
    const row = await db.execute({
      sql: `SELECT character_name FROM player_tokens WHERE character_id = ?`,
      args: ['rolando'],
    })
    expect(row.rows[0].character_name).toBe('Custom Name')
  })

  it('seeds the four expected characters with correct names', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT character_id, character_name, player_name FROM player_tokens`)
    const byId = Object.fromEntries(rows.rows.map((r) => [String(r.character_id), r]))
    expect(byId.rolando.player_name).toBe('Mikey')
    expect(byId.michael.player_name).toBe('Kilt')
    expect(byId.sal.player_name).toBe('Will')
    expect(byId.drazier.player_name).toBe('JT')
  })

  it('seeded token hashes match the expected plaintext tokens', async () => {
    await initDB(db)
    for (const seed of PLAYER_TOKEN_SEEDS) {
      const row = await db.execute({
        sql: `SELECT token_hash FROM player_tokens WHERE character_id = ?`,
        args: [seed.characterId],
      })
      expect(row.rows[0].token_hash).toBe(sha256(seed.token))
    }
  })

  it('enforces UNIQUE on token_hash so login lookups stay deterministic', async () => {
    await initDB(db)
    const dupHash = sha256('ROLANDO') // same hash as the seeded Rolando row
    await expect(
      db.execute({
        sql: `INSERT INTO player_tokens (id, character_id, character_name, player_name, token_hash)
              VALUES (?, ?, ?, ?, ?)`,
        args: ['dup-id', 'duplicate', 'Duplicate Char', 'Tester', dupHash],
      })
    ).rejects.toThrow(/UNIQUE/i)
  })

  it('does not store tokens in plaintext', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT token_hash FROM player_tokens`)
    for (const row of rows.rows) {
      expect(String(row.token_hash)).toMatch(/^[0-9a-f]{64}$/)
      expect(['ROLANDO', 'MICHAEL', 'SAL', 'DRAZIER']).not.toContain(String(row.token_hash))
    }
  })
})
