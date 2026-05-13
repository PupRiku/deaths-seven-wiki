import { NextRequest, NextResponse } from 'next/server'
import { initDB } from '@/lib/db'
import { createDmSession, hashPassphrase, DM_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await initDB()

  let body: { passphrase?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const passphrase = typeof body.passphrase === 'string' ? body.passphrase : ''
  if (!passphrase) {
    return NextResponse.json({ error: 'Passphrase required' }, { status: 400 })
  }

  const expected = process.env.DM_PASSPHRASE_HASH
  if (!expected) {
    return NextResponse.json(
      { error: 'DM_PASSPHRASE_HASH not configured. See .env.local.example.' },
      { status: 500 }
    )
  }

  if (hashPassphrase(passphrase) !== expected) {
    return NextResponse.json({ error: 'Invalid passphrase' }, { status: 401 })
  }

  const sessionId = await createDmSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(DM_COOKIE, sessionId, SESSION_COOKIE_OPTIONS)
  return res
}
