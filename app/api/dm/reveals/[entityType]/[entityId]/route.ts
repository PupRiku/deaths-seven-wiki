import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { isValidEntityType, isValidVisibility } from '@/lib/reveal-entities'

async function dmGuard() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// PATCH /api/dm/reveals/:entityType/:entityId — update visibility and/or
// discovered_name for an entity.
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
  const visibility = body.visibility
  const discoveredName = body.discoveredName

  if (visibility !== undefined && !isValidVisibility(visibility)) {
    return NextResponse.json({ error: 'Invalid visibility' }, { status: 400 })
  }
  // Strict type check: discoveredName must be omitted, null, or a string.
  // Without this, an object body would be coerced via String(...) and persist
  // as "[object Object]", which players would then see as the display name.
  if (
    discoveredName !== undefined &&
    discoveredName !== null &&
    typeof discoveredName !== 'string'
  ) {
    return NextResponse.json(
      { error: 'discoveredName must be a string or null' },
      { status: 400 }
    )
  }

  // Confirm the row exists first so we can return 404 cleanly.
  const existing = await db.execute({
    sql: `SELECT id FROM entity_reveals WHERE entity_type = ? AND entity_id = ? LIMIT 1`,
    args: [entityType, entityId],
  })
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updates: string[] = []
  const args: (string | null)[] = []
  if (visibility !== undefined) {
    updates.push('visibility = ?')
    args.push(visibility)
  }
  if (discoveredName !== undefined) {
    updates.push('discovered_name = ?')
    // Trim-and-nullify on save: blank/whitespace becomes null so the
    // player-side fallback to "???" fires cleanly, and the DB never holds
    // a meaningless empty-string discovered name. Already validated above
    // as string | null.
    const trimmed = typeof discoveredName === 'string' ? discoveredName.trim() : null
    args.push(trimmed && trimmed.length > 0 ? trimmed : null)
  }
  // Reject requests with no actual updatable fields (matches the
  // detail-PATCH endpoint's contract). A misspelled field name or empty
  // body would otherwise silently bump updated_at and look successful.
  if (updates.length === 0) {
    return NextResponse.json(
      { error: 'No updatable fields provided' },
      { status: 400 }
    )
  }
  updates.push("updated_at = datetime('now')")

  args.push(entityType, entityId)
  await db.execute({
    sql: `UPDATE entity_reveals SET ${updates.join(', ')} WHERE entity_type = ? AND entity_id = ?`,
    args,
  })

  return NextResponse.json({ success: true })
}
