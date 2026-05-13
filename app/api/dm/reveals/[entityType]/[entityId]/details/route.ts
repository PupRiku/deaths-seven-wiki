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

  // Place new detail at the end of the existing list.
  const max = await db.execute({
    sql: `SELECT COALESCE(MAX(sort_order), -1) AS m FROM entity_custom_details
          WHERE entity_type = ? AND entity_id = ?`,
    args: [entityType, entityId],
  })
  const nextOrder = Number((max.rows[0] as Record<string, unknown>).m) + 1

  const id = crypto.randomUUID()
  await db.execute({
    sql: `INSERT INTO entity_custom_details
            (id, entity_type, entity_id, title, content, is_revealed, sort_order)
          VALUES (?, ?, ?, ?, ?, 0, ?)`,
    args: [id, entityType, entityId, title, content, nextOrder],
  })

  return NextResponse.json({ id, success: true })
}
