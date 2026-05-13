import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'

// Returns the authenticated player's basic identity. The middleware already gates
// /api/player/* on cookie presence; we re-validate here against the DB.
// `getSessionForRole('player')` only inspects player_session, so a stray
// dm_session cookie can't shadow a valid player session.
export async function GET() {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    characterId: ctx.characterId,
    characterName: ctx.characterName,
    playerName: ctx.playerName,
  })
}
