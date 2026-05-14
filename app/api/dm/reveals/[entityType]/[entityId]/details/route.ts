import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { isValidEntityType } from '@/lib/reveal-entities'

async function dmGuard() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// POST /api/dm/reveals/:entityType/:entityId/details — create a custom
// detail. New details default to is_revealed=0; sort_order is appended last.
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ entityType: string; entityId: string }> }
) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const { entityType, entityId } = await ctx.params
  if (!isValidEntityType(entityType)) {
    return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const title = typeof body.title === 'string' ? body.title : ''
  const content = typeof body.content === 'string' ? body.content : ''
  if (!title.trim() || !content.trim()) {
    return NextResponse.json(
      { error: 'title and content are required' },
      { status: 400 }
    )
  }

  // Refuse to create orphan custom details — the entity must have an
  // existing reveal row (i.e. it exists in the data files and has been
  // synced). Otherwise these rows would be invisible everywhere.
  const exists = await db.execute({
    sql: `SELECT id FROM entity_reveals WHERE entity_type = ? AND entity_id = ? LIMIT 1`,
    args: [entityType, entityId],
  })
  if (exists.rows.length === 0) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
  }

  // Compute the next sort_order INLINE in the INSERT via subquery, so two
  // concurrent POSTs can't both read the same MAX and produce duplicate
  // orders. SQLite serializes writes per-database so the subquery + insert
  // are evaluated atomically within a single statement.
  const id = crypto.randomUUID()
  await db.execute({
    sql: `INSERT INTO entity_custom_details
            (id, entity_type, entity_id, title, content, is_revealed, sort_order)
          VALUES (
            ?, ?, ?, ?, ?, 0,
            (SELECT COALESCE(MAX(sort_order), -1) + 1
               FROM entity_custom_details
              WHERE entity_type = ? AND entity_id = ?)
          )`,
    args: [id, entityType, entityId, title, content, entityType, entityId],
  })

  // Read back the actually-assigned sort_order so the client's optimistic
  // update matches the persisted value. The client used to assume
  // `customDetails.length` which diverges after deletes leave non-contiguous
  // orders; same problem applies to a second read of MAX().
  const inserted = await db.execute({
    sql: `SELECT sort_order FROM entity_custom_details WHERE id = ?`,
    args: [id],
  })
  const sortOrder = Number(
    (inserted.rows[0] as Record<string, unknown>).sort_order
  )
  return NextResponse.json({ id, sortOrder, success: true })
}
