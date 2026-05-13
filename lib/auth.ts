import crypto from 'crypto'
import { db as defaultDb } from '@/lib/db'
import type { SessionContext, UserRole } from '@/types'
import type { Client } from '@libsql/client'

const SESSION_TTL_DAYS = 30
const MS_PER_DAY = 24 * 60 * 60 * 1000

export const DM_COOKIE = 'dm_session'
export const PLAYER_COOKIE = 'player_session'

function expiry(): string {
  return new Date(Date.now() + SESSION_TTL_DAYS * MS_PER_DAY).toISOString()
}

export function hashToken(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toUpperCase()).digest('hex')
}

export function hashPassphrase(input: string): string {
  // Passphrase is case-sensitive; only hash the raw input.
  return crypto.createHash('sha256').update(input).digest('hex')
}

export async function createDmSession(client: Client = defaultDb): Promise<string> {
  const id = crypto.randomUUID()
  await client.execute({
    sql: `INSERT INTO dm_sessions (id, expires_at) VALUES (?, ?)`,
    args: [id, expiry()],
  })
  return id
}

export async function createPlayerSession(playerTokenId: string, client: Client = defaultDb): Promise<string> {
  const id = crypto.randomUUID()
  await client.execute({
    sql: `INSERT INTO player_sessions (id, player_token_id, expires_at) VALUES (?, ?, ?)`,
    args: [id, playerTokenId, expiry()],
  })
  await client.execute({
    sql: `UPDATE player_tokens SET last_active_at = datetime('now') WHERE id = ?`,
    args: [playerTokenId],
  })
  return id
}

export async function validateSession(
  sessionId: string,
  role: UserRole,
  client: Client = defaultDb
): Promise<SessionContext | null> {
  if (!sessionId) return null

  if (role === 'dm') {
    const res = await client.execute({
      sql: `SELECT id, expires_at FROM dm_sessions WHERE id = ?`,
      args: [sessionId],
    })
    if (res.rows.length === 0) return null
    const row = res.rows[0]
    if (new Date(String(row.expires_at)).getTime() < Date.now()) return null
    return { role: 'dm' }
  }

  // player
  const res = await client.execute({
    sql: `
      SELECT ps.id, ps.expires_at, pt.character_id, pt.character_name, pt.player_name
      FROM player_sessions ps
      JOIN player_tokens pt ON pt.id = ps.player_token_id
      WHERE ps.id = ?
    `,
    args: [sessionId],
  })
  if (res.rows.length === 0) return null
  const row = res.rows[0]
  if (new Date(String(row.expires_at)).getTime() < Date.now()) return null
  return {
    role: 'player',
    characterId: String(row.character_id),
    characterName: String(row.character_name),
    playerName: String(row.player_name),
  }
}

export async function deleteSession(
  sessionId: string,
  role: UserRole,
  client: Client = defaultDb
): Promise<boolean> {
  if (!sessionId) return false
  const table = role === 'dm' ? 'dm_sessions' : 'player_sessions'
  const res = await client.execute({
    sql: `DELETE FROM ${table} WHERE id = ?`,
    args: [sessionId],
  })
  return (res.rowsAffected ?? 0) > 0
}

interface CookieReader {
  get(name: string): { value: string } | undefined
}

export async function getSessionFromCookies(
  cookieStore: CookieReader,
  client: Client = defaultDb
): Promise<SessionContext | null> {
  const dm = cookieStore.get(DM_COOKIE)?.value
  if (dm) {
    const ctx = await validateSession(dm, 'dm', client)
    if (ctx) return ctx
  }
  const player = cookieStore.get(PLAYER_COOKIE)?.value
  if (player) {
    const ctx = await validateSession(player, 'player', client)
    if (ctx) return ctx
  }
  return null
}

// `secure` is on in production only — localhost dev runs over plain http and
// browsers refuse to set Secure cookies on http origins.
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  secure: process.env.NODE_ENV === 'production',
}
