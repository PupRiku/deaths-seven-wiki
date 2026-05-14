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

// PATCH /api/dm/reveals/:entityType/:entityId/fields/:fieldName — toggle a
// single field reveal on/off. Sets revealed_at when revealing.
export async function PATCH(
  req: NextRequest,
  ctx: {
    params: Promise<{ entityType: string; entityId: string; fieldName: string }>
  }
) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const { entityType, entityId, fieldName } = await ctx.params
  if (!isValidEntityType(entityType)) {
    return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  if (typeof body.isRevealed !== 'boolean') {
    return NextResponse.json({ error: 'isRevealed must be a boolean' }, { status: 400 })
  }

  // The field row name is URL-decoded by Next.js automatically.
  const decodedField = decodeURIComponent(fieldName)

  const existing = await db.execute({
    sql: `SELECT id FROM entity_field_reveals WHERE entity_type = ? AND entity_id = ? AND field_name = ? LIMIT 1`,
    args: [entityType, entityId, decodedField],
  })
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Field not found' }, { status: 404 })
  }

  await db.execute({
    sql: `UPDATE entity_field_reveals
            SET is_revealed = ?,
                revealed_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END
          WHERE entity_type = ? AND entity_id = ? AND field_name = ?`,
    args: [
      body.isRevealed ? 1 : 0,
      body.isRevealed ? 1 : 0,
      entityType,
      entityId,
      decodedField,
    ],
  })

  return NextResponse.json({ success: true })
}
