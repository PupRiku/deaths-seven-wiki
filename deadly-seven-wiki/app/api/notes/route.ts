import { NextRequest, NextResponse } from 'next/server'
import { db, initDB, generateId } from '@/lib/db'

export async function GET() {
  await initDB()
  const rows = await db.execute(
    `SELECT * FROM session_notes ORDER BY session_number DESC, created_at DESC`
  )
  const notes = rows.rows.map((r) => ({
    id: r.id,
    sessionNumber: r.session_number,
    chapter: r.chapter,
    date: r.date,
    title: r.title,
    content: r.content,
    tags: JSON.parse((r.tags as string) || '[]'),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  await initDB()
  const body = await req.json()
  const id = generateId()
  const now = new Date().toISOString()

  await db.execute({
    sql: `INSERT INTO session_notes (id, session_number, chapter, date, title, content, tags, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      body.sessionNumber ?? 1,
      body.chapter ?? 1,
      body.date ?? now.split('T')[0],
      body.title ?? 'Untitled Note',
      body.content ?? '',
      JSON.stringify(body.tags ?? []),
      now,
      now,
    ],
  })

  return NextResponse.json({ id, success: true })
}

export async function PUT(req: NextRequest) {
  await initDB()
  const body = await req.json()
  const now = new Date().toISOString()

  await db.execute({
    sql: `UPDATE session_notes SET
            session_number=?, chapter=?, date=?, title=?, content=?, tags=?, updated_at=?
          WHERE id=?`,
    args: [
      body.sessionNumber,
      body.chapter,
      body.date,
      body.title,
      body.content,
      JSON.stringify(body.tags ?? []),
      now,
      body.id,
    ],
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  await initDB()
  const { id } = await req.json()
  await db.execute({ sql: `DELETE FROM session_notes WHERE id=?`, args: [id] })
  return NextResponse.json({ success: true })
}
