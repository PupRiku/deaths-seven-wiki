import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { LOCATIONS } from '@/data/reference'
import { loadRevealsByType } from '@/lib/reveal-data'
import { filterEntityForPlayer } from '@/lib/reveal-filter'
import type { ReferenceLocation } from '@/types'

export async function GET() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { reveals, fields, customDetails } = await loadRevealsByType(
    'location',
    db
  )
  const locs = LOCATIONS as unknown as ReferenceLocation[]
  const byId = new Map(locs.map((l) => [l.id, l]))

  const out = []
  for (const reveal of reveals) {
    const loc = byId.get(reveal.entityId)
    if (!loc) continue
    const entity = filterEntityForPlayer(
      loc,
      'location',
      reveal,
      fields.filter((f) => f.entityId === reveal.entityId),
      customDetails.filter((d) => d.entityId === reveal.entityId)
    )
    if (entity) out.push(entity)
  }

  return NextResponse.json(out)
}
