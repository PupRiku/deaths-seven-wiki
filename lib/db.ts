import { createClient, type Client } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

// Ensure data directory exists
const dataDir = path.join(process.cwd(), '.wiki-data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'wiki.db')

export const db = createClient({
  url: `file:${dbPath}`,
})

// Plaintext player tokens, keyed by character id. Distributed to players.
// These get hashed before being stored.
export const PLAYER_TOKEN_SEEDS: Array<{
  characterId: string
  characterName: string
  playerName: string
  token: string
}> = [
  { characterId: 'rolando', characterName: 'Rolando Ornasca', playerName: 'Mikey', token: 'ROLANDO' },
  { characterId: 'michael', characterName: 'Michael Portsmith', playerName: 'Kilt', token: 'MICHAEL' },
  { characterId: 'sal', characterName: 'Thornvatore', playerName: 'Will', token: 'SAL' },
  { characterId: 'drazier', characterName: 'Drazier "Gabriel" Stormbound', playerName: 'JT', token: 'DRAZIER' },
]

function hashTokenPlain(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toUpperCase()).digest('hex')
}

// Module-level latch so the dev-only "✓ Database initialized at..." banner
// fires once per process instead of on every gated request.
let pathLogged = false

export async function initDB(client: Client = db) {
  // Session notes
  await client.execute(`
    CREATE TABLE IF NOT EXISTS session_notes (
      id TEXT PRIMARY KEY,
      session_number INTEGER NOT NULL,
      chapter INTEGER NOT NULL,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // Encounter / initiative state
  await client.execute(`
    CREATE TABLE IF NOT EXISTS encounters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      round INTEGER DEFAULT 1,
      turn INTEGER DEFAULT 0,
      combatants TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // Campaign state (current chapter, session number, etc.)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaign_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // DM session management
  await client.execute(`
    CREATE TABLE IF NOT EXISTS dm_sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    )
  `)

  // Player tokens (one per character, stable across rerolls).
  // token_hash is UNIQUE so that login lookups (`SELECT ... WHERE token_hash = ?
  // LIMIT 1`) are deterministic — a duplicate would otherwise auth the first
  // matching row arbitrarily.
  await client.execute(`
    CREATE TABLE IF NOT EXISTS player_tokens (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL UNIQUE,
      character_name TEXT NOT NULL,
      player_name TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      last_active_at TEXT
    )
  `)

  // Player sessions
  await client.execute(`
    CREATE TABLE IF NOT EXISTS player_sessions (
      id TEXT PRIMARY KEY,
      player_token_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (player_token_id) REFERENCES player_tokens(id)
    )
  `)

  // === Selective Reveal System ===
  // Base visibility per (entity_type, entity_id). UNIQUE on the pair so the
  // sync process can use INSERT OR IGNORE without duplicating rows.
  await client.execute(`
    CREATE TABLE IF NOT EXISTS entity_reveals (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL CHECK (entity_type IN ('npc', 'location', 'faction', 'item')),
      entity_id TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'hidden' CHECK (visibility IN ('hidden', 'discovered', 'revealed')),
      discovered_name TEXT,
      chapter_association INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(entity_type, entity_id)
    )
  `)

  // Field-level reveal toggles. Auto-populated from data files. Array fields
  // are indexed (e.g. "notes:0", "notes:1") — index is stable as long as the
  // data file's array order doesn't change.
  await client.execute(`
    CREATE TABLE IF NOT EXISTS entity_field_reveals (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      field_name TEXT NOT NULL,
      is_revealed INTEGER NOT NULL DEFAULT 0,
      revealed_at TEXT,
      UNIQUE(entity_type, entity_id, field_name)
    )
  `)

  // Freeform DM-authored reveal entries attached to an entity. Not synced —
  // the DM creates these by hand in the Reveal Manager.
  await client.execute(`
    CREATE TABLE IF NOT EXISTS entity_custom_details (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_revealed INTEGER NOT NULL DEFAULT 0,
      revealed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `)

  // Seed default campaign state. INSERT OR IGNORE so concurrent cold-start
  // requests can both run this block without colliding on the PK.
  await client.execute(`
    INSERT OR IGNORE INTO campaign_state (key, value) VALUES
      ('current_chapter', '1'),
      ('current_session', '1'),
      ('current_level', '3'),
      ('party_level', '3')
  `)

  // Seed player tokens. Use INSERT OR IGNORE so two concurrent cold-start
  // requests can both run this block harmlessly: each row's UNIQUE constraints
  // (character_id, token_hash) silently dedupe instead of throwing. The
  // SELECT short-circuit just avoids the four no-op writes on warm starts.
  const tokens = await client.execute(`SELECT id FROM player_tokens LIMIT 1`)
  if (tokens.rows.length === 0) {
    let inserted = 0
    for (const seed of PLAYER_TOKEN_SEEDS) {
      const res = await client.execute({
        sql: `INSERT OR IGNORE INTO player_tokens (id, character_id, character_name, player_name, token_hash)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          seed.characterId,
          seed.characterName,
          seed.playerName,
          hashTokenPlain(seed.token),
        ],
      })
      if ((res.rowsAffected ?? 0) > 0) inserted++
    }
    // Log plaintext tokens so the DM can distribute them. Only when this
    // process actually inserted at least one row AND only under
    // NODE_ENV=development — keeps tokens out of CI / prod logs and avoids a
    // double-print if a racing process already seeded.
    if (inserted > 0 && process.env.NODE_ENV === 'development') {
      console.log('\n=== PLAYER TOKENS (distribute these once; not logged again) ===')
      for (const seed of PLAYER_TOKEN_SEEDS) {
        console.log(`  ${seed.playerName.padEnd(7)} → ${seed.token.padEnd(8)} (${seed.characterName})`)
      }
      console.log('================================================================\n')
    }
  }

  // Log the on-disk path once per process, only for the singleton client and
  // only in dev. Suppresses the misleading log when tests pass an in-memory
  // client, and avoids spamming the dev console once initDB() runs from every
  // gated route.
  if (!pathLogged && client === db && process.env.NODE_ENV === 'development') {
    console.log('✓ Database initialized at', dbPath)
    pathLogged = true
  }

  // Sync the data-file entities into the reveal tables. Only run automatically
  // for the singleton client — tests sync explicitly when they need to. The
  // sync function has its own per-process latch.
  if (client === db) {
    const { syncReveals } = await import('@/lib/reveal-sync')
    await syncReveals(client)
  }
}

export async function getCampaignState(): Promise<Record<string, string>> {
  const rows = await db.execute(`SELECT key, value FROM campaign_state`)
  return Object.fromEntries(rows.rows.map((r) => [r.key as string, r.value as string]))
}

export async function setCampaignState(key: string, value: string) {
  await db.execute({
    sql: `INSERT INTO campaign_state (key, value, updated_at)
          VALUES (?, ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`,
    args: [key, value],
  })
}

// Generate a simple unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
