'use client'

import { useState } from 'react'
import PlayerPreview from './PlayerPreview'
import type {
  EntityCustomDetail,
  EntityFieldReveal,
  EntityType,
  RevealRecord,
} from './types'

interface Props {
  record: RevealRecord
  onPatchVisibilityName: (discoveredName: string) => Promise<void>
  onToggleField: (fieldName: string, isRevealed: boolean) => Promise<void>
  // Returns true on success, false on failure. Lets the form preserve typed
  // input on rejected creates instead of clearing it.
  onCreateDetail: (title: string, content: string) => Promise<boolean>
  onUpdateDetail: (
    detailId: string,
    patch: { title?: string; content?: string; isRevealed?: boolean }
  ) => Promise<void>
  onDeleteDetail: (detailId: string) => Promise<void>
  onReorderDetails: (order: string[]) => Promise<void>
}

function fieldLabel(name: string): string {
  if (name.includes(':')) {
    const [base, idx] = name.split(':')
    return `${base}[${idx}]`
  }
  return name
}

function fieldValuePreview(
  entity: RevealRecord['entity'],
  fieldName: string
): string {
  // Reach into the entity by field name. Indexed fields use `notes:0` etc.
  const data = entity as unknown as Record<string, unknown>
  if (fieldName.includes(':')) {
    const [base, idxStr] = fieldName.split(':')
    const arr = data[base]
    if (Array.isArray(arr)) {
      const v = arr[Number(idxStr)]
      return typeof v === 'string' ? v : JSON.stringify(v)
    }
    return ''
  }
  if (fieldName === 'stat_block') {
    return data.statBlock ? '(stat block present)' : ''
  }
  const v = data[fieldName]
  if (v === null || v === undefined) return ''
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'string') return v
  return JSON.stringify(v)
}

export default function DetailPanel({
  record,
  onPatchVisibilityName,
  onToggleField,
  onCreateDetail,
  onUpdateDetail,
  onDeleteDetail,
  onReorderDetails,
}: Props) {
  const [discoveredName, setDiscoveredName] = useState(record.reveal.discoveredName ?? '')
  // Resync local input state when the prop changes (e.g. the parent rolled
  // back a failed PATCH). React 19-recommended pattern: track the previous
  // prop value alongside the state and reset during render when it shifts.
  // Avoids the useEffect+setState anti-pattern.
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevDiscoveredNameProp, setPrevDiscoveredNameProp] = useState(
    record.reveal.discoveredName
  )
  if (prevDiscoveredNameProp !== record.reveal.discoveredName) {
    setPrevDiscoveredNameProp(record.reveal.discoveredName)
    setDiscoveredName(record.reveal.discoveredName ?? '')
  }
  const [showPreview, setShowPreview] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        borderTop: '0.5px solid var(--border)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <label style={labelStyle()}>Discovered name</label>
        <input
          type="text"
          value={discoveredName}
          onChange={(e) => setDiscoveredName(e.target.value)}
          onBlur={() => {
            if (discoveredName !== (record.reveal.discoveredName ?? '')) {
              void onPatchVisibilityName(discoveredName)
            }
          }}
          placeholder="(none — players will see ???)"
          className="search-input"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? 'Hide' : 'See as Player'}
        </button>
      </div>

      {showPreview && <PlayerPreview record={record} />}

      <FieldRevealsList
        entity={record.entity}
        entityType={record.reveal.entityType}
        fields={record.fields}
        onToggle={onToggleField}
      />

      <CustomDetailsList
        details={record.customDetails}
        onUpdate={onUpdateDetail}
        onDelete={onDeleteDetail}
        onReorder={onReorderDetails}
      />

      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={labelStyle()}>Add custom detail</label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title"
          className="search-input"
        />
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Content"
          className="search-input"
          rows={3}
          style={{ fontFamily: 'var(--font-body)', resize: 'vertical' }}
        />
        <button
          type="button"
          className="btn btn-primary"
          disabled={!newTitle.trim() || !newContent.trim()}
          onClick={async () => {
            // Only clear inputs if the create actually succeeded — preserve
            // the DM's typed text for retry on validation/network failure.
            const ok = await onCreateDetail(newTitle, newContent)
            if (ok) {
              setNewTitle('')
              setNewContent('')
            }
          }}
          style={{ alignSelf: 'flex-start' }}
        >
          Add detail
        </button>
      </div>
    </div>
  )
}

function FieldRevealsList({
  entity,
  fields,
  onToggle,
}: {
  entity: RevealRecord['entity']
  entityType: EntityType
  fields: EntityFieldReveal[]
  onToggle: (fieldName: string, isRevealed: boolean) => Promise<void>
}) {
  if (fields.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '1rem' }}>
        No revealable fields.
      </p>
    )
  }
  return (
    <div style={{ marginTop: '1rem' }}>
      <h4 style={sectionHeading()}>Field reveals</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {fields.map((f) => (
          <div
            key={f.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr auto',
              gap: '0.75rem',
              alignItems: 'center',
              padding: '0.45rem 0.6rem',
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              {fieldLabel(f.fieldName)}
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={fieldValuePreview(entity, f.fieldName)}
            >
              {fieldValuePreview(entity, f.fieldName)}
            </span>
            <FieldToggle
              isRevealed={f.isRevealed}
              label={fieldLabel(f.fieldName)}
              onToggle={() => onToggle(f.fieldName, !f.isRevealed)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function FieldToggle({
  isRevealed,
  label,
  onToggle,
}: {
  isRevealed: boolean
  // What this toggle controls (e.g. "role", "notes[2]", or a custom detail
  // title). Used to build a contextual aria-label so screen readers don't
  // hear a list of identical "HIDDEN" / "REVEALED" buttons.
  label: string
  onToggle: () => Promise<void>
}) {
  const action = isRevealed ? 'Hide' : 'Reveal'
  return (
    <button
      type="button"
      onClick={() => void onToggle()}
      aria-pressed={isRevealed}
      aria-label={`${action} "${label}" — currently ${isRevealed ? 'revealed' : 'hidden'}`}
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-pill)',
        border: `0.5px solid ${isRevealed ? 'var(--cyan)' : 'var(--border)'}`,
        background: isRevealed ? 'rgba(34, 211, 238, 0.1)' : 'var(--bg-base)',
        color: isRevealed ? 'var(--cyan)' : 'var(--text-muted)',
        cursor: 'pointer',
      }}
    >
      {isRevealed ? 'REVEALED' : 'HIDDEN'}
    </button>
  )
}

function CustomDetailsList({
  details,
  onUpdate,
  onDelete,
  onReorder,
}: {
  details: EntityCustomDetail[]
  onUpdate: (
    detailId: string,
    patch: { title?: string; content?: string; isRevealed?: boolean }
  ) => Promise<void>
  onDelete: (detailId: string) => Promise<void>
  onReorder: (order: string[]) => Promise<void>
}) {
  function move(detailId: string, direction: -1 | 1) {
    const idx = details.findIndex((d) => d.id === detailId)
    if (idx < 0) return
    const target = idx + direction
    if (target < 0 || target >= details.length) return
    const next = details.map((d) => d.id)
    const [item] = next.splice(idx, 1)
    next.splice(target, 0, item)
    void onReorder(next)
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4 style={sectionHeading()}>Custom details ({details.length})</h4>
      {details.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>None yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {details.map((d, i) => (
            <CustomDetailRow
              key={d.id}
              detail={d}
              isFirst={i === 0}
              isLast={i === details.length - 1}
              onUpdate={(patch) => onUpdate(d.id, patch)}
              onDelete={() => onDelete(d.id)}
              onMoveUp={() => move(d.id, -1)}
              onMoveDown={() => move(d.id, 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CustomDetailRow({
  detail,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  detail: EntityCustomDetail
  isFirst: boolean
  isLast: boolean
  onUpdate: (patch: { title?: string; content?: string; isRevealed?: boolean }) => Promise<void>
  onDelete: () => Promise<void>
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(detail.title)
  const [content, setContent] = useState(detail.content)
  // Resync local edit state when the prop changes (e.g. parent rolled back
  // a failed PATCH). React 19 store-previous-prop pattern, same as the
  // discoveredName input above. Avoids the useEffect+setState anti-pattern
  // that the project's lint config rejects. Without this, reopening edit
  // mode after a rollback would surface the unsaved local state instead of
  // the rendered (reverted) value.
  const [prevTitleProp, setPrevTitleProp] = useState(detail.title)
  if (prevTitleProp !== detail.title) {
    setPrevTitleProp(detail.title)
    setTitle(detail.title)
  }
  const [prevContentProp, setPrevContentProp] = useState(detail.content)
  if (prevContentProp !== detail.content) {
    setPrevContentProp(detail.content)
    setContent(detail.content)
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '0.6rem 0.75rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div
          role="group"
          aria-label="Reorder detail"
          style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
        >
          <button
            type="button"
            aria-label={`Move "${detail.title}" up`}
            disabled={isFirst}
            onClick={onMoveUp}
            style={iconButtonStyle(isFirst)}
          >
            ▲
          </button>
          <button
            type="button"
            aria-label={`Move "${detail.title}" down`}
            disabled={isLast}
            onClick={onMoveDown}
            style={iconButtonStyle(isLast)}
          >
            ▼
          </button>
        </div>
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="search-input"
            style={{ flex: 1 }}
          />
        ) : (
          <strong style={{ flex: 1, color: 'var(--text-primary)' }}>{detail.title}</strong>
        )}
        <FieldToggle
          isRevealed={detail.isRevealed}
          label={detail.title}
          onToggle={() => onUpdate({ isRevealed: !detail.isRevealed })}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (editing) {
              void onUpdate({ title, content })
            }
            setEditing((v) => !v)
          }}
        >
          {editing ? 'Save' : 'Edit'}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (confirm(`Delete "${detail.title}"?`)) void onDelete()
          }}
        >
          Delete
        </button>
      </div>
      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="search-input"
          rows={3}
          style={{
            fontFamily: 'var(--font-body)',
            resize: 'vertical',
            marginTop: '0.4rem',
          }}
        />
      ) : (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            margin: '0.4rem 0 0 0',
          }}
        >
          {detail.content}
        </p>
      )}
    </div>
  )
}

function labelStyle(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.6875rem',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  }
}

function sectionHeading(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    color: 'var(--orange)',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase',
  }
}

function iconButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    width: '20px',
    height: '16px',
    fontSize: '0.625rem',
    lineHeight: '14px',
    padding: 0,
    border: '0.5px solid var(--border)',
    borderRadius: '3px',
    background: 'var(--bg-base)',
    color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  }
}
