'use client'

import { useState } from 'react'
import type { Visibility } from './types'

interface Props {
  selectedCount: number
  onBulkVisibility: (v: Visibility) => Promise<void>
  onBulkChapter: (chapter: number, visibility: Visibility) => Promise<{ updated: number } | null>
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
  onBulkChapter,
}: Props) {
  const [chapter, setChapter] = useState(1)
  const [chapterVis, setChapterVis] = useState<Visibility>('discovered')
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)

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
          onChange={(e) => setChapter(Number(e.target.value))}
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
          onChange={(e) => setChapterVis(e.target.value as Visibility)}
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
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            const ok = await onBulkChapter(chapter, chapterVis)
            if (ok) setPendingPreview(`Updated ${ok.updated} entities for Chapter ${chapter}.`)
          }}
        >
          Preview and Apply
        </button>
        {pendingPreview && (
          <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>{pendingPreview}</span>
        )}
      </div>
    </div>
  )
}
