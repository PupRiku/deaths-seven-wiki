import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  await initDB();
  const { format = 'md', sessionNumbers, chapterNumbers } = await req.json();

  let sql = `SELECT * FROM session_notes`;
  const conditions: string[] = [];
  const args: (string | number)[] = [];

  if (sessionNumbers?.length) {
    conditions.push(
      `session_number IN (${sessionNumbers.map(() => '?').join(',')})`,
    );
    args.push(...sessionNumbers);
  }
  if (chapterNumbers?.length) {
    conditions.push(`chapter IN (${chapterNumbers.map(() => '?').join(',')})`);
    args.push(...chapterNumbers);
  }

  if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;
  sql += ` ORDER BY session_number ASC, created_at ASC`;

  const rows = await db.execute({ sql, args });
  const notes = rows.rows;

  let output = '';

  if (format === 'md') {
    output += `# Death's Seven — Session Notes\n\n`;
    output += `*Exported: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*\n\n`;
    output += `---\n\n`;

    let currentSession = -1;
    for (const note of notes) {
      const session = note.session_number as number;
      const chapter = note.chapter as number;
      if (session !== currentSession) {
        output += `## Session ${session} — Chapter ${chapter}\n\n`;
        output += `*${note.date}*\n\n`;
        currentSession = session;
      }
      output += `### ${note.title}\n\n`;
      output += `${note.content}\n\n`;
      const tags = JSON.parse((note.tags as string) || '[]');
      if (tags.length) output += `*Tags: ${tags.join(', ')}*\n\n`;
      output += `---\n\n`;
    }
  } else {
    // Plain text
    output += `THE DEADLY SEVEN — SESSION NOTES\n`;
    output += `Exported: ${new Date().toLocaleDateString()}\n`;
    output += `${'='.repeat(60)}\n\n`;

    let currentSession = -1;
    for (const note of notes) {
      const session = note.session_number as number;
      const chapter = note.chapter as number;
      if (session !== currentSession) {
        output += `SESSION ${session} — CHAPTER ${chapter} (${note.date})\n`;
        output += `${'-'.repeat(40)}\n\n`;
        currentSession = session;
      }
      output += `${note.title}\n`;
      output += `${note.content}\n\n`;
    }
  }

  const filename = `deadly-seven-notes-${new Date().toISOString().split('T')[0]}.${format}`;

  return new NextResponse(output, {
    headers: {
      'Content-Type': format === 'md' ? 'text/markdown' : 'text/plain',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
