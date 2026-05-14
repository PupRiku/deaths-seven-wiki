import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { isValidEntityType } from '@/lib/reveal-entities'

async function dmGuard() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// PATCH /api/dm/reveals/:entityType/:entityId/details/reorder — accepts the
// full ordered detail-id list and rewrites every row's sort_order in one
// transaction. Caller pre-computes the order; we just persist it.
export async function PATCH(
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
  const order = body.order
  if (!Array.isArray(order) || order.some((id) => typeof id !== 'string')) {
    return NextResponse.json(
      { error: 'order must be an array of detail ids' },
      { status: 400 }
    )
  }

  // Refuse to reorder against a nonexistent entity. Without this, a request
  // like `{ order: [] }` against an unknown id would fall through both
  // empty-set checks below and silently 200, masking client/route bugs.
  // Mirrors the entity-existence check that POST /details enforces.
  const exists = await db.execute({
    sql: `SELECT id FROM entity_reveals WHERE entity_type = ? AND entity_id = ? LIMIT 1`,
    args: [entityType, entityId],
  })
  if (exists.rows.length === 0) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
  }

  // Validate that the submitted order is an exact permutation of the
  // entity's current detail IDs — no missing IDs (would leave duplicate
  // sort_orders), no unknown IDs (silently ignored UPDATEs), no duplicates.
  const current = await db.execute({
    sql: `SELECT id FROM entity_custom_details WHERE entity_type = ? AND entity_id = ?`,
    args: [entityType, entityId],
  })
  const currentIds = new Set(current.rows.map((r) => String(r.id)))
  const submittedSet = new Set(order)
  if (submittedSet.size !== order.length) {
    return NextResponse.json(
      { error: 'order contains duplicate ids' },
      { status: 400 }
    )
  }
  if (submittedSet.size !== currentIds.size) {
    return NextResponse.json(
      {
        error: `order length ${submittedSet.size} does not match current detail count ${currentIds.size}`,
      },
      { status: 400 }
    )
  }
  for (const id of submittedSet) {
    if (!currentIds.has(id)) {
      return NextResponse.json(
        { error: `unknown detail id: ${id}` },
        { status: 400 }
      )
    }
  }

  // batch() is preferred over transaction() — it runs all statements on a
  // single connection, which works with libsql's `:memory:` test mode.
  await db.batch(
    order.map((id, i) => ({
      sql: `UPDATE entity_custom_details
              SET sort_order = ?
            WHERE id = ? AND entity_type = ? AND entity_id = ?`,
      args: [i, id, entityType, entityId],
    })),
    'write'
  )

  return NextResponse.json({ success: true })
}
