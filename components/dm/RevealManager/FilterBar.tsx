'use client'

import type { EntityType, Visibility } from './types'

const TYPES: EntityType[] = ['npc', 'location', 'faction', 'item']
const VISIBILITIES: Visibility[] = ['hidden', 'discovered', 'revealed']

interface Props {
  typeFilter: Set<EntityType>
  visibilityFilter: Set<Visibility>
  chapterFilter: number | null
  search: string
  onToggleType: (t: EntityType) => void
  onToggleVisibility: (v: Visibility) => void
  onChapter: (n: number | null) => void
  onSearch: (s: string) => void
}

const TYPE_LABEL: Record<EntityType, string> = {
  npc: 'NPC',
  location: 'Location',
  faction: 'Faction',
  item: 'Item',
}

const VIS_LABEL: Record<Visibility, string> = {
  hidden: 'Hidden',
  discovered: 'Discovered',
  revealed: 'Revealed',
}

const VIS_COLOR: Record<Visibility, string> = {
  hidden: 'var(--text-muted)',
  discovered: 'var(--orange)',
  revealed: 'var(--cyan)',
}

function chip(active: boolean, color: string): React.CSSProperties {
  return {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.6875rem',
    letterSpacing: '0.06em',
    fontWeight: 600,
    padding: '0.35rem 0.75rem',
    borderRadius: 'var(--radius-pill)',
    border: `0.5px solid ${active ? color : 'var(--border)'}`,
    background: active ? `color-mix(in srgb, ${color} 12%, transparent)` : 'var(--bg-surface)',
    color: active ? color : 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }
}

export default function FilterBar({
  typeFilter,
  visibilityFilter,
  chapterFilter,
  search,
  onToggleType,
  onToggleVisibility,
  onChapter,
  onSearch,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: 'var(--bg-base)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onToggleType(t)}
            style={chip(typeFilter.has(t), 'var(--cyan)')}
            aria-pressed={typeFilter.has(t)}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--border)' }} />

      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {VISIBILITIES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onToggleVisibility(v)}
            style={chip(visibilityFilter.has(v), VIS_COLOR[v])}
            aria-pressed={visibilityFilter.has(v)}
          >
            {VIS_LABEL[v]}
          </button>
        ))}
      </div>

      <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--border)' }} />

      <select
        value={chapterFilter ?? ''}
        onChange={(e) => onChapter(e.target.value === '' ? null : Number(e.target.value))}
        aria-label="Chapter filter"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          padding: '0.35rem 0.75rem',
          background: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <option value="">All chapters</option>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            Chapter {n}
          </option>
        ))}
        <option value={-1}>Unassigned</option>
      </select>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name…"
        aria-label="Search reveals"
        className="search-input"
        style={{ flex: 1, minWidth: '200px' }}
      />
    </div>
  )
}
