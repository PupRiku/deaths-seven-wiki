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

import { NextRequest } from 'next/server'
import { createTestPlayerToken, createTestDmSession, createTestPlayerSession } from '../../../helpers/auth'

function nextReq(url: string, cookies: Record<string, string> = {}): NextRequest {
  const r = new NextRequest(url, { method: 'POST' })
  for (const [k, v] of Object.entries(cookies)) r.cookies.set(k, v)
  return r
}

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
})

async function loadRoute() {
  return await import('@/app/api/auth/logout/route')
}

describe('POST /api/auth/logout', () => {
  it('returns 200 and clears dm_session cookie when DM is logged in', async () => {
    // Initialize tables
    const { initDB } = await import('@/lib/db')
    await initDB()
    const { sessionId } = await createTestDmSession(memory.db!)

    const { POST } = await loadRoute()
    const res = await POST(nextReq('http://x/api/auth/logout', { dm_session: sessionId }))
    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie') ?? ''
    expect(setCookie).toMatch(/dm_session=/)
    // Cleared cookies have empty value or expires-in-the-past
    expect(setCookie.toLowerCase()).toMatch(/expires=|max-age=0/)
  })

  it('removes the dm session row from the database', async () => {
    const { initDB } = await import('@/lib/db')
    await initDB()
    const { sessionId } = await createTestDmSession(memory.db!)
    const { POST } = await loadRoute()
    await POST(nextReq('http://x/api/auth/logout', { dm_session: sessionId }))
    const rows = await memory.db!.execute({
      sql: `SELECT id FROM dm_sessions WHERE id = ?`,
      args: [sessionId],
    })
    expect(rows.rows.length).toBe(0)
  })

  it('clears player_session cookie and removes row when player is logged in', async () => {
    const { initDB } = await import('@/lib/db')
    await initDB()
    const tok = await createTestPlayerToken(memory.db!)
    const { sessionId } = await createTestPlayerSession(memory.db!, tok.id)

    const { POST } = await loadRoute()
    const res = await POST(nextReq('http://x/api/auth/logout', { player_session: sessionId }))
    expect(res.status).toBe(200)
    const rows = await memory.db!.execute(`SELECT id FROM player_sessions`)
    expect(rows.rows.length).toBe(0)
  })

  it('does not error when no session cookies are present', async () => {
    const { initDB } = await import('@/lib/db')
    await initDB()
    const { POST } = await loadRoute()
    const res = await POST(nextReq('http://x/api/auth/logout'))
    expect(res.status).toBe(200)
  })
})
