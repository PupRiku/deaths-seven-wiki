import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { LOCATIONS } from '@/data/reference'
import { loadRevealsByType } from '@/lib/reveal-data'
import {
  buildVisibilityIndex,
  filterEntityForPlayer,
} from '@/lib/reveal-filter'
import type { ReferenceLocation } from '@/types'

export async function GET() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Load both location reveals (what we're returning) AND NPC reveals (so
  // location.npcsPresent can be filtered to only NPCs the player can also
  // see — emitting opaque pids for hidden NPCs would still leak existence).
  const [locationData, npcData] = await Promise.all([
    loadRevealsByType('location', db),
    loadRevealsByType('npc', db),
  ])
  const filterContext = buildVisibilityIndex(npcData.reveals)

  const locs = LOCATIONS as unknown as ReferenceLocation[]
  const byId = new Map(locs.map((l) => [l.id, l]))

  const out = []
  for (const reveal of locationData.reveals) {
    const loc = byId.get(reveal.entityId)
    if (!loc) continue
    const entity = filterEntityForPlayer(
      loc,
      'location',
      reveal,
      locationData.fields.filter((f) => f.entityId === reveal.entityId),
      locationData.customDetails.filter((d) => d.entityId === reveal.entityId),
      filterContext
    )
    if (entity) out.push(entity)
  }

  return NextResponse.json(out)
}
