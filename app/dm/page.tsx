'use client'

import Link from 'next/link'
import {
  IconBook,
  IconUsers,
  IconSwords,
  IconNotebook,
  IconBooks,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

type QuickIcon = ComponentType<IconProps>

const QUICK_LINKS: { icon: QuickIcon; label: string; sub: string; href: string }[] = [
  { icon: IconBook, label: 'Chapters', sub: 'Full module content', href: '/dm/chapters' },
  { icon: IconUsers, label: 'NPCs', sub: 'Searchable reference', href: '/dm/npcs' },
  { icon: IconSwords, label: 'Encounter', sub: 'Initiative & stat blocks', href: '/dm/encounter' },
  { icon: IconNotebook, label: 'Session Log', sub: 'Live notes & export', href: '/dm/session-log' },
  { icon: IconBooks, label: 'Reference', sub: 'Sins, locations, lore', href: '/dm/reference' },
]

const SINS = [
  { name: 'Greed', host: 'Baron Avarus', ch: 9, color: 'var(--sin-greed)', status: 'Active' },
  { name: 'Lust', host: 'The Matriarch', ch: 10, color: 'var(--sin-lust)', status: 'Active' },
  { name: 'Sloth', host: 'Pip', ch: 12, color: 'var(--sin-sloth)', status: 'Active' },
  { name: 'Gluttony', host: 'Aldric Voss', ch: 11, color: 'var(--sin-gluttony)', status: 'Active' },
  { name: 'Envy', host: 'Cassius Argente', ch: 13, color: 'var(--sin-envy)', status: 'Active' },
  { name: 'Wrath', host: 'General Draven', ch: 14, color: 'var(--sin-wrath)', status: 'Active' },
  { name: 'Pride', host: 'King Kaelen (Doppelganger)', ch: 16, color: 'var(--sin-pride)', status: 'Active' },
]

export default function Home() {
  return (
    <div className="wiki-content fade-in">
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: '2rem', borderBottom: '0.5px solid var(--border)', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Death&apos;s Seven</h1>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
          Dungeon Master Campaign Bible
        </p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '1.25rem 1rem' }}>
                <div style={{ marginBottom: '0.5rem', color: 'var(--cyan)', display: 'flex', justifyContent: 'center' }}>
                  <Icon size={24} stroke={1.5} />
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: 'var(--text-accent)', letterSpacing: '0.08em', fontWeight: 600 }}>{link.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{link.sub}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Seven Sins tracker */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '0.75rem', fontWeight: 600 }}>
          THE SEVEN SOULS OF SIN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {SINS.map((sin) => (
            <div key={sin.name} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.5rem 0.75rem', background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)', borderLeft: `2px solid ${sin.color}`,
              borderRadius: 'var(--radius-lg)',
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: sin.color, letterSpacing: '0.1em', width: '70px', fontWeight: 600 }}>
                {sin.name.toUpperCase()}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1 }}>{sin.host}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Ch.{sin.ch}</span>
              <span className="badge" style={{ color: 'var(--status-success)', borderColor: 'rgba(52, 211, 153, 0.25)', background: 'rgba(52, 211, 153, 0.08)' }}>
                {sin.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Party at a glance */}
      <div style={{ paddingBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '0.75rem', fontWeight: 600 }}>
          THE PARTY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {[
            { player: 'Mikey', char: 'Rolando Ornasca', cls: 'Drow Sun Soul Monk', lvl: 3 },
            { player: 'Kilt', char: 'Michael Portsmith', cls: 'Halfling PDK Fighter', lvl: 3 },
            { player: 'Will', char: 'Thornvatore', cls: 'Dwarf Paladin of Devotion', lvl: 3 },
            { player: 'JT', char: 'Drazier "Gabriel"', cls: 'Tiefling Valor Bard', lvl: 3 },
          ].map((pc) => (
            <div key={pc.player} className="card">
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: 600 }}>{pc.player}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--text-accent)', margin: '0.15rem 0', fontWeight: 600 }}>{pc.char}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{pc.cls}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
