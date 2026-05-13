interface RequestInit2 {
  body?: unknown
  cookies?: Record<string, string>
  headers?: Record<string, string>
}

// Build a Request object suitable for invoking Next.js Route Handlers directly
// (handlers accept the Web Request object). Cookies are serialized into a
// single Cookie header; JSON bodies are stringified and Content-Type set.
export function mockRequest(method: string, url: string, init: RequestInit2 = {}): Request {
  const headers = new Headers(init.headers ?? {})

  if (init.cookies && Object.keys(init.cookies).length > 0) {
    const cookie = Object.entries(init.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
    headers.set('Cookie', cookie)
  }

  let body: BodyInit | undefined
  if (init.body !== undefined) {
    if (typeof init.body === 'string' || init.body instanceof Uint8Array) {
      body = init.body as BodyInit
    } else {
      body = JSON.stringify(init.body)
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    }
  }

  return new Request(url, { method, headers, body })
}
