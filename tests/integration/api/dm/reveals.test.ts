import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient, type Client } from '@libsql/client'

const memory: { db: Client | null } = { db: null }

vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual<typeof import('@/lib/db')>('@/lib/db')
  return {
    ...actual,
    get db() {
      return memory.db!
    },
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
import { syncReveals, _resetSyncLatchForTests } from '@/lib/reveal-sync'

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
  cookieJar.entries = {}
  _resetSyncLatchForTests()
  const { initDB } = await import('@/lib/db')
  await initDB()
  // initDB on a non-singleton client doesn't sync — sync explicitly so the
  // tables have rows to query.
  await syncReveals(memory.db!, { force: true, logger: { warn: () => {} } })
})

async function authedDm() {
  const { sessionId } = await createTestDmSession(memory.db!)
  cookieJar.entries.dm_session = sessionId
}

describe('GET /api/dm/reveals', () => {
  it('returns 401 without dm_session', async () => {
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals'))
    expect(res.status).toBe(401)
  })

  it('returns full reveal records (reveal + entity + fields + customDetails)', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    const npc = data.find((r: { reveal: { entityType: string; entityId: string } }) =>
      r.reveal.entityType === 'npc' && r.reveal.entityId === 'fizzle'
    )
    expect(npc).toBeDefined()
    expect(npc.entity.name).toBe('Fizzle')
    expect(Array.isArray(npc.fields)).toBe(true)
    expect(Array.isArray(npc.customDetails)).toBe(true)
  })

  it('filters by entity type', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?type=item'))
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    for (const rec of data) expect(rec.reveal.entityType).toBe('item')
  })

  it('filters by visibility', async () => {
    await authedDm()
    await memory.db!.execute(
      `UPDATE entity_reveals SET visibility = 'revealed' WHERE entity_type = 'npc' AND entity_id = 'fizzle'`
    )
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?visibility=revealed'))
    const data = await res.json()
    expect(data.length).toBe(1)
    expect(data[0].reveal.entityId).toBe('fizzle')
  })

  it('filters by chapter', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?chapter=9'))
    const data = await res.json()
    for (const rec of data) expect(rec.reveal.chapterAssociation).toBe(9)
  })

  it('filters by search (case-insensitive name match)', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?search=fizz'))
    const data = await res.json()
    expect(data.some((r: { entity: { name: string } }) => r.entity.name === 'Fizzle')).toBe(true)
  })
})

describe('PATCH /api/dm/reveals/:type/:id', () => {
  it('updates visibility', async () => {
    await authedDm()
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ visibility: 'revealed' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute({
      sql: `SELECT visibility FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(r.rows[0].visibility).toBe('revealed')
  })

  it('updates discovered_name', async () => {
    await authedDm()
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ discoveredName: 'A small flying friend' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    const r = await memory.db!.execute({
      sql: `SELECT discovered_name FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(r.rows[0].discovered_name).toBe('A small flying friend')
  })

  it('returns 404 for unknown entity', async () => {
    await authedDm()
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ visibility: 'revealed' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'nope' }) }
    )
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/dm/reveals/:type/:id/fields/:fieldName', () => {
  it('toggles a field reveal on and sets revealed_at', async () => {
    await authedDm()
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/fields/[fieldName]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ isRevealed: true }),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: Promise.resolve({
          entityType: 'npc',
          entityId: 'fizzle',
          fieldName: 'role',
        }),
      }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute({
      sql: `SELECT is_revealed, revealed_at FROM entity_field_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle' AND field_name = 'role'`,
    })
    expect(Number(r.rows[0].is_revealed)).toBe(1)
    expect(r.rows[0].revealed_at).not.toBeNull()
  })

  it('returns 404 for an unknown field', async () => {
    await authedDm()
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/fields/[fieldName]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ isRevealed: true }),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: Promise.resolve({
          entityType: 'npc',
          entityId: 'fizzle',
          fieldName: 'no_such_field',
        }),
      }
    )
    expect(res.status).toBe(404)
  })
})

describe('POST /api/dm/reveals/bulk', () => {
  it('updates many entities in one request', async () => {
    await authedDm()
    const { POST } = await import('@/app/api/dm/reveals/bulk/route')
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({
          entities: [
            { entityType: 'npc', entityId: 'fizzle' },
            { entityType: 'npc', entityId: 'leocraes' },
          ],
          visibility: 'discovered',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute(
      `SELECT entity_id FROM entity_reveals WHERE visibility = 'discovered' AND entity_type = 'npc'`
    )
    const ids = r.rows.map((row) => row.entity_id).sort()
    expect(ids).toEqual(['fizzle', 'leocraes'])
  })

  it('rejects empty list', async () => {
    await authedDm()
    const { POST } = await import('@/app/api/dm/reveals/bulk/route')
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({ entities: [], visibility: 'hidden' }),
        headers: { 'Content-Type': 'application/json' },
      })
    )
    expect(res.status).toBe(400)
  })
})

describe('POST /api/dm/reveals/bulk-chapter', () => {
  it('updates all entities for a chapter and returns the affected list', async () => {
    await authedDm()
    const { POST } = await import('@/app/api/dm/reveals/bulk-chapter/route')
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({ chapter: 9, visibility: 'revealed' }),
        headers: { 'Content-Type': 'application/json' },
      })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.updated).toBeGreaterThan(0)
    expect(Array.isArray(data.entities)).toBe(true)
    const r = await memory.db!.execute(
      `SELECT COUNT(*) AS c FROM entity_reveals WHERE chapter_association = 9 AND visibility = 'revealed'`
    )
    expect(Number((r.rows[0] as Record<string, unknown>).c)).toBe(data.updated)
  })
})

describe('Custom details CRUD', () => {
  it('POST creates a custom detail at the end of sort_order', async () => {
    await authedDm()
    const { POST } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/route'
    )
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({ title: 'A note', content: 'Body' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(typeof data.id).toBe('string')
    // Server returns the assigned sort_order so the client doesn't have to
    // guess; this protects optimistic UI from drift after deletes/reorders.
    expect(data.sortOrder).toBe(0)
    const r = await memory.db!.execute(
      `SELECT title, content, sort_order FROM entity_custom_details WHERE entity_type = 'npc' AND entity_id = 'fizzle'`
    )
    expect(r.rows.length).toBe(1)
    expect(r.rows[0].title).toBe('A note')
    expect(Number(r.rows[0].sort_order)).toBe(0)
  })

  it('POST returns the next sort_order after non-contiguous deletes', async () => {
    await authedDm()
    // Pre-seed details with sort_orders 0, 1, 2 then delete the middle one
    // so we have orders [0, 2] — non-contiguous.
    for (const [id, order] of [['a', 0], ['b', 1], ['c', 2]] as const) {
      await memory.db!.execute({
        sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
              VALUES (?, 'npc', 'fizzle', ?, 'X', 0, ?)`,
        args: [id, id, order],
      })
    }
    await memory.db!.execute(`DELETE FROM entity_custom_details WHERE id = 'b'`)

    const { POST } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/route'
    )
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({ title: 'New', content: 'Body' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    const data = await res.json()
    // Must be MAX(2)+1 = 3, NOT length-1 = 2 (which would collide with 'c').
    expect(data.sortOrder).toBe(3)
  })

  it('PATCH rejects blank/whitespace title (mirrors POST invariant)', async () => {
    await authedDm()
    const detailId = 'det-blank-title'
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES (?, 'npc', 'fizzle', 'Old', 'Old', 0, 0)`,
      args: [detailId],
    })
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/[detailId]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ title: '   ' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle', detailId }) }
    )
    expect(res.status).toBe(400)
  })

  it('PATCH rejects wrong-typed title (e.g. number) instead of silently ignoring', async () => {
    await authedDm()
    const detailId = 'det-bad-title-type'
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES (?, 'npc', 'fizzle', 'Old', 'Old', 0, 0)`,
      args: [detailId],
    })
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/[detailId]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ title: 123, content: 'Body' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle', detailId }) }
    )
    expect(res.status).toBe(400)
    // Confirm title is unchanged.
    const r = await memory.db!.execute({
      sql: `SELECT title FROM entity_custom_details WHERE id = ?`,
      args: [detailId],
    })
    expect(r.rows[0].title).toBe('Old')
  })

  it('PATCH rejects wrong-typed isRevealed (e.g. string) instead of silently ignoring', async () => {
    await authedDm()
    const detailId = 'det-bad-revealed-type'
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES (?, 'npc', 'fizzle', 'Old', 'Old', 0, 0)`,
      args: [detailId],
    })
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/[detailId]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ isRevealed: 'yes', title: 'New' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle', detailId }) }
    )
    expect(res.status).toBe(400)
    const r = await memory.db!.execute({
      sql: `SELECT title, is_revealed FROM entity_custom_details WHERE id = ?`,
      args: [detailId],
    })
    // Whole request rejected — title also unchanged.
    expect(r.rows[0].title).toBe('Old')
    expect(Number(r.rows[0].is_revealed)).toBe(0)
  })

  it('PATCH rejects blank content (mirrors POST invariant)', async () => {
    await authedDm()
    const detailId = 'det-blank-content'
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES (?, 'npc', 'fizzle', 'Old', 'Old', 0, 0)`,
      args: [detailId],
    })
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/[detailId]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ content: '' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle', detailId }) }
    )
    expect(res.status).toBe(400)
  })

  it('PATCH updates title, content, and reveal state', async () => {
    await authedDm()
    const detailId = 'det-1'
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES (?, 'npc', 'fizzle', 'Old', 'Old', 0, 0)`,
      args: [detailId],
    })
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/[detailId]/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'New', content: 'Body', isRevealed: true }),
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        params: Promise.resolve({
          entityType: 'npc',
          entityId: 'fizzle',
          detailId,
        }),
      }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute({
      sql: `SELECT title, content, is_revealed, revealed_at FROM entity_custom_details WHERE id = ?`,
      args: [detailId],
    })
    expect(r.rows[0].title).toBe('New')
    expect(r.rows[0].content).toBe('Body')
    expect(Number(r.rows[0].is_revealed)).toBe(1)
    expect(r.rows[0].revealed_at).not.toBeNull()
  })

  it('DELETE removes a detail', async () => {
    await authedDm()
    const detailId = 'det-2'
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES (?, 'npc', 'fizzle', 'X', 'Y', 0, 0)`,
      args: [detailId],
    })
    const { DELETE } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/[detailId]/route'
    )
    const res = await DELETE(
      new NextRequest('http://x', { method: 'DELETE' }),
      {
        params: Promise.resolve({
          entityType: 'npc',
          entityId: 'fizzle',
          detailId,
        }),
      }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute({
      sql: `SELECT id FROM entity_custom_details WHERE id = ?`,
      args: [detailId],
    })
    expect(r.rows.length).toBe(0)
  })

  it('reorder PATCH updates sort_order for all details', async () => {
    await authedDm()
    for (const [id, order] of [
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ] as const) {
      await memory.db!.execute({
        sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
              VALUES (?, 'npc', 'fizzle', ?, 'X', 0, ?)`,
        args: [id, id, order],
      })
    }
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/reorder/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ order: ['c', 'a', 'b'] }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute(
      `SELECT id, sort_order FROM entity_custom_details ORDER BY sort_order`
    )
    expect(r.rows.map((row) => row.id)).toEqual(['c', 'a', 'b'])
  })

  it('reorder PATCH rejects a list missing existing detail ids', async () => {
    await authedDm()
    for (const [id, order] of [['a', 0], ['b', 1], ['c', 2]] as const) {
      await memory.db!.execute({
        sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
              VALUES (?, 'npc', 'fizzle', ?, 'X', 0, ?)`,
        args: [id, id, order],
      })
    }
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/reorder/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ order: ['a', 'b'] }), // missing 'c'
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(400)
  })

  it('reorder PATCH rejects unknown detail ids', async () => {
    await authedDm()
    await memory.db!.execute({
      sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
            VALUES ('a', 'npc', 'fizzle', 'a', 'X', 0, 0)`,
    })
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/reorder/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ order: ['ghost-id'] }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(400)
  })

  it('reorder PATCH rejects duplicate ids in the list', async () => {
    await authedDm()
    for (const [id, order] of [['a', 0], ['b', 1]] as const) {
      await memory.db!.execute({
        sql: `INSERT INTO entity_custom_details (id, entity_type, entity_id, title, content, is_revealed, sort_order)
              VALUES (?, 'npc', 'fizzle', ?, 'X', 0, ?)`,
        args: [id, id, order],
      })
    }
    const { PATCH } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/reorder/route'
    )
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ order: ['a', 'a'] }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(400)
  })

  it('POST custom detail returns 404 when the entity reveal row does not exist', async () => {
    await authedDm()
    const { POST } = await import(
      '@/app/api/dm/reveals/[entityType]/[entityId]/details/route'
    )
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({ title: 'X', content: 'Y' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'no-such-entity' }) }
    )
    expect(res.status).toBe(404)
  })
})

describe('Bulk endpoints — count + validation hardening', () => {
  it('POST /bulk reports rowsAffected, not entities.length (handles unknown ids gracefully)', async () => {
    await authedDm()
    const { POST } = await import('@/app/api/dm/reveals/bulk/route')
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({
          entities: [
            { entityType: 'npc', entityId: 'fizzle' }, // exists
            { entityType: 'npc', entityId: 'no-such-npc' }, // does not exist
          ],
          visibility: 'discovered',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.updated).toBe(1) // only the existing one — not the request length of 2
  })

  it('POST /bulk-chapter rejects non-integer chapter values like 1.5', async () => {
    await authedDm()
    const { POST } = await import('@/app/api/dm/reveals/bulk-chapter/route')
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({ chapter: 1.5, visibility: 'discovered' }),
        headers: { 'Content-Type': 'application/json' },
      })
    )
    expect(res.status).toBe(400)
  })
})

describe('GET /api/dm/reveals — strict filter validation', () => {
  it('returns 400 for an invalid type filter value (instead of silently dropping)', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?type=bogus'))
    expect(res.status).toBe(400)
  })

  it('returns 400 for an invalid visibility filter value', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?visibility=maybe'))
    expect(res.status).toBe(400)
  })

  it('returns 400 for a non-integer chapter filter', async () => {
    await authedDm()
    const { GET } = await import('@/app/api/dm/reveals/route')
    const res = await GET(new NextRequest('http://x/api/dm/reveals?chapter=1.5'))
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/dm/reveals/:type/:id — discoveredName type validation', () => {
  it('rejects an object discoveredName (would otherwise persist "[object Object]")', async () => {
    await authedDm()
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ discoveredName: { foo: 1 } }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(400)
    // Confirm nothing was persisted.
    const r = await memory.db!.execute({
      sql: `SELECT discovered_name FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(r.rows[0].discovered_name).toBeNull()
  })

  it('rejects a number discoveredName', async () => {
    await authedDm()
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ discoveredName: 42 }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(400)
  })

  it('trims blank/whitespace discoveredName to NULL on save (so player sees ??? fallback)', async () => {
    await authedDm()
    await memory.db!.execute({
      sql: `UPDATE entity_reveals SET discovered_name = 'Old' WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ discoveredName: '   ' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute({
      sql: `SELECT discovered_name FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(r.rows[0].discovered_name).toBeNull()
  })

  it('trims surrounding whitespace from a real discoveredName', async () => {
    await authedDm()
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ discoveredName: '  The Golden Man  ' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'avarus' }) }
    )
    const r = await memory.db!.execute({
      sql: `SELECT discovered_name FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'avarus'`,
    })
    expect(r.rows[0].discovered_name).toBe('The Golden Man')
  })

  it('still accepts null (clears the discovered_name)', async () => {
    await authedDm()
    await memory.db!.execute({
      sql: `UPDATE entity_reveals SET discovered_name = 'Old name' WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    const { PATCH } = await import('@/app/api/dm/reveals/[entityType]/[entityId]/route')
    const res = await PATCH(
      new NextRequest('http://x', {
        method: 'PATCH',
        body: JSON.stringify({ discoveredName: null }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: Promise.resolve({ entityType: 'npc', entityId: 'fizzle' }) }
    )
    expect(res.status).toBe(200)
    const r = await memory.db!.execute({
      sql: `SELECT discovered_name FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(r.rows[0].discovered_name).toBeNull()
  })
})

describe('POST /api/dm/reveals/bulk — duplicate handling', () => {
  it('deduplicates (entityType, entityId) pairs so updated count reflects distinct rows', async () => {
    await authedDm()
    const { POST } = await import('@/app/api/dm/reveals/bulk/route')
    const res = await POST(
      new NextRequest('http://x', {
        method: 'POST',
        body: JSON.stringify({
          entities: [
            { entityType: 'npc', entityId: 'fizzle' },
            { entityType: 'npc', entityId: 'fizzle' }, // duplicate
            { entityType: 'npc', entityId: 'fizzle' }, // duplicate
            { entityType: 'npc', entityId: 'leocraes' },
          ],
          visibility: 'discovered',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    // Two distinct entities, regardless of how many times each was listed.
    expect(data.updated).toBe(2)
  })
})
