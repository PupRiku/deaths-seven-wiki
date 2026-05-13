import { describe, it, expect, beforeEach } from 'vitest'
import { createClient, type Client } from '@libsql/client'
import { initDB, PLAYER_TOKEN_SEEDS } from '@/lib/db'

let db: Client

beforeEach(() => {
  db = createClient({ url: ':memory:' })
})

describe('First-run seeding', () => {
  it('inserts 4 player tokens into an empty player_tokens table', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT character_id FROM player_tokens`)
    expect(rows.rows.length).toBe(4)
  })

  it('seeds Rolando, Michael, Sal/Thornvatore, and Drazier', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT character_id FROM player_tokens ORDER BY character_id`)
    const ids = rows.rows.map((r) => r.character_id)
    expect(ids).toEqual(['drazier', 'michael', 'rolando', 'sal'])
  })

  it('hashes tokens (no plaintext storage)', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT token_hash FROM player_tokens`)
    for (const r of rows.rows) {
      expect(String(r.token_hash)).toMatch(/^[0-9a-f]{64}$/)
    }
    const hashes = rows.rows.map((r) => String(r.token_hash))
    for (const seed of PLAYER_TOKEN_SEEDS) {
      expect(hashes).not.toContain(seed.token)
    }
  })

  it('assigns a unique character_id to each token', async () => {
    await initDB(db)
    const rows = await db.execute(`SELECT character_id FROM player_tokens`)
    const ids = rows.rows.map((r) => r.character_id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Subsequent runs', () => {
  it('does not modify a non-empty player_tokens table', async () => {
    await initDB(db)
    await db.execute({
      sql: `UPDATE player_tokens SET player_name = 'CustomPlayer' WHERE character_id = ?`,
      args: ['rolando'],
    })
    await initDB(db)
    const row = await db.execute({
      sql: `SELECT player_name FROM player_tokens WHERE character_id = ?`,
      args: ['rolando'],
    })
    expect(row.rows[0].player_name).toBe('CustomPlayer')
  })

  it('preserves existing custom token rows added by hand', async () => {
    await initDB(db)
    const rowsBefore = await db.execute(`SELECT COUNT(*) as n FROM player_tokens`)
    expect(Number(rowsBefore.rows[0].n)).toBe(4)
    await initDB(db)
    const rowsAfter = await db.execute(`SELECT COUNT(*) as n FROM player_tokens`)
    expect(Number(rowsAfter.rows[0].n)).toBe(4)
  })
})
