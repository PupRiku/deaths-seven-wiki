import { describe, it, expect, beforeEach } from 'vitest'
import type { Client } from '@libsql/client'
import { createTestDb } from '../../helpers/db'
import {
  createTestPlayerToken,
  createTestDmSession,
  createTestPlayerSession,
  expiredSession,
} from '../../helpers/auth'
import {
  hashToken,
  hashPassphrase,
  createDmSession,
  createPlayerSession,
  validateSession,
  deleteSession,
} from '@/lib/auth'

let db: Client

beforeEach(async () => {
  db = await createTestDb()
})

describe('hashToken', () => {
  it('returns consistent SHA-256 hex for same input', () => {
    expect(hashToken('ROLANDO')).toBe(hashToken('ROLANDO'))
    expect(hashToken('ROLANDO')).toMatch(/^[0-9a-f]{64}$/)
  })

  it('normalizes input to uppercase and trims whitespace before hashing', () => {
    const canonical = hashToken('ROLANDO')
    expect(hashToken('rolando')).toBe(canonical)
    expect(hashToken('  ROLANDO  ')).toBe(canonical)
    expect(hashToken('Rolando')).toBe(canonical)
  })

  it('produces different hashes for different inputs', () => {
    expect(hashToken('ROLANDO')).not.toBe(hashToken('MICHAEL'))
  })
})

describe('hashPassphrase', () => {
  it('is case-sensitive and not normalized', () => {
    expect(hashPassphrase('correct horse')).not.toBe(hashPassphrase('CORRECT HORSE'))
  })

  it('returns SHA-256 hex', () => {
    expect(hashPassphrase('foo')).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe('createDmSession', () => {
  it('inserts a row and returns a UUID', async () => {
    const id = await createDmSession(db)
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
    const row = await db.execute({ sql: `SELECT * FROM dm_sessions WHERE id = ?`, args: [id] })
    expect(row.rows.length).toBe(1)
  })

  it('sets expires_at roughly 30 days in the future', async () => {
    const id = await createDmSession(db)
    const row = await db.execute({ sql: `SELECT expires_at FROM dm_sessions WHERE id = ?`, args: [id] })
    const expires = new Date(String(row.rows[0].expires_at)).getTime()
    const days = (expires - Date.now()) / (24 * 60 * 60 * 1000)
    expect(days).toBeGreaterThan(29)
    expect(days).toBeLessThanOrEqual(30)
  })
})

describe('createPlayerSession', () => {
  it('inserts a row, returns a UUID, and updates last_active_at', async () => {
    const tok = await createTestPlayerToken(db)
    const id = await createPlayerSession(tok.id, db)
    expect(id).toMatch(/^[0-9a-f-]{36}$/)

    const session = await db.execute({ sql: `SELECT * FROM player_sessions WHERE id = ?`, args: [id] })
    expect(session.rows.length).toBe(1)

    const tokRow = await db.execute({ sql: `SELECT last_active_at FROM player_tokens WHERE id = ?`, args: [tok.id] })
    expect(tokRow.rows[0].last_active_at).not.toBeNull()
  })

  it('sets expires_at roughly 30 days in the future', async () => {
    const tok = await createTestPlayerToken(db)
    const id = await createPlayerSession(tok.id, db)
    const row = await db.execute({ sql: `SELECT expires_at FROM player_sessions WHERE id = ?`, args: [id] })
    const expires = new Date(String(row.rows[0].expires_at)).getTime()
    const days = (expires - Date.now()) / (24 * 60 * 60 * 1000)
    expect(days).toBeGreaterThan(29)
    expect(days).toBeLessThanOrEqual(30)
  })
})

describe('validateSession (dm)', () => {
  it('returns SessionContext with role dm for a valid session', async () => {
    const { sessionId } = await createTestDmSession(db)
    const ctx = await validateSession(sessionId, 'dm', db)
    expect(ctx).toEqual({ role: 'dm' })
  })

  it('returns null for a non-existent session id', async () => {
    const ctx = await validateSession('does-not-exist', 'dm', db)
    expect(ctx).toBeNull()
  })

  it('returns null for an expired session', async () => {
    const id = await expiredSession(db, 'dm')
    expect(await validateSession(id, 'dm', db)).toBeNull()
  })

  it('returns null when a dm session id is checked against the player role', async () => {
    const { sessionId } = await createTestDmSession(db)
    expect(await validateSession(sessionId, 'player', db)).toBeNull()
  })
})

describe('validateSession (player)', () => {
  it('returns SessionContext with character info for a valid session', async () => {
    const tok = await createTestPlayerToken(db, {
      characterId: 'rolando',
      characterName: 'Rolando Ornasca',
      playerName: 'Mikey',
    })
    const { sessionId } = await createTestPlayerSession(db, tok.id)
    const ctx = await validateSession(sessionId, 'player', db)
    expect(ctx).toEqual({
      role: 'player',
      characterId: 'rolando',
      characterName: 'Rolando Ornasca',
      playerName: 'Mikey',
    })
  })

  it('returns null for non-existent session id', async () => {
    expect(await validateSession('nope', 'player', db)).toBeNull()
  })

  it('returns null for expired player session', async () => {
    const tok = await createTestPlayerToken(db)
    const id = await expiredSession(db, 'player', tok.id)
    expect(await validateSession(id, 'player', db)).toBeNull()
  })

  it('returns null when player session id is checked against the dm role', async () => {
    const tok = await createTestPlayerToken(db)
    const { sessionId } = await createTestPlayerSession(db, tok.id)
    expect(await validateSession(sessionId, 'dm', db)).toBeNull()
  })
})

describe('deleteSession', () => {
  it('removes a dm session and returns true', async () => {
    const { sessionId } = await createTestDmSession(db)
    expect(await deleteSession(sessionId, 'dm', db)).toBe(true)
    expect(await validateSession(sessionId, 'dm', db)).toBeNull()
  })

  it('removes a player session and returns true', async () => {
    const tok = await createTestPlayerToken(db)
    const { sessionId } = await createTestPlayerSession(db, tok.id)
    expect(await deleteSession(sessionId, 'player', db)).toBe(true)
    expect(await validateSession(sessionId, 'player', db)).toBeNull()
  })

  it('returns false when deleting a non-existent session', async () => {
    expect(await deleteSession('nope', 'dm', db)).toBe(false)
  })

  it('does not affect other sessions', async () => {
    const a = await createTestDmSession(db)
    const b = await createTestDmSession(db)
    await deleteSession(a.sessionId, 'dm', db)
    expect(await validateSession(b.sessionId, 'dm', db)).toEqual({ role: 'dm' })
  })
})
