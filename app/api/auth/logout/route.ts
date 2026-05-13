import { NextRequest, NextResponse } from 'next/server'
import { initDB } from '@/lib/db'
import { deleteSession, DM_COOKIE, PLAYER_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await initDB()

  const dm = req.cookies.get(DM_COOKIE)?.value
  const player = req.cookies.get(PLAYER_COOKIE)?.value

  if (dm) await deleteSession(dm, 'dm').catch(() => {})
  if (player) await deleteSession(player, 'player').catch(() => {})

  const res = NextResponse.json({ ok: true })
  if (dm) res.cookies.delete(DM_COOKIE)
  if (player) res.cookies.delete(PLAYER_COOKIE)
  return res
}
