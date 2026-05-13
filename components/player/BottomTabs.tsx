'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconHome2,
  IconCompass,
  IconUsers,
  IconBook2,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

type TabIcon = ComponentType<IconProps>

interface Tab {
  href: string
  label: string
  icon: TabIcon
}

const TABS: Tab[] = [
  { href: '/player', label: 'Dashboard', icon: IconHome2 },
  { href: '/player/world', label: 'World', icon: IconCompass },
  { href: '/player/party', label: 'Party', icon: IconUsers },
  { href: '/player/journal', label: 'Journal', icon: IconBook2 },
]

function isActive(tab: Tab, pathname: string | null) {
  if (!pathname) return false
  if (tab.href === '/player') return pathname === '/player'
  return pathname.startsWith(tab.href)
}

export default function BottomTabs() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Player navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--bg-base)',
        borderTop: '0.5px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
          maxWidth: '720px',
          marginInline: 'auto',
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab, pathname)
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.65rem 0.25rem 0.85rem',
                  textDecoration: 'none',
                  color: active ? 'var(--cyan-bright)' : 'var(--text-muted)',
                  borderTop: active ? '2px solid var(--cyan)' : '2px solid transparent',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                <Icon size={20} stroke={1.6} />
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
