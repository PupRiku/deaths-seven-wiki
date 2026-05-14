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

// POST /api/dm/reveals/bulk — set visibility for many entities in one
// transaction. Used by the multi-select bulk action bar in the Reveal Manager.
export async function POST(req: NextRequest) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const body = await req.json().catch(() => ({}))
  const { entities, visibility } = body

  if (!Array.isArray(entities) || entities.length === 0) {
    return NextResponse.json(
      { error: 'entities must be a non-empty array' },
      { status: 400 }
    )
  }
  if (!isValidVisibility(visibility)) {
    return NextResponse.json({ error: 'Invalid visibility' }, { status: 400 })
  }

  for (const e of entities) {
    if (!e || typeof e !== 'object' || !isValidEntityType(e.entityType) || typeof e.entityId !== 'string') {
      return NextResponse.json({ error: 'Invalid entity in list' }, { status: 400 })
    }
  }

  // Deduplicate (entityType, entityId) pairs before batching. Without this,
  // a request that listed the same entity twice would run two UPDATEs and
  // the rowsAffected sum would over-count: 2 instead of 1 distinct row
  // changed. The summary count needs to reflect distinct rows.
  const seen = new Set<string>()
  const unique: Array<{ entityType: string; entityId: string }> = []
  for (const e of entities) {
    const key = `${e.entityType}:${e.entityId}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push({ entityType: e.entityType, entityId: e.entityId })
  }

  // libsql `batch()` runs all statements atomically on a single connection —
  // safer than `transaction()` for in-memory test databases where transactions
  // can split across connections.
  const results = await db.batch(
    unique.map((e) => ({
      sql: `UPDATE entity_reveals SET visibility = ?, updated_at = datetime('now')
            WHERE entity_type = ? AND entity_id = ?`,
      args: [visibility, e.entityType, e.entityId],
    })),
    'write'
  )

  // Sum of rowsAffected across the deduped batch — accurate count of
  // distinct rows actually updated (existing entities only).
  const updated = results.reduce((acc, r) => acc + Number(r.rowsAffected ?? 0), 0)
  return NextResponse.json({ success: true, updated })
}
