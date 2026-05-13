'use client'

import { useState, useEffect, useCallback } from 'react'
import { IconNotebook, IconDownload, IconCheck } from '@tabler/icons-react'
import type { SessionNote } from '@/types'

const CHAPTERS = Array.from({ length: 20 }, (_, i) => i + 1)

export default function SessionLogPage() {
  const [notes, setNotes] = useState<SessionNote[]>([])
  const [activeNote, setActiveNote] = useState<SessionNote | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'md' | 'txt'>('md')
  const [filterSession, setFilterSession] = useState('')

  // Draft state for editor
  const [draft, setDraft] = useState({
    title: '',
    content: '',
    sessionNumber: 1,
    chapter: 1,
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
    tagInput: '',
  })

  const fetchNotes = useCallback(async () => {
    const res = await fetch('/api/dm/notes')
    const data = await res.json()
    setNotes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  function newNote() {
    setActiveNote(null)
    setIsEditing(true)
    setDraft({
      title: `Session ${Math.max(...notes.map((n) => n.sessionNumber), 0) + 1} Notes`,
      content: '',
      sessionNumber: Math.max(...notes.map((n) => n.sessionNumber), 0) + 1,
      chapter: 1,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      tagInput: '',
    })
  }

  function editNote(note: SessionNote) {
    setActiveNote(note)
    setIsEditing(true)
    setDraft({
      title: note.title,
      content: note.content,
      sessionNumber: note.sessionNumber,
      chapter: note.chapter,
      date: note.date,
      tags: note.tags,
      tagInput: '',
    })
  }

  async function saveNote() {
    setSaving(true)
    const payload = {
      id: activeNote?.id,
      title: draft.title,
      content: draft.content,
      sessionNumber: draft.sessionNumber,
      chapter: draft.chapter,
      date: draft.date,
      tags: draft.tags,
    }

    if (activeNote) {
      await fetch('/api/dm/notes', { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    } else {
      await fetch('/api/dm/notes', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    }

    await fetchNotes()
    setIsEditing(false)
    setSaving(false)
  }

  async function deleteNote(id: string) {
    if (!confirm('Delete this note?')) return
    await fetch('/api/dm/notes', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    if (activeNote?.id === id) { setActiveNote(null); setIsEditing(false) }
    await fetchNotes()
  }

  async function exportNotes() {
    setExporting(true)
    const res = await fetch('/api/dm/export', {
      method: 'POST',
      body: JSON.stringify({ format: exportFormat }),
      headers: { 'Content-Type': 'application/json' },
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deadly-seven-notes-${new Date().toISOString().split('T')[0]}.${exportFormat}`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
  }

  function addTag() {
    const t = draft.tagInput.trim()
    if (t && !draft.tags.includes(t)) {
      setDraft((d) => ({ ...d, tags: [...d.tags, t], tagInput: '' }))
    }
  }

  const filtered = notes.filter((n) =>
    filterSession ? n.sessionNumber === parseInt(filterSession) : true
  )

  // Inline tag-badge styling — using rgba so it works with both opacity backgrounds and borders.
  const tagBadgeStyle = {
    color: 'var(--cyan)',
    borderColor: 'rgba(34, 211, 238, 0.25)',
    background: 'rgba(34, 211, 238, 0.08)',
  } as const

  // Shared editor input styling.
  const editorInputStyle = {
    background: 'var(--bg-surface)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    outline: 'none',
  } as const

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left panel — note list */}
      <div style={{ width: '280px', borderRight: '0.5px solid var(--border)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={newNote}>+ New Note</button>
          </div>
          <input
            className="search-input"
            placeholder="Filter by session #"
            type="number"
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
            style={{ fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {loading && <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Loading...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center' }}>
              No notes yet.<br />Click + New Note to start.
            </div>
          )}
          {filtered.map((note) => {
            const isActive = activeNote?.id === note.id
            return (
              <div
                key={note.id}
                onClick={() => { setActiveNote(note); setIsEditing(false) }}
                style={{
                  padding: '0.75rem', marginBottom: '0.35rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  border: '0.5px solid var(--border)',
                  borderLeft: `2px solid ${isActive ? 'var(--cyan)' : 'transparent'}`,
                  background: isActive ? 'var(--bg-raised)' : 'var(--bg-surface)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: isActive ? 'var(--cyan)' : 'var(--text-accent)', letterSpacing: '0.1em', marginBottom: '0.2rem', fontWeight: 600 }}>
                  SESSION {note.sessionNumber} — CH.{note.chapter}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.2rem' }}>
                  {note.title}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {note.date}
                </div>
              </div>
            )
          })}
        </div>

        {/* Export panel */}
        <div style={{ padding: '0.75rem', borderTop: '0.5px solid var(--border)', background: 'var(--bg-base)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '0.5rem', fontWeight: 600 }}>
            EXPORT NOTES
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
            {(['md', 'txt'] as const).map((fmt) => (
              <button
                key={fmt}
                className={`btn ${exportFormat === fmt ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.6875rem' }}
                onClick={() => setExportFormat(fmt)}
              >
                .{fmt}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={exportNotes}
            disabled={exporting}
          >
            <IconDownload size={14} stroke={1.75} />
            {exporting ? 'Exporting...' : 'Export All Notes'}
          </button>
        </div>
      </div>

      {/* Right panel — viewer / editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!activeNote && !isEditing && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', color: 'var(--cyan)' }}>
                <IconNotebook size={40} stroke={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', letterSpacing: '0.12em', fontWeight: 600 }}>
                Select a note or create a new one
              </div>
            </div>
          </div>
        )}

        {activeNote && !isEditing && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--border)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '0.25rem', fontWeight: 600 }}>
                  SESSION {activeNote.sessionNumber} — CHAPTER {activeNote.chapter} — {activeNote.date}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{activeNote.title}</h2>
                {activeNote.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {activeNote.tags.map((tag) => (
                      <span key={tag} className="badge" style={tagBadgeStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => editNote(activeNote)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteNote(activeNote.id)}>Delete</button>
              </div>
            </div>

            {/* Content */}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: 'var(--text-primary)' }}>
              {activeNote.content}
            </div>
          </div>
        )}

        {isEditing && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Editor toolbar */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-base)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Note title"
                style={{ ...editorInputStyle, flex: 1, minWidth: '200px', padding: '0.45rem 0.75rem', fontFamily: 'var(--font-heading)', fontSize: '0.875rem', letterSpacing: '0.04em', fontWeight: 600 }}
              />
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <label style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>Session</label>
                <input type="number" value={draft.sessionNumber} onChange={(e) => setDraft((d) => ({ ...d, sessionNumber: parseInt(e.target.value) }))}
                  style={{ ...editorInputStyle, width: '60px', padding: '0.4rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textAlign: 'center' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <label style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>Ch.</label>
                <select value={draft.chapter} onChange={(e) => setDraft((d) => ({ ...d, chapter: parseInt(e.target.value) }))}
                  style={{ ...editorInputStyle, padding: '0.4rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {CHAPTERS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <input type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                style={{ ...editorInputStyle, padding: '0.4rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
              <button className="btn btn-primary" onClick={saveNote} disabled={saving}>
                <IconCheck size={14} stroke={1.75} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={() => { setIsEditing(false); setActiveNote(null) }}>
                Cancel
              </button>
            </div>

            {/* Tags */}
            <div style={{ padding: '0.5rem 1rem', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-base)', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: 600 }}>TAGS</span>
              {draft.tags.map((tag) => (
                <span key={tag} className="badge" style={{ ...tagBadgeStyle, cursor: 'pointer' }}
                  onClick={() => setDraft((d) => ({ ...d, tags: d.tags.filter((t) => t !== tag) }))}>
                  {tag} ×
                </span>
              ))}
              <input value={draft.tagInput} onChange={(e) => setDraft((d) => ({ ...d, tagInput: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                placeholder="Add tag, press Enter"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', outline: 'none', width: '150px' }} />
            </div>

            {/* Text area */}
            <textarea
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              placeholder="Session notes... What happened? What surprised you? What do you need to remember?"
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none', padding: '1.5rem',
                background: 'var(--bg-deep)', color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.75,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
