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

const cookieJar: { entries: Record<string, string> } = { entries: {} }
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get(name: string) {
      const v = cookieJar.entries[name]
      return v === undefined ? undefined : { value: v }
    },
  }),
}))

import { NextRequest } from 'next/server'
import { createTestDmSession } from '../../../helpers/auth'

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
  cookieJar.entries = {}
  const { initDB } = await import('@/lib/db')
  await initDB()
})

async function loadChapters() {
  return await import('@/app/api/dm/chapters/route')
}

// /api/dm/chapters is a representative DM API route — the same dmGuard pattern
// is inlined into chapters, npcs, notes, and export. These tests assert
// defense-in-depth: even if an attacker forges or steals a presence-only
// dm_session cookie, the handler must re-validate it against dm_sessions.
describe('GET /api/dm/chapters (deep DM guard)', () => {
  it('returns 401 with no dm_session cookie', async () => {
    const { GET } = await loadChapters()
    const res = await GET(new NextRequest('http://x/api/dm/chapters'))
    expect(res.status).toBe(401)
  })

  it('returns 401 with a forged (DB-unknown) dm_session cookie', async () => {
    cookieJar.entries.dm_session = 'this-is-not-a-real-session'
    const { GET } = await loadChapters()
    const res = await GET(new NextRequest('http://x/api/dm/chapters'))
    expect(res.status).toBe(401)
  })

  it('returns 200 with chapter index when dm_session is valid', async () => {
    const { sessionId } = await createTestDmSession(memory.db!)
    cookieJar.entries.dm_session = sessionId

    const { GET } = await loadChapters()
    const res = await GET(new NextRequest('http://x/api/dm/chapters'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('returns 401 even when only a valid player_session is present', async () => {
    cookieJar.entries.player_session = 'some-player-cookie'
    const { GET } = await loadChapters()
    const res = await GET(new NextRequest('http://x/api/dm/chapters'))
    expect(res.status).toBe(401)
  })
})
