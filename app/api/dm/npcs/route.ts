import { NextRequest, NextResponse } from 'next/server'
import { npcs, searchNPCs } from '@/data/npcs/index'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const tag = searchParams.get('tag')
  const alignment = searchParams.get('alignment')
  const id = searchParams.get('id')

  if (id) {
    const npc = npcs.find((n) => n.id === id)
    return npc ? NextResponse.json(npc) : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (q) return NextResponse.json(searchNPCs(q))
  if (tag) return NextResponse.json(npcs.filter((n) => n.tags.includes(tag)))
  if (alignment) return NextResponse.json(npcs.filter((n) => n.alignment === alignment))
  return NextResponse.json(npcs)
}
