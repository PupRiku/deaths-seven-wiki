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
