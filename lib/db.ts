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

  // Player tokens (one per character, stable across rerolls)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS player_tokens (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL UNIQUE,
      character_name TEXT NOT NULL,
      player_name TEXT NOT NULL,
      token_hash TEXT NOT NULL,
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

  // Seed default campaign state if empty
  const state = await client.execute(`SELECT key FROM campaign_state LIMIT 1`)
  if (state.rows.length === 0) {
    await client.execute(`
      INSERT INTO campaign_state (key, value) VALUES
        ('current_chapter', '1'),
        ('current_session', '1'),
        ('current_level', '3'),
        ('party_level', '3')
    `)
  }

  // Seed player tokens if empty (one-time)
  const tokens = await client.execute(`SELECT id FROM player_tokens LIMIT 1`)
  if (tokens.rows.length === 0) {
    for (const seed of PLAYER_TOKEN_SEEDS) {
      await client.execute({
        sql: `INSERT INTO player_tokens (id, character_id, character_name, player_name, token_hash)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          seed.characterId,
          seed.characterName,
          seed.playerName,
          hashTokenPlain(seed.token),
        ],
      })
    }
    // Log plaintext tokens so the DM can distribute them. Only happens on first run.
    console.log('\n=== PLAYER TOKENS (distribute these once; not logged again) ===')
    for (const seed of PLAYER_TOKEN_SEEDS) {
      console.log(`  ${seed.playerName.padEnd(7)} → ${seed.token.padEnd(8)} (${seed.characterName})`)
    }
    console.log('================================================================\n')
  }

  console.log('✓ Database initialized at', dbPath)
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
