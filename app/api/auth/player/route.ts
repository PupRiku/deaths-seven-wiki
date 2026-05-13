import { NextRequest, NextResponse } from 'next/server'
import { db, initDB } from '@/lib/db'
import { createPlayerSession, hashToken, PLAYER_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await initDB()

  let body: { token?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const raw = typeof body.token === 'string' ? body.token : ''
  if (!raw.trim()) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const tokenHash = hashToken(raw)
  const result = await db.execute({
    sql: `SELECT id, character_name, player_name FROM player_tokens WHERE token_hash = ? LIMIT 1`,
    args: [tokenHash],
  })

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const row = result.rows[0]
  const playerTokenId = String(row.id)
  const characterName = String(row.character_name)
  const playerName = String(row.player_name)

  const sessionId = await createPlayerSession(playerTokenId)
  const res = NextResponse.json({ ok: true, characterName, playerName })
  res.cookies.set(PLAYER_COOKIE, sessionId, SESSION_COOKIE_OPTIONS)
  return res
}
