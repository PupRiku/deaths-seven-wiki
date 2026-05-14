import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { loadReveals } from '@/lib/reveal-data'
import { getEntity, isValidEntityType, isValidVisibility } from '@/lib/reveal-entities'
import type { EntityType, Visibility } from '@/types'

async function dmGuard() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

// GET /api/dm/reveals — full reveal data for the DM Reveal Manager.
// Returns each entity's reveal row + the source entity data + all field
// reveals + all custom details. Filters apply via query params.
export async function GET(req: NextRequest) {
  const blocked = await dmGuard()
  if (blocked) return blocked

  const { searchParams } = new URL(req.url)

  // Strict parse: any unknown value in `type` or `visibility` is a 400, not
  // a silent drop. Silent dropping made `?type=bogus` return everything,
  // which masked client bugs.
  const rawTypes = searchParams.get('type')?.split(',')
  let typeFilter: EntityType[] | undefined
  if (rawTypes) {
    for (const t of rawTypes) {
      if (!isValidEntityType(t)) {
        return NextResponse.json(
          { error: `Invalid type filter value: ${t}` },
          { status: 400 }
        )
      }
    }
    typeFilter = rawTypes as EntityType[]
  }

  const rawVis = searchParams.get('visibility')?.split(',')
  let visibilityFilter: Visibility[] | undefined
  if (rawVis) {
    for (const v of rawVis) {
      if (!isValidVisibility(v)) {
        return NextResponse.json(
          { error: `Invalid visibility filter value: ${v}` },
          { status: 400 }
        )
      }
    }
    visibilityFilter = rawVis as Visibility[]
  }

  const chapterRaw = searchParams.get('chapter')
  let chapterFilter: number | null = null
  if (chapterRaw !== null) {
    const n = Number(chapterRaw)
    if (!Number.isInteger(n)) {
      return NextResponse.json(
        { error: 'chapter filter must be an integer' },
        { status: 400 }
      )
    }
    chapterFilter = n
  }

  const search = searchParams.get('search')?.toLowerCase() ?? null

  const { reveals, fields, customDetails } = await loadReveals(db)

  const out = []
  for (const reveal of reveals) {
    if (typeFilter && typeFilter.length > 0 && !typeFilter.includes(reveal.entityType)) continue
    if (visibilityFilter && visibilityFilter.length > 0 && !visibilityFilter.includes(reveal.visibility)) continue
    if (chapterFilter !== null && reveal.chapterAssociation !== chapterFilter) continue

    const entity = getEntity(reveal.entityType, reveal.entityId)
    if (!entity) continue

    if (search) {
      const name = entity.name.toLowerCase()
      const discovered = reveal.discoveredName?.toLowerCase() ?? ''
      if (!name.includes(search) && !discovered.includes(search)) continue
    }

    out.push({
      reveal,
      entity,
      fields: fields.filter(
        (f) => f.entityType === reveal.entityType && f.entityId === reveal.entityId
      ),
      customDetails: customDetails.filter(
        (d) => d.entityType === reveal.entityType && d.entityId === reveal.entityId
      ),
    })
  }

  return NextResponse.json(out)
}
