import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient, type Client } from '@libsql/client'

const memory: { db: Client | null } = { db: null }

vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual<typeof import('@/lib/db')>('@/lib/db')
  return {
    ...actual,
    get db() { return memory.db! },
    initDB: async () => actual.initDB(memory.db!),
  }
})

// next/headers is a server-only API. Stub it with a per-test cookie jar.
const cookieJar: { entries: Record<string, string> } = { entries: {} }
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get(name: string) {
      const v = cookieJar.entries[name]
      return v === undefined ? undefined : { value: v }
    },
  }),
}))

import { createTestPlayerToken, createTestDmSession, createTestPlayerSession } from '../../../helpers/auth'

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
  cookieJar.entries = {}
  // Ensure tables exist so token/session inserts work.
  const { initDB } = await import('@/lib/db')
  await initDB()
})

async function loadRoute() {
  return await import('@/app/api/player/profile/route')
}

describe('GET /api/player/profile', () => {
  it('returns 401 with no cookies', async () => {
    const { GET } = await loadRoute()
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns the player context with a valid player_session', async () => {
    // Use non-seed IDs so we don't collide with the four default tokens that
    // initDB() seeds (which now have UNIQUE character_id + token_hash).
    const tok = await createTestPlayerToken(memory.db!, {
      characterId: 'test-rolando',
      characterName: 'Rolando Test',
      playerName: 'Tester',
    })
    const { sessionId } = await createTestPlayerSession(memory.db!, tok.id)
    cookieJar.entries.player_session = sessionId

    const { GET } = await loadRoute()
    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      characterId: 'test-rolando',
      characterName: 'Rolando Test',
      playerName: 'Tester',
    })
  })

  it('returns the player context even when a DM cookie is also set (no priority shadow)', async () => {
    // Regression: previously getSessionFromCookies preferred dm_session, so a
    // user with both cookies got DM context and this route 401'd.
    const dm = await createTestDmSession(memory.db!)
    const tok = await createTestPlayerToken(memory.db!, { characterId: 'test-sal' })
    const player = await createTestPlayerSession(memory.db!, tok.id)
    cookieJar.entries.dm_session = dm.sessionId
    cookieJar.entries.player_session = player.sessionId

    const { GET } = await loadRoute()
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.characterId).toBe('test-sal')
  })

  it('returns 401 when only a DM cookie is present', async () => {
    const dm = await createTestDmSession(memory.db!)
    cookieJar.entries.dm_session = dm.sessionId

    const { GET } = await loadRoute()
    const res = await GET()
    expect(res.status).toBe(401)
  })
})
