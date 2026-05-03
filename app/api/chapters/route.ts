import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const num = searchParams.get('number')

  if (!num) {
    // Return index
    const { chapterIndex } = await import('@/data/chapters/index')
    return NextResponse.json(chapterIndex)
  }

  const n = parseInt(num)
  if (isNaN(n) || n < 1 || n > 20) {
    return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 })
  }

  try {
    const padded = String(n).padStart(2, '0')
    const mod = await import(`@/data/chapters/chapter${padded}`)
    return NextResponse.json(mod.default)
  } catch {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  }
}
