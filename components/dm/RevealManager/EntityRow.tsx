'use client'

import VisibilityToggle from './VisibilityToggle'
import type { EntityType, RevealRecord, Visibility } from './types'

interface Props {
  record: RevealRecord
  selected: boolean
  expanded: boolean
  onSelect: (next: boolean) => void
  onExpand: () => void
  onVisibility: (v: Visibility) => void
}

const TYPE_COLOR: Record<EntityType, string> = {
  npc: 'var(--cyan)',
  location: 'var(--orange)',
  faction: 'var(--purple)',
  item: 'var(--status-warning)',
}

export default function EntityRow({
  record,
  selected,
  expanded,
  onSelect,
  onExpand,
  onVisibility,
}: Props) {
  const { reveal, entity, fields } = record
  const revealedFields = fields.filter((f) => f.isRevealed).length
  const displayName = reveal.discoveredName
    ? `${entity.name} (${reveal.discoveredName})`
    : entity.name

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto auto',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 0.85rem',
        background: expanded ? 'var(--bg-raised)' : 'var(--bg-surface)',
        border: `0.5px solid ${expanded ? 'var(--border-bright)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
      }}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onSelect(e.target.checked)}
        aria-label={`Select ${entity.name}`}
      />

      <button
        type="button"
        onClick={onExpand}
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} details for ${entity.name}`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          textAlign: 'left',
          color: 'var(--text-primary)',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.04em',
        }}
      >
        {displayName}
      </button>

      <span
        className="badge"
        style={{
          color: TYPE_COLOR[reveal.entityType],
          background: `color-mix(in srgb, ${TYPE_COLOR[reveal.entityType]} 10%, transparent)`,
          borderColor: `color-mix(in srgb, ${TYPE_COLOR[reveal.entityType]} 40%, transparent)`,
        }}
      >
        {reveal.entityType.toUpperCase()}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          minWidth: '70px',
        }}
      >
        {reveal.chapterAssociation !== null
          ? `Ch ${reveal.chapterAssociation}`
          : '—'}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          minWidth: '90px',
          textAlign: 'right',
        }}
      >
        {revealedFields}/{fields.length} fields
      </span>

      <VisibilityToggle value={reveal.visibility} onChange={onVisibility} />
    </div>
  )
}
