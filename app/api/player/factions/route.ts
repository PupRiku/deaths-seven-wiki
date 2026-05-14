import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { FACTIONS } from '@/data/reference'
import { loadRevealsByType } from '@/lib/reveal-data'
import { filterEntityForPlayer } from '@/lib/reveal-filter'
import type { Faction } from '@/types'

export async function GET() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { reveals, fields, customDetails } = await loadRevealsByType(
    'faction',
    db
  )
  const factions = FACTIONS as unknown as Faction[]
  const byId = new Map(factions.map((f) => [f.id, f]))

  const out = []
  for (const reveal of reveals) {
    const faction = byId.get(reveal.entityId)
    if (!faction) continue
    const entity = filterEntityForPlayer(
      faction,
      'faction',
      reveal,
      fields.filter((f) => f.entityId === reveal.entityId),
      customDetails.filter((d) => d.entityId === reveal.entityId)
    )
    if (entity) out.push(entity)
  }

  return NextResponse.json(out)
}
