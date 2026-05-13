'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { IconShield, IconSparkles } from '@tabler/icons-react'
import CampaignHeader from '@/components/shared/CampaignHeader'

type Mode = 'choose' | 'dm'

function LandingInner() {
  const router = useRouter()
  const search = useSearchParams()
  const [mode, setMode] = useState<Mode>('choose')
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const passphraseRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (search.get('role') === 'dm') setMode('dm')
  }, [search])

  useEffect(() => {
    if (mode === 'dm') passphraseRef.current?.focus()
  }, [mode])

  async function submitDm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      })
      if (res.ok) {
        router.push('/dm')
        return
      }
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? 'Invalid passphrase')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <CampaignHeader subtitle="Campaign Companion" />
      </div>

      {mode === 'choose' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setMode('dm')}
            className="card"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '1.1rem 1.25rem',
              width: '100%',
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderLeft: '2px solid var(--orange)',
            }}
          >
            <IconShield size={20} style={{ color: 'var(--orange)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--text-accent)', letterSpacing: '0.08em', fontWeight: 600 }}>
                Enter as Dungeon Master
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Campaign bible, encounter tools, session log
              </div>
            </div>
          </button>

          <Link
            href="/join"
            className="card"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '1.1rem 1.25rem',
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderLeft: '2px solid var(--cyan)',
              textDecoration: 'none',
            }}
          >
            <IconSparkles size={20} style={{ color: 'var(--cyan)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--text-accent)', letterSpacing: '0.08em', fontWeight: 600 }}>
                Enter as Player
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Your character, the world, the party
              </div>
            </div>
          </Link>
        </div>
      )}

      {mode === 'dm' && (
        <form
          onSubmit={submitDm}
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderLeft: '2px solid var(--orange)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <label
            htmlFor="dm-passphrase"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            DM PASSPHRASE
          </label>
          <input
            id="dm-passphrase"
            ref={passphraseRef}
            type="password"
            autoComplete="current-password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="search-input"
            style={{ width: '100%', padding: '0.75rem 0.85rem' }}
            required
          />
          {error && (
            <div role="alert" style={{ fontSize: '0.8125rem', color: 'var(--status-danger)' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setMode('choose'); setError(null) }}
              className="btn btn-ghost"
              style={{ flex: 1 }}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ flex: 2 }}
            >
              {submitting ? 'Entering…' : 'Enter the Wiki'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function LandingPage() {
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
      <Suspense fallback={null}>
        <LandingInner />
      </Suspense>
    </div>
  )
}
