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

import { mockRequest } from '../../../helpers/request'
import { hashPassphrase } from '@/lib/auth'

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
  process.env.DM_PASSPHRASE_HASH = hashPassphrase('correct-horse-battery-staple')
})

async function loadRoute() {
  return await import('@/app/api/auth/dm/route')
}

describe('POST /api/auth/dm', () => {
  it('returns 200 and sets dm_session cookie with the correct passphrase', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: 'correct-horse-battery-staple' },
    }) as never)
    expect(res.status).toBe(200)
    const setCookie = res.headers.get('set-cookie') ?? ''
    expect(setCookie).toMatch(/dm_session=/)
    expect(setCookie.toLowerCase()).toContain('httponly')
    expect(setCookie.toLowerCase()).toContain('samesite=strict')
    // In dev/test (NODE_ENV !== 'production') the Secure flag must be off so
    // browsers can store the cookie over plain http://localhost.
    expect(setCookie.toLowerCase()).not.toContain('secure')
  })

  it('returns 401 with the wrong passphrase', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: 'nope' },
    }) as never)
    expect(res.status).toBe(401)
  })

  it('returns 400 with empty passphrase', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: '' },
    }) as never)
    expect(res.status).toBe(400)
  })

  it('returns 400 with whitespace-only passphrase', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: '   \t\n  ' },
    }) as never)
    expect(res.status).toBe(400)
  })

  it('returns 401 (not 500) when DM_PASSPHRASE_HASH is the wrong length', async () => {
    // Constant-time compare must short-circuit on length mismatch instead of
    // throwing — otherwise a misconfigured hash crashes the route.
    process.env.DM_PASSPHRASE_HASH = 'tooshort'
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: 'correct-horse-battery-staple' },
    }) as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 (not 500) when DM_PASSPHRASE_HASH contains non-hex characters', async () => {
    process.env.DM_PASSPHRASE_HASH = 'z'.repeat(64)
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: 'correct-horse-battery-staple' },
    }) as never)
    expect(res.status).toBe(401)
  })

  it('returns 400 with malformed JSON body', async () => {
    const { POST } = await loadRoute()
    const req = new Request('http://x/api/auth/dm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not-json',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('persists the created session in dm_sessions', async () => {
    const { POST } = await loadRoute()
    await POST(mockRequest('POST', 'http://x/api/auth/dm', {
      body: { passphrase: 'correct-horse-battery-staple' },
    }) as never)
    const rows = await memory.db!.execute(`SELECT id FROM dm_sessions`)
    expect(rows.rows.length).toBe(1)
  })
})
