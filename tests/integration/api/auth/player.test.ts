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
import { PLAYER_TOKEN_SEEDS } from '@/lib/db'

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
})

async function loadRoute() {
  return await import('@/app/api/auth/player/route')
}

describe('POST /api/auth/player', () => {
  it('returns 200, sets player_session cookie, and includes character info for ROLANDO', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/player', {
      body: { token: 'ROLANDO' },
    }) as never)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.characterName).toBe('Rolando Ornasca')
    expect(data.playerName).toBe('Mikey')
    expect(res.headers.get('set-cookie') ?? '').toMatch(/player_session=/)
  })

  it('returns 401 with an invalid token', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/player', {
      body: { token: 'NOPE' },
    }) as never)
    expect(res.status).toBe(401)
  })

  it('returns 400 when token is empty', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/player', {
      body: { token: '   ' },
    }) as never)
    expect(res.status).toBe(400)
  })

  it('normalizes lowercase and whitespace ("  rolando  " works)', async () => {
    const { POST } = await loadRoute()
    const res = await POST(mockRequest('POST', 'http://x/api/auth/player', {
      body: { token: '  rolando  ' },
    }) as never)
    expect(res.status).toBe(200)
  })

  it('updates last_active_at on the player_tokens row', async () => {
    const { POST } = await loadRoute()
    await POST(mockRequest('POST', 'http://x/api/auth/player', {
      body: { token: 'MICHAEL' },
    }) as never)
    const row = await memory.db!.execute({
      sql: `SELECT last_active_at FROM player_tokens WHERE character_id = ?`,
      args: ['michael'],
    })
    expect(row.rows[0].last_active_at).not.toBeNull()
  })

  it('persists the created session in player_sessions', async () => {
    const { POST } = await loadRoute()
    await POST(mockRequest('POST', 'http://x/api/auth/player', {
      body: { token: 'SAL' },
    }) as never)
    const rows = await memory.db!.execute(`SELECT id FROM player_sessions`)
    expect(rows.rows.length).toBe(1)
  })

  it.each(PLAYER_TOKEN_SEEDS.map((s) => [s.token, s.characterName]))(
    'works for token %s → %s',
    async (token, expectedCharacterName) => {
      const { POST } = await loadRoute()
      const res = await POST(mockRequest('POST', 'http://x/api/auth/player', {
        body: { token },
      }) as never)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.characterName).toBe(expectedCharacterName)
    }
  )
})
