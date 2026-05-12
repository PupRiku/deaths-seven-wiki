'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconBook,
  IconUsers,
  IconBooks,
  IconSwords,
  IconNotebook,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

type NavIcon = ComponentType<IconProps>

const NAV: { label: string; items: { icon: NavIcon; label: string; href: string }[] }[] = [
  {
    label: 'CAMPAIGN',
    items: [
      { icon: IconBook, label: 'Chapters', href: '/chapters' },
      { icon: IconUsers, label: 'NPCs', href: '/npcs' },
      { icon: IconBooks, label: 'Reference', href: '/reference' },
    ],
  },
  {
    label: 'SESSION',
    items: [
      { icon: IconSwords, label: 'Encounter', href: '/encounter' },
      { icon: IconNotebook, label: 'Session Log', href: '/session-log' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="wiki-sidebar">
      {/* Logo */}
      <div className="nav-logo">
        <div className="nav-logo-title">Death's Seven</div>
        <div className="nav-logo-sub">DM WIKI · CAMPAIGN BIBLE</div>
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

      {/* Campaign state */}
      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--orange)', letterSpacing: '0.12em', fontWeight: 600 }}>
          DEATH&apos;S SEVEN
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.2rem', letterSpacing: '0.1em' }}>
          Levels 3–20
        </div>
      </div>
    </aside>
  )
}
