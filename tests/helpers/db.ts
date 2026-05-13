import { createClient, type Client } from '@libsql/client'
import crypto from 'crypto'

// Create a fresh in-memory libSQL DB with all tables installed. We mirror
// lib/db.ts initDB() here so each test gets a clean, isolated database
// without touching the on-disk wiki.db file.
export async function createTestDb(): Promise<Client> {
  const client = createClient({ url: ':memory:' })

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
  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaign_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS dm_sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    )
  `)
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
  await client.execute(`
    CREATE TABLE IF NOT EXISTS player_sessions (
      id TEXT PRIMARY KEY,
      player_token_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (player_token_id) REFERENCES player_tokens(id)
    )
  `)
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

  return client
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toUpperCase()).digest('hex')
}
