import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db, initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'
import { ITEMS } from '@/data/reference'
import { loadRevealsByType } from '@/lib/reveal-data'
import { filterEntityForPlayer } from '@/lib/reveal-filter'
import type { Item } from '@/types'

export async function GET() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { reveals, fields, customDetails } = await loadRevealsByType('item', db)
  const items = ITEMS as unknown as Item[]
  const byId = new Map(items.map((i) => [i.id, i]))

  const out = []
  for (const reveal of reveals) {
    const item = byId.get(reveal.entityId)
    if (!item) continue
    const entity = filterEntityForPlayer(
      item,
      'item',
      reveal,
      fields.filter((f) => f.entityId === reveal.entityId),
      customDetails.filter((d) => d.entityId === reveal.entityId)
    )
    if (entity) out.push(entity)
  }

  return NextResponse.json(out)
}
