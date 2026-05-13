'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconBook,
  IconUsers,
  IconBooks,
  IconSwords,
  IconNotebook,
  IconShieldCheck,
  IconLogout,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

type NavIcon = ComponentType<IconProps>

const NAV: { label: string; items: { icon: NavIcon; label: string; href: string }[] }[] = [
  {
    label: 'CAMPAIGN',
    items: [
      { icon: IconBook, label: 'Chapters', href: '/dm/chapters' },
      { icon: IconUsers, label: 'NPCs', href: '/dm/npcs' },
      { icon: IconBooks, label: 'Reference', href: '/dm/reference' },
    ],
  },
  {
    label: 'SESSION',
    items: [
      { icon: IconSwords, label: 'Encounter', href: '/dm/encounter' },
      { icon: IconNotebook, label: 'Session Log', href: '/dm/session-log' },
    ],
  },
  {
    label: 'TABLE',
    items: [
      { icon: IconUsers, label: 'Manage Players', href: '/dm/players' },
    ],
  },
]

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/'
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="wiki-sidebar">
      {/* Logo */}
      <div className="nav-logo">
        <div className="nav-logo-title">Death's Seven</div>
        <div className="nav-logo-sub">DM WIKI · CAMPAIGN BIBLE</div>
        <div
          aria-label="DM View"
          style={{
            marginTop: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(232, 131, 74, 0.08)',
            border: '0.5px solid rgba(232, 131, 74, 0.4)',
            color: 'var(--orange)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.625rem',
            letterSpacing: '0.14em',
            fontWeight: 600,
          }}
        >
          <IconShieldCheck size={11} />
          DM VIEW
        </div>
      </div>

      {/* Nav */}
      {NAV.map((section) => (
        <div key={section.label} className="nav-section">
          <span className="nav-section-label">{section.label}</span>
          {section.items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname?.startsWith(item.href) ? 'active' : ''}`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}

      {/* Footer: campaign state + logout */}
      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--orange)', letterSpacing: '0.12em', fontWeight: 600 }}>
          DEATH&apos;S SEVEN
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.2rem', letterSpacing: '0.1em' }}>
          Levels 3–20
        </div>
        <button
          type="button"
          onClick={logout}
          className="btn btn-ghost"
          style={{
            marginTop: '0.75rem',
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.6875rem',
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          <IconLogout size={12} /> Sign out
        </button>
      </div>
    </aside>
  )
}
