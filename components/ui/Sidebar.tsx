'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    label: 'CAMPAIGN',
    items: [
      { icon: '📖', label: 'Chapters', href: '/chapters' },
      { icon: '👥', label: 'NPCs', href: '/npcs' },
      { icon: '🌍', label: 'Reference', href: '/reference' },
    ],
  },
  {
    label: 'SESSION',
    items: [
      { icon: '⚔️', label: 'Encounter', href: '/encounter' },
      { icon: '📝', label: 'Session Log', href: '/session-log' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="wiki-sidebar">
      {/* Logo */}
      <div className="nav-logo">
        <div className="nav-logo-title">Death's Seven</div>
        <div className="nav-logo-sub">☽ DM WIKI ✦ CAMPAIGN BIBLE ☾</div>
      </div>

      {/* Nav */}
      {NAV.map((section) => (
        <div key={section.label} className="nav-section">
          <span className="nav-section-label">{section.label}</span>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname?.startsWith(item.href) ? 'active' : ''}`}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      {/* Bottom status */}
      <div
        style={{
          marginTop: 'auto',
          padding: '1rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}
        >
          ✦ THE DEADLY SEVEN ✦
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            marginTop: '0.2rem',
          }}
        >
          Levels 3–20
        </div>
      </div>
    </aside>
  );
}
