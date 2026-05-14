'use client'

import { useState } from 'react'
import type { Visibility } from './types'

interface PreviewedEntity {
  entityType: string
  entityId: string
  name: string
}

interface Props {
  selectedCount: number
  onBulkVisibility: (v: Visibility) => Promise<void>
  // Two-step bulk-chapter:
  // 1. onPreviewBulkChapter — pure local read, returns the entities that
  //    WOULD change. No DB writes.
  // 2. onCommitBulkChapter — actually commits the change.
  onPreviewBulkChapter: (chapter: number, visibility: Visibility) => PreviewedEntity[]
  onCommitBulkChapter: (
    chapter: number,
    visibility: Visibility
  ) => Promise<{ updated: number } | null>
}

const VIS: Visibility[] = ['hidden', 'discovered', 'revealed']
const VIS_LABEL: Record<Visibility, string> = {
  hidden: 'Set Hidden',
  discovered: 'Set Discovered',
  revealed: 'Set Revealed',
}

export default function BulkActions({
  selectedCount,
  onBulkVisibility,
  onPreviewBulkChapter,
  onCommitBulkChapter,
}: Props) {
  const [chapter, setChapter] = useState(1)
  const [chapterVis, setChapterVis] = useState<Visibility>('discovered')
  // pendingPreview holds the entities the next "Apply" will affect.
  // null = no preview is showing yet (button is "Preview"); array (even empty)
  // = preview is staged and "Apply" / "Cancel" are showing.
  const [pendingPreview, setPendingPreview] = useState<PreviewedEntity[] | null>(null)
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {selectedCount > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-raised)',
            border: '0.5px solid var(--border-bright)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            {selectedCount} selected
          </span>
          {VIS.map((v) => (
            <button
              key={v}
              type="button"
              className="btn btn-ghost"
              onClick={() => void onBulkVisibility(v)}
            >
              {VIS_LABEL[v]}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          background: 'var(--bg-base)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          Chapter bulk:
        </span>
        <select
          value={chapter}
          onChange={(e) => {
            setChapter(Number(e.target.value))
            setPendingPreview(null) // any change invalidates the preview
          }}
          aria-label="Chapter for bulk action"
          className="search-input"
          style={{ width: '120px', padding: '0.35rem 0.5rem' }}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Chapter {n}
            </option>
          ))}
        </select>
        <select
          value={chapterVis}
          onChange={(e) => {
            setChapterVis(e.target.value as Visibility)
            setPendingPreview(null)
          }}
          aria-label="Visibility for chapter bulk action"
          className="search-input"
          style={{ width: '140px', padding: '0.35rem 0.5rem' }}
        >
          {VIS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        {pendingPreview === null ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setAppliedMessage(null)
              setPendingPreview(onPreviewBulkChapter(chapter, chapterVis))
            }}
          >
            Preview
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                const result = await onCommitBulkChapter(chapter, chapterVis)
                if (result) {
                  setAppliedMessage(
                    `Set ${result.updated} entit${result.updated === 1 ? 'y' : 'ies'} for Chapter ${chapter} to ${chapterVis}.`
                  )
                }
                setPendingPreview(null)
              }}
            >
              Apply ({pendingPreview.length})
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setPendingPreview(null)}
            >
              Cancel
            </button>
          </>
        )}

        {appliedMessage && (
          <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>{appliedMessage}</span>
        )}
      </div>

      {pendingPreview !== null && (
        <div
          role="region"
          aria-label="Bulk chapter preview"
          style={{
            padding: '0.6rem 0.85rem',
            background: 'var(--bg-surface)',
            border: '0.5px dashed var(--purple)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              color: 'var(--purple)',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
            }}
          >
            Will set {pendingPreview.length} entit
            {pendingPreview.length === 1 ? 'y' : 'ies'} for Chapter {chapter} to {chapterVis}
          </div>
          {pendingPreview.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>
              No entities are associated with Chapter {chapter}.
            </p>
          ) : (
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.2rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                maxHeight: '160px',
                overflowY: 'auto',
              }}
            >
              {pendingPreview.map((e) => (
                <li key={`${e.entityType}:${e.entityId}`}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
                    [{e.entityType}]
                  </span>{' '}
                  {e.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
