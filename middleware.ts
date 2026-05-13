import { NextRequest, NextResponse } from 'next/server'

const DM_COOKIE = 'dm_session'
const PLAYER_COOKIE = 'player_session'

// Middleware runs on the Edge runtime, so we only do a lightweight cookie-presence
// check here. Deep session validation (table lookup + expiry) happens in API route
// handlers and server components via lib/auth.ts.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const dm = req.cookies.get(DM_COOKIE)?.value
  const player = req.cookies.get(PLAYER_COOKIE)?.value

  // /api/dm/* — require DM cookie
  if (pathname.startsWith('/api/dm')) {
    if (!dm) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.next()
  }

  // /api/player/* — require player cookie
  if (pathname.startsWith('/api/player')) {
    if (!player) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.next()
  }

  // /dm/* — require DM cookie, redirect to landing if missing
  if (pathname.startsWith('/dm')) {
    if (!dm) {
      const url = req.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('role', 'dm')
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // /player/* — require player cookie, redirect to /join if missing
  if (pathname.startsWith('/player')) {
    if (!player) {
      const url = req.nextUrl.clone()
      url.pathname = '/join'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Everything else (/, /join, /api/auth/*, static assets) is public
  return NextResponse.next()
}

// Skip Next internals and the static images folder. The function body does the
// per-route role checks; everything else falls through unchanged.
export const config = {
  matcher: ['/((?!_next/|favicon.ico|images/).*)'],
}
