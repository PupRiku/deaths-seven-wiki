'use client'

import { filterEntityForPlayer, type FilterContext } from '@/lib/reveal-filter'
import type { PlayerEntity } from '@/types'
import type { RevealRecord } from './types'

interface Props {
  record: RevealRecord
  // Cross-entity context (e.g. NPC visibility for filtering location.npcsPresent).
  // The DM preview must pass this so it matches what the player API would
  // return — without it, the preview would show pids for hidden NPCs while
  // the real player API would correctly hide them.
  filterContext?: FilterContext
}

function previewBox(): React.CSSProperties {
  return {
    background: 'var(--bg-deep)',
    border: '1px dashed var(--purple)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem',
    marginTop: '0.75rem',
  }
}

// "See as Player" — calls the SAME filterEntityForPlayer the Player API uses.
// If this preview shows it, the player sees it. If this hides it, the player
// doesn't. There is no second source of truth.
export default function PlayerPreview({ record, filterContext }: Props) {
  const entity = filterEntityForPlayer(
    record.entity,
    record.reveal.entityType,
    record.reveal,
    record.fields,
    record.customDetails,
    filterContext
  )

  return (
    <div style={previewBox()}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        <span
          className="badge"
          style={{
            color: 'var(--purple)',
            background: 'rgba(139, 92, 246, 0.08)',
            borderColor: 'rgba(139, 92, 246, 0.4)',
          }}
        >
          PLAYER VIEW
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          What a player sees right now
        </span>
      </div>

      {entity === null ? (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
          Hidden — this entity does not appear in player API responses.
        </p>
      ) : (
        <PlayerEntityView entity={entity} />
      )}
    </div>
  )
}

function PlayerEntityView({ entity }: { entity: PlayerEntity }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{entity.displayName}</strong>
        <span
          className="badge"
          style={{
            fontSize: '0.625rem',
            color: entity.visibility === 'discovered' ? 'var(--orange)' : 'var(--cyan)',
            background:
              entity.visibility === 'discovered'
                ? 'rgba(232, 131, 74, 0.08)'
                : 'rgba(34, 211, 238, 0.08)',
            borderColor:
              entity.visibility === 'discovered'
                ? 'rgba(232, 131, 74, 0.4)'
                : 'rgba(34, 211, 238, 0.4)',
          }}
        >
          {entity.visibility.toUpperCase()}
        </span>
      </div>
      <pre
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          background: 'var(--bg-base)',
          color: 'var(--text-secondary)',
          padding: '0.6rem',
          borderRadius: 'var(--radius-md)',
          maxHeight: '320px',
          overflow: 'auto',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {JSON.stringify(entity, null, 2)}
      </pre>
    </div>
  )
}
