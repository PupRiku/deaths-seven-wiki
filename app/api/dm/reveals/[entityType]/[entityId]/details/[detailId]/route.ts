import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'

async function dmGuard() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// PATCH — update title, content, and/or is_revealed for a custom detail.
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ entityType: string; entityId: string; detailId: string }> }
) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const { entityType, entityId, detailId } = await ctx.params
  const body = await req.json().catch(() => ({}))

  const existing = await db.execute({
    sql: `SELECT id FROM entity_custom_details
          WHERE id = ? AND entity_type = ? AND entity_id = ? LIMIT 1`,
    args: [detailId, entityType, entityId],
  })
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updates: string[] = []
  const args: (string | number | null)[] = []
  if (typeof body.title === 'string') {
    // Mirror the POST invariant — title must be non-empty after trimming.
    if (!body.title.trim()) {
      return NextResponse.json({ error: 'title must not be blank' }, { status: 400 })
    }
    updates.push('title = ?')
    args.push(body.title)
  }
  if (typeof body.content === 'string') {
    if (!body.content.trim()) {
      return NextResponse.json({ error: 'content must not be blank' }, { status: 400 })
    }
    updates.push('content = ?')
    args.push(body.content)
  }
  if (typeof body.isRevealed === 'boolean') {
    updates.push('is_revealed = ?')
    args.push(body.isRevealed ? 1 : 0)
    updates.push("revealed_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END")
    args.push(body.isRevealed ? 1 : 0)
  }
  if (updates.length === 0) {
    return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 })
  }

  args.push(detailId)
  await db.execute({
    sql: `UPDATE entity_custom_details SET ${updates.join(', ')} WHERE id = ?`,
    args,
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ entityType: string; entityId: string; detailId: string }> }
) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const { entityType, entityId, detailId } = await ctx.params

  const existing = await db.execute({
    sql: `SELECT id FROM entity_custom_details
          WHERE id = ? AND entity_type = ? AND entity_id = ? LIMIT 1`,
    args: [detailId, entityType, entityId],
  })
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.execute({
    sql: `DELETE FROM entity_custom_details WHERE id = ?`,
    args: [detailId],
  })

  return NextResponse.json({ success: true })
}
