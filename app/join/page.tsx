'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CampaignHeader from '@/components/shared/CampaignHeader'

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'welcome'; characterName: string }

export default function JoinPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!token.trim()) return
    setState({ kind: 'submitting' })

    try {
      const res = await fetch('/api/auth/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        const data = await res.json()
        setState({ kind: 'welcome', characterName: String(data.characterName ?? 'Traveler') })
        setTimeout(() => router.push('/player'), 1500)
        return
      }
      const data = await res.json().catch(() => ({}))
      setState({ kind: 'error', message: data?.error ?? 'Invalid token' })
      // Re-trigger shake by removing/re-adding the class via key
      formRef.current?.classList.remove('shake')
      // Reflow to restart animation
      void formRef.current?.offsetWidth
      formRef.current?.classList.add('shake')
    } catch {
      setState({ kind: 'error', message: 'Something went wrong. Try again.' })
    }
  }

  const submitting = state.kind === 'submitting'
  const welcoming = state.kind === 'welcome'
  const errorMessage = state.kind === 'error' ? state.message : null

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .shake { animation: shakeX 0.4s ease; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <CampaignHeader subtitle="Player Companion" />
        </div>

        {welcoming && state.kind === 'welcome' && (
          <div
            role="status"
            className="card fade-in"
            style={{
              textAlign: 'center',
              padding: '2rem 1.5rem',
              borderLeft: '2px solid var(--cyan)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.18em', fontWeight: 600 }}>
              WELCOME
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--cyan-bright)', marginTop: '0.6rem' }}>
              {state.characterName}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
              Your journey continues…
            </div>
          </div>
        )}

        {!welcoming && (
          <form
            ref={formRef}
            onSubmit={submit}
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderLeft: '2px solid var(--cyan)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <label
              htmlFor="player-token"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.14em',
                fontWeight: 600,
              }}
            >
              YOUR TOKEN
            </label>
            <input
              id="player-token"
              ref={inputRef}
              type="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              className="search-input"
              style={{
                width: '100%',
                padding: '0.95rem 1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.125rem',
                letterSpacing: '0.18em',
                textAlign: 'center',
              }}
              required
              aria-invalid={errorMessage ? true : undefined}
            />
            {errorMessage && (
              <div role="alert" style={{ fontSize: '0.8125rem', color: 'var(--status-danger)' }}>
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {submitting ? 'Verifying…' : 'Enter the Realm'}
            </button>
            <Link
              href="/"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: '0.25rem',
                textDecoration: 'none',
              }}
            >
              ← Back
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
