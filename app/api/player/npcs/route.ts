import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { npcs } from '@/data/npcs'
import { loadRevealsByType } from '@/lib/reveal-data'
import { filterEntityForPlayer } from '@/lib/reveal-filter'

// Player NPC endpoint. Filters all data through filterEntityForPlayer() so
// hidden NPCs are completely absent from the response and discovered NPCs
// only carry physical/appearance data — not name, role, description, etc.
export async function GET() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { reveals, fields, customDetails } = await loadRevealsByType('npc', db)
  const npcsById = new Map(npcs.map((n) => [n.id, n]))

  const out = []
  for (const reveal of reveals) {
    const npc = npcsById.get(reveal.entityId)
    if (!npc) continue
    const entity = filterEntityForPlayer(
      npc,
      'npc',
      reveal,
      fields.filter((f) => f.entityId === reveal.entityId),
      customDetails.filter((d) => d.entityId === reveal.entityId)
    )
    if (entity) out.push(entity)
  }

  return NextResponse.json(out)
}
