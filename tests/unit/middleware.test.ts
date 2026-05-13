import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '../../middleware'

const BASE = 'http://localhost:3000'

function req(path: string, cookies: Record<string, string> = {}): NextRequest {
  const r = new NextRequest(`${BASE}${path}`)
  for (const [k, v] of Object.entries(cookies)) {
    r.cookies.set(k, v)
  }
  return r
}

describe('public routes', () => {
  it('lets / through with no cookies', () => {
    const res = middleware(req('/'))
    expect(res.status).toBe(200)
  })

  it('lets /join through with no cookies', () => {
    const res = middleware(req('/join'))
    expect(res.status).toBe(200)
  })

  it('lets /api/auth/dm through (auth endpoints are public)', () => {
    const res = middleware(req('/api/auth/dm'))
    expect(res.status).toBe(200)
  })
})

describe('/dm/* page routes', () => {
  it('redirects to / when no dm_session cookie', () => {
    const res = middleware(req('/dm/chapters'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/?role=dm')
  })

  it('lets DM through with dm_session cookie present', () => {
    const res = middleware(req('/dm/chapters', { dm_session: 'any-value' }))
    expect(res.status).toBe(200)
  })

  it('redirects DM routes when only a player cookie is present', () => {
    const res = middleware(req('/dm/chapters', { player_session: 'p-value' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/?role=dm')
  })
})

describe('/player/* page routes', () => {
  it('redirects to /join when no player_session cookie', () => {
    const res = middleware(req('/player'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/join')
  })

  it('lets player through with player_session cookie present', () => {
    const res = middleware(req('/player/world', { player_session: 'p-value' }))
    expect(res.status).toBe(200)
  })

  it('redirects player routes when only a dm cookie is present', () => {
    const res = middleware(req('/player', { dm_session: 'd-value' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/join')
  })
})

describe('/api/dm/* routes', () => {
  it('returns 401 when no dm_session cookie', async () => {
    const res = middleware(req('/api/dm/chapters'))
    expect(res.status).toBe(401)
  })

  it('passes through with dm_session cookie', () => {
    const res = middleware(req('/api/dm/chapters', { dm_session: 'd-value' }))
    expect(res.status).toBe(200)
  })
})

describe('/api/player/* routes', () => {
  it('returns 401 when no player_session cookie', () => {
    const res = middleware(req('/api/player/profile'))
    expect(res.status).toBe(401)
  })

  it('passes through with player_session cookie', () => {
    const res = middleware(req('/api/player/profile', { player_session: 'p-value' }))
    expect(res.status).toBe(200)
  })
})
