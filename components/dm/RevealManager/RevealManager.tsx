'use client'

import { useEffect, useMemo, useState } from 'react'
import FilterBar from './FilterBar'
import EntityRow from './EntityRow'
import DetailPanel from './DetailPanel'
import BulkActions from './BulkActions'
import type { EntityType, RevealRecord, Visibility } from './types'

function entityKey(entityType: EntityType, entityId: string) {
  return `${entityType}:${entityId}`
}

export default function RevealManager() {
  const [records, setRecords] = useState<RevealRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<Set<EntityType>>(
    new Set(['npc', 'location', 'faction', 'item'])
  )
  const [visibilityFilter, setVisibilityFilter] = useState<Set<Visibility>>(
    new Set(['hidden', 'discovered', 'revealed'])
  )
  const [chapterFilter, setChapterFilter] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    fetch('/api/dm/reveals')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: RevealRecord[]) => {
        if (!cancelled) setRecords(data)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!records) return []
    return records.filter((r) => {
      if (!typeFilter.has(r.reveal.entityType)) return false
      if (!visibilityFilter.has(r.reveal.visibility)) return false
      if (chapterFilter !== null) {
        if (chapterFilter === -1) {
          if (r.reveal.chapterAssociation !== null) return false
        } else if (r.reveal.chapterAssociation !== chapterFilter) return false
      }
      if (search) {
        const q = search.toLowerCase()
        const name = r.entity.name.toLowerCase()
        const discovered = r.reveal.discoveredName?.toLowerCase() ?? ''
        if (!name.includes(q) && !discovered.includes(q)) return false
      }
      return true
    })
  }, [records, typeFilter, visibilityFilter, chapterFilter, search])

  function patchLocalReveal(key: string, patch: Partial<RevealRecord['reveal']>) {
    setRecords((rs) =>
      rs
        ? rs.map((r) =>
            entityKey(r.reveal.entityType, r.reveal.entityId) === key
              ? { ...r, reveal: { ...r.reveal, ...patch } }
              : r
          )
        : rs
    )
  }

  async function setVisibility(record: RevealRecord, v: Visibility) {
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    const prev = record.reveal.visibility
    patchLocalReveal(key, { visibility: v })
    try {
      const r = await fetch(
        `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visibility: v }),
        }
      )
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch {
      patchLocalReveal(key, { visibility: prev })
    }
  }

  async function setDiscoveredName(record: RevealRecord, name: string) {
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    const prev = record.reveal.discoveredName
    patchLocalReveal(key, { discoveredName: name || null })
    try {
      const r = await fetch(
        `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discoveredName: name || null }),
        }
      )
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch {
      patchLocalReveal(key, { discoveredName: prev })
    }
  }

  async function toggleField(record: RevealRecord, fieldName: string, isRevealed: boolean) {
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    setRecords((rs) =>
      rs
        ? rs.map((r) =>
            entityKey(r.reveal.entityType, r.reveal.entityId) === key
              ? {
                  ...r,
                  fields: r.fields.map((f) =>
                    f.fieldName === fieldName ? { ...f, isRevealed } : f
                  ),
                }
              : r
          )
        : rs
    )
    try {
      const r = await fetch(
        `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}/fields/${encodeURIComponent(fieldName)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRevealed }),
        }
      )
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch {
      // Roll back on failure.
      setRecords((rs) =>
        rs
          ? rs.map((r) =>
              entityKey(r.reveal.entityType, r.reveal.entityId) === key
                ? {
                    ...r,
                    fields: r.fields.map((f) =>
                      f.fieldName === fieldName ? { ...f, isRevealed: !isRevealed } : f
                    ),
                  }
                : r
            )
          : rs
      )
    }
  }

  async function createDetail(record: RevealRecord, title: string, content: string) {
    const r = await fetch(
      `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}/details`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      }
    )
    if (!r.ok) return
    const data = await r.json()
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    setRecords((rs) =>
      rs
        ? rs.map((rec) =>
            entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
              ? {
                  ...rec,
                  customDetails: [
                    ...rec.customDetails,
                    {
                      id: data.id,
                      entityType: rec.reveal.entityType,
                      entityId: rec.reveal.entityId,
                      title,
                      content,
                      isRevealed: false,
                      revealedAt: null,
                      createdAt: new Date().toISOString(),
                      // Use the server-assigned sort_order, not customDetails.length.
                      // After deletes/reorders the existing orders can be
                      // non-contiguous, so length-based guessing diverges from
                      // what the server actually persisted.
                      sortOrder: typeof data.sortOrder === 'number'
                        ? data.sortOrder
                        : rec.customDetails.length,
                    },
                  ],
                }
              : rec
          )
        : rs
    )
  }

  async function updateDetail(
    record: RevealRecord,
    detailId: string,
    patch: { title?: string; content?: string; isRevealed?: boolean }
  ) {
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    // Snapshot current details so we can roll back on failure.
    const previous = record.customDetails
    setRecords((rs) =>
      rs
        ? rs.map((rec) =>
            entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
              ? {
                  ...rec,
                  customDetails: rec.customDetails.map((d) =>
                    d.id === detailId ? { ...d, ...patch } : d
                  ),
                }
              : rec
          )
        : rs
    )
    try {
      const r = await fetch(
        `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}/details/${detailId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        }
      )
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch {
      setRecords((rs) =>
        rs
          ? rs.map((rec) =>
              entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
                ? { ...rec, customDetails: previous }
                : rec
            )
          : rs
      )
    }
  }

  async function deleteDetail(record: RevealRecord, detailId: string) {
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    const previous = record.customDetails
    setRecords((rs) =>
      rs
        ? rs.map((rec) =>
            entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
              ? {
                  ...rec,
                  customDetails: rec.customDetails.filter((d) => d.id !== detailId),
                }
              : rec
          )
        : rs
    )
    try {
      const r = await fetch(
        `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}/details/${detailId}`,
        { method: 'DELETE' }
      )
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch {
      setRecords((rs) =>
        rs
          ? rs.map((rec) =>
              entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
                ? { ...rec, customDetails: previous }
                : rec
            )
          : rs
      )
    }
  }

  async function reorderDetails(record: RevealRecord, order: string[]) {
    const key = entityKey(record.reveal.entityType, record.reveal.entityId)
    const previous = record.customDetails
    // Apply the new order locally first (sort_order = index).
    const reordered = order
      .map((id, i) => {
        const d = previous.find((x) => x.id === id)
        return d ? { ...d, sortOrder: i } : null
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
    setRecords((rs) =>
      rs
        ? rs.map((rec) =>
            entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
              ? { ...rec, customDetails: reordered }
              : rec
          )
        : rs
    )
    try {
      const r = await fetch(
        `/api/dm/reveals/${record.reveal.entityType}/${record.reveal.entityId}/details/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        }
      )
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch {
      setRecords((rs) =>
        rs
          ? rs.map((rec) =>
              entityKey(rec.reveal.entityType, rec.reveal.entityId) === key
                ? { ...rec, customDetails: previous }
                : rec
            )
          : rs
      )
    }
  }

  async function bulkVisibility(v: Visibility) {
    const selectedKeys = Array.from(selected)
    const entities = selectedKeys.map((k) => {
      const [entityType, entityId] = k.split(':')
      return { entityType, entityId }
    })
    // Snapshot the prior visibility per affected record so we can roll back.
    const priorVisibility = new Map<string, Visibility>()
    if (records) {
      for (const r of records) {
        const k = entityKey(r.reveal.entityType, r.reveal.entityId)
        if (selected.has(k)) priorVisibility.set(k, r.reveal.visibility)
      }
    }
    setRecords((rs) =>
      rs
        ? rs.map((r) =>
            selected.has(entityKey(r.reveal.entityType, r.reveal.entityId))
              ? { ...r, reveal: { ...r.reveal, visibility: v } }
              : r
          )
        : rs
    )
    try {
      const r = await fetch('/api/dm/reveals/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entities, visibility: v }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      setSelected(new Set())
    } catch {
      setRecords((rs) =>
        rs
          ? rs.map((r) => {
              const k = entityKey(r.reveal.entityType, r.reveal.entityId)
              const prior = priorVisibility.get(k)
              return prior !== undefined
                ? { ...r, reveal: { ...r.reveal, visibility: prior } }
                : r
            })
          : rs
      )
    }
  }

  // Two-phase chapter bulk: phase 1 returns the entities that WOULD change
  // (no DB writes — read-only preview from current local state). Phase 2
  // commits via the API. The visibility argument isn't used to compute the
  // preview list (the list is "what's in this chapter") but is part of the
  // signature so BulkActions can pass through what it'll commit.
  function previewBulkChapter(
    chapter: number,
    visibility: Visibility
  ): Array<{ entityType: string; entityId: string; name: string }> {
    void visibility
    if (!records) return []
    return records
      .filter((rec) => rec.reveal.chapterAssociation === chapter)
      .map((rec) => ({
        entityType: rec.reveal.entityType,
        entityId: rec.reveal.entityId,
        name: rec.entity.name,
      }))
  }

  async function commitBulkChapter(chapter: number, v: Visibility) {
    const priorByKey = new Map<string, Visibility>()
    if (records) {
      for (const rec of records) {
        if (rec.reveal.chapterAssociation === chapter) {
          priorByKey.set(
            entityKey(rec.reveal.entityType, rec.reveal.entityId),
            rec.reveal.visibility
          )
        }
      }
    }
    setRecords((rs) =>
      rs
        ? rs.map((rec) =>
            rec.reveal.chapterAssociation === chapter
              ? { ...rec, reveal: { ...rec.reveal, visibility: v } }
              : rec
          )
        : rs
    )
    try {
      const r = await fetch('/api/dm/reveals/bulk-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter, visibility: v }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      return { updated: data.updated as number }
    } catch {
      setRecords((rs) =>
        rs
          ? rs.map((rec) => {
              const k = entityKey(rec.reveal.entityType, rec.reveal.entityId)
              const prior = priorByKey.get(k)
              return prior !== undefined
                ? { ...rec, reveal: { ...rec.reveal, visibility: prior } }
                : rec
            })
          : rs
      )
      return null
    }
  }

  function toggleType(t: EntityType) {
    setTypeFilter((s) => {
      const n = new Set(s)
      if (n.has(t)) n.delete(t)
      else n.add(t)
      return n
    })
  }
  function toggleVis(v: Visibility) {
    setVisibilityFilter((s) => {
      const n = new Set(s)
      if (n.has(v)) n.delete(v)
      else n.add(v)
      return n
    })
  }

  if (error) {
    return (
      <div className="wiki-content">
        <h1>Reveals</h1>
        <p style={{ color: 'var(--status-danger)' }}>Failed to load: {error}</p>
      </div>
    )
  }

  return (
    <div className="wiki-content">
      <h1>Reveals</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Control what players can see. Hidden entities are invisible to the
        player API. Discovered shows physical info only. Revealed exposes
        full details (still gated per-field).
      </p>

      <FilterBar
        typeFilter={typeFilter}
        visibilityFilter={visibilityFilter}
        chapterFilter={chapterFilter}
        search={search}
        onToggleType={toggleType}
        onToggleVisibility={toggleVis}
        onChapter={setChapterFilter}
        onSearch={setSearch}
      />

      <BulkActions
        selectedCount={selected.size}
        onBulkVisibility={bulkVisibility}
        onPreviewBulkChapter={previewBulkChapter}
        onCommitBulkChapter={commitBulkChapter}
      />

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {records === null ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading reveals…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No entities match the current filters.</p>
        ) : (
          filtered.map((record) => {
            const key = entityKey(record.reveal.entityType, record.reveal.entityId)
            const expanded = expandedKey === key
            return (
              <div key={key}>
                <EntityRow
                  record={record}
                  selected={selected.has(key)}
                  expanded={expanded}
                  onSelect={(next) =>
                    setSelected((s) => {
                      const n = new Set(s)
                      if (next) n.add(key)
                      else n.delete(key)
                      return n
                    })
                  }
                  onExpand={() => setExpandedKey(expanded ? null : key)}
                  onVisibility={(v) => void setVisibility(record, v)}
                />
                {expanded && (
                  <DetailPanel
                    record={record}
                    onPatchVisibilityName={(name) => setDiscoveredName(record, name)}
                    onToggleField={(fieldName, isRevealed) =>
                      toggleField(record, fieldName, isRevealed)
                    }
                    onCreateDetail={(t, c) => createDetail(record, t, c)}
                    onUpdateDetail={(id, patch) => updateDetail(record, id, patch)}
                    onDeleteDetail={(id) => deleteDetail(record, id)}
                    onReorderDetails={(order) => reorderDetails(record, order)}
                  />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
