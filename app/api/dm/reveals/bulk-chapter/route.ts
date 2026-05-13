import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { isValidVisibility } from '@/lib/reveal-entities'

async function dmGuard() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// POST /api/dm/reveals/bulk-chapter — set visibility for every entity whose
// chapter_association matches. Returns the affected entities so the UI can
// show a confirmation summary.
export async function POST(req: NextRequest) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const body = await req.json().catch(() => ({}))
  const chapter = Number(body.chapter)
  const visibility = body.visibility

  if (!Number.isFinite(chapter) || chapter < 1 || chapter > 20) {
    return NextResponse.json(
      { error: 'chapter must be an integer 1-20' },
      { status: 400 }
    )
  }
  if (!isValidVisibility(visibility)) {
    return NextResponse.json({ error: 'Invalid visibility' }, { status: 400 })
  }

  const affected = await db.execute({
    sql: `SELECT entity_type, entity_id FROM entity_reveals WHERE chapter_association = ?`,
    args: [chapter],
  })
  const list = affected.rows.map((r) => ({
    entityType: String(r.entity_type),
    entityId: String(r.entity_id),
  }))

  await db.execute({
    sql: `UPDATE entity_reveals SET visibility = ?, updated_at = datetime('now')
          WHERE chapter_association = ?`,
    args: [visibility, chapter],
  })

  return NextResponse.json({ success: true, updated: list.length, entities: list })
}
