import { describe, it, expect, beforeEach } from 'vitest'
import crypto from 'crypto'
import { syncReveals, _resetSyncLatchForTests } from '@/lib/reveal-sync'
import { createTestDb } from '../../helpers/db'
import { npcs } from '@/data/npcs'
import { LOCATIONS, FACTIONS, ITEMS } from '@/data/reference'
import type { Client } from '@libsql/client'

let db: Client

beforeEach(async () => {
  db = await createTestDb()
  _resetSyncLatchForTests()
})

describe('syncReveals', () => {
  it('creates entity_reveals rows for NPCs, locations, factions, items', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })

    const counts = await Promise.all(
      ['npc', 'location', 'faction', 'item'].map(async (t) => {
        const r = await db.execute({
          sql: `SELECT COUNT(*) AS c FROM entity_reveals WHERE entity_type = ?`,
          args: [t],
        })
        return Number((r.rows[0] as Record<string, unknown>).c)
      })
    )
    expect(counts[0]).toBe(npcs.length)
    expect(counts[1]).toBe(LOCATIONS.length)
    expect(counts[2]).toBe(FACTIONS.length)
    expect(counts[3]).toBe(ITEMS.length)
  })

  it('defaults visibility to hidden for new entities', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute(
      `SELECT visibility FROM entity_reveals WHERE entity_type = 'npc' LIMIT 1`
    )
    expect(r.rows[0].visibility).toBe('hidden')
  })

  it('does not overwrite existing visibility on re-sync', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    await db.execute({
      sql: `UPDATE entity_reveals SET visibility = 'revealed' WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT visibility FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(r.rows[0].visibility).toBe('revealed')
  })

  it('sets chapter_association from firstAppearance for NPCs', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const fizzle = npcs.find((n) => n.id === 'fizzle')!
    const r = await db.execute({
      sql: `SELECT chapter_association FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(Number(r.rows[0].chapter_association)).toBe(fizzle.firstAppearance)
  })

  it('sets chapter_association from chapters[0] for locations', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT chapter_association FROM entity_reveals WHERE entity_type = 'location' AND entity_id = 'gildmaw'`,
    })
    expect(Number(r.rows[0].chapter_association)).toBe(9)
  })

  it('leaves chapter_association null for factions', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT chapter_association FROM entity_reveals WHERE entity_type = 'faction' LIMIT 1`,
    })
    expect(r.rows[0].chapter_association).toBeNull()
  })

  it('creates field reveal entries for NPC role, personality, and stat_block when present', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    const fields = r.rows.map((row) => row.field_name)
    expect(fields).toContain('role')
    expect(fields).toContain('personality')
    expect(fields).toContain('stat_block')
  })

  it('does not create stat_block entry for NPCs without statBlock', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    // leocraes has no statBlock
    const r = await db.execute({
      sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'npc' AND entity_id = 'leocraes' AND field_name = 'stat_block'`,
    })
    expect(r.rows.length).toBe(0)
  })

  it('creates indexed field entries for NPC notes (notes:0, notes:1, ...)', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const fizzle = npcs.find((n) => n.id === 'fizzle')!
    for (let i = 0; i < fizzle.notes.length; i++) {
      const r = await db.execute({
        sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle' AND field_name = ?`,
        args: [`notes:${i}`],
      })
      expect(r.rows.length).toBe(1)
    }
  })

  it('creates indexed field entries for location keyLocations', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT COUNT(*) AS c FROM entity_field_reveals WHERE entity_type = 'location' AND entity_id = 'gildmaw' AND field_name LIKE 'keyLocations:%'`,
    })
    expect(Number((r.rows[0] as Record<string, unknown>).c)).toBe(4)
  })

  it('creates field entries for faction leader and founder when present', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'faction' AND entity_id = 'nova-sentinels'`,
    })
    const fields = r.rows.map((row) => row.field_name)
    expect(fields).toContain('leader')
    expect(fields).toContain('founder')
  })

  it('does not create founder entry when faction founder is null', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    // scion-directorate has founder: null
    const r = await db.execute({
      sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'faction' AND entity_id = 'scion-directorate' AND field_name = 'founder'`,
    })
    expect(r.rows.length).toBe(0)
  })

  it('creates indexed field entries for item properties + notes', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'item' AND entity_id = 'relic-stone'`,
    })
    const fields = r.rows.map((row) => row.field_name)
    expect(fields.filter((f) => String(f).startsWith('properties:')).length).toBeGreaterThan(0)
    expect(fields).toContain('notes')
  })

  it('does not duplicate field entries on re-sync', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const before = await db.execute(`SELECT COUNT(*) AS c FROM entity_field_reveals`)
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const after = await db.execute(`SELECT COUNT(*) AS c FROM entity_field_reveals`)
    expect((after.rows[0] as Record<string, unknown>).c).toEqual(
      (before.rows[0] as Record<string, unknown>).c
    )
  })

  it('logs a warning for orphaned reveal rows', async () => {
    await db.execute({
      sql: `INSERT INTO entity_reveals (id, entity_type, entity_id, visibility) VALUES (?, 'npc', 'no-longer-exists', 'hidden')`,
      args: [crypto.randomUUID()],
    })
    const warnings: unknown[] = []
    const result = await syncReveals(db, {
      force: true,
      logger: {
        warn: (...args) => warnings.push(args),
      },
    })
    expect(result.orphanedReveals.length).toBe(1)
    expect(result.orphanedReveals[0].entityId).toBe('no-longer-exists')
    expect(warnings.length).toBe(1)
  })

  it('updates chapter_association on existing rows when the data file changes', async () => {
    // Initial sync — fizzle is firstAppearance: 1.
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    // Simulate the data file changing fizzle's chapter to 99 by manually
    // poking the existing row to a wrong value, then resync.
    await db.execute({
      sql: `UPDATE entity_reveals SET chapter_association = 99 WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    const result = await syncReveals(db, { force: true, logger: { warn: () => {} } })
    // The resync should detect the drift and restore from the data files.
    expect(result.updatedChapterAssociations).toBeGreaterThan(0)
    const r = await db.execute({
      sql: `SELECT chapter_association FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    expect(Number(r.rows[0].chapter_association)).toBe(1)
  })

  it('preserves DM-set visibility and discovered_name when updating chapter_association', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    await db.execute({
      sql: `UPDATE entity_reveals
              SET visibility = 'revealed', discovered_name = 'A friend',
                  chapter_association = 99
            WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT visibility, discovered_name, chapter_association FROM entity_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle'`,
    })
    // chapter_association resynced, but DM-controlled fields untouched.
    expect(r.rows[0].visibility).toBe('revealed')
    expect(r.rows[0].discovered_name).toBe('A friend')
    expect(Number(r.rows[0].chapter_association)).toBe(1)
  })

  it('detects stale field reveal rows when a field is no longer in the data files', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    // Manually insert a stale field row that no longer matches any data.
    await db.execute({
      sql: `INSERT INTO entity_field_reveals (id, entity_type, entity_id, field_name, is_revealed)
            VALUES (?, 'npc', 'fizzle', 'no_such_field', 1)`,
      args: [crypto.randomUUID()],
    })
    const warnings: unknown[] = []
    const result = await syncReveals(db, {
      force: true,
      logger: { warn: (...args) => warnings.push(args) },
    })
    expect(result.staleFieldRows.length).toBe(1)
    expect(result.staleFieldRows[0].fieldName).toBe('no_such_field')
    expect(warnings.length).toBe(1)
  })

  it('does not delete stale field rows (preserves DM state in case the field returns)', async () => {
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    await db.execute({
      sql: `INSERT INTO entity_field_reveals (id, entity_type, entity_id, field_name, is_revealed)
            VALUES (?, 'npc', 'fizzle', 'no_such_field', 1)`,
      args: [crypto.randomUUID()],
    })
    await syncReveals(db, { force: true, logger: { warn: () => {} } })
    const r = await db.execute({
      sql: `SELECT field_name FROM entity_field_reveals WHERE entity_type = 'npc' AND entity_id = 'fizzle' AND field_name = 'no_such_field'`,
    })
    expect(r.rows.length).toBe(1)
  })
})
