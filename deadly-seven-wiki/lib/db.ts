import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'

// Ensure data directory exists
const dataDir = path.join(process.cwd(), '.wiki-data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'wiki.db')

export const db = createClient({
  url: `file:${dbPath}`,
})

export async function initDB() {
  // Session notes
  await db.execute(`
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
  await db.execute(`
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
  await db.execute(`
    CREATE TABLE IF NOT EXISTS campaign_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)

  // Seed default campaign state if empty
  const state = await db.execute(`SELECT key FROM campaign_state LIMIT 1`)
  if (state.rows.length === 0) {
    await db.execute(`
      INSERT INTO campaign_state (key, value) VALUES
        ('current_chapter', '1'),
        ('current_session', '1'),
        ('current_level', '3'),
        ('party_level', '3')
    `)
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
