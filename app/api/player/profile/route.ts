import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { initDB } from '@/lib/db'
import { getSessionFromCookies } from '@/lib/auth'

// Returns the authenticated player's basic identity. The middleware already gates
// /api/player/* on cookie presence; we re-validate here against the DB.
export async function GET() {
  await initDB()
  const ctx = await getSessionFromCookies(await cookies())
  if (!ctx || ctx.role !== 'player') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    characterId: ctx.characterId,
    characterName: ctx.characterName,
    playerName: ctx.playerName,
  })
}
