import crypto from 'crypto'
import type { Client } from '@libsql/client'
import { db as defaultDb } from '@/lib/db'
import { npcs } from '@/data/npcs'
import { LOCATIONS, FACTIONS, ITEMS } from '@/data/reference'
import type {
  NPC,
  ReferenceLocation,
  Faction,
  Item,
  EntityType,
} from '@/types'

// Single guard so syncReveals only runs once per process even if it's called
// from multiple cold-start paths (root layout + middleware-bypassing routes).
let syncedThisProcess = false

export function _resetSyncLatchForTests() {
  syncedThisProcess = false
}

interface EntitySpec {
  entityType: EntityType
  entityId: string
  chapterAssociation: number | null
  fieldNames: string[]
}

// Per-entity-type schema: which fields are individually toggleable in the
// reveal system. NOT included here: name, description, appearance, status,
// alignment, type, color, tags, id — those are tier-controlled, not per-field.
function npcFields(npc: NPC): string[] {
  const fields = ['role', 'personality']
  if (npc.statBlock) fields.push('stat_block')
  for (let i = 0; i < npc.notes.length; i++) fields.push(`notes:${i}`)
  return fields
}

function locationFields(loc: ReferenceLocation): string[] {
  const fields: string[] = []
  if (loc.altName) fields.push('altName')
  for (let i = 0; i < loc.keyLocations.length; i++) fields.push(`keyLocations:${i}`)
  if (loc.npcsPresent && loc.npcsPresent.length > 0) fields.push('npcsPresent')
  // notes is a single string in the reference data shape, not an array.
  fields.push('notes')
  return fields
}

function factionFields(faction: Faction): string[] {
  const fields = ['leader']
  if (faction.founder) fields.push('founder')
  for (let i = 0; i < faction.keyMembers.length; i++) fields.push(`keyMembers:${i}`)
  for (let i = 0; i < faction.notes.length; i++) fields.push(`notes:${i}`)
  return fields
}

function itemFields(item: Item): string[] {
  const fields: string[] = []
  for (let i = 0; i < item.properties.length; i++) fields.push(`properties:${i}`)
  fields.push('notes')
  return fields
}

function buildSpecs(): EntitySpec[] {
  const specs: EntitySpec[] = []

  for (const npc of npcs) {
    specs.push({
      entityType: 'npc',
      entityId: npc.id,
      chapterAssociation: npc.firstAppearance,
      fieldNames: npcFields(npc),
    })
  }

  for (const loc of LOCATIONS as unknown as ReferenceLocation[]) {
    specs.push({
      entityType: 'location',
      entityId: loc.id,
      chapterAssociation: loc.chapters?.[0] ?? null,
      fieldNames: locationFields(loc),
    })
  }

  for (const faction of FACTIONS as unknown as Faction[]) {
    specs.push({
      entityType: 'faction',
      entityId: faction.id,
      // Factions don't have a single chapter association.
      chapterAssociation: null,
      fieldNames: factionFields(faction),
    })
  }

  for (const item of ITEMS as unknown as Item[]) {
    specs.push({
      entityType: 'item',
      entityId: item.id,
      chapterAssociation: item.chapter ?? null,
      fieldNames: itemFields(item),
    })
  }

  return specs
}

interface SyncOptions {
  // Logger override so tests can capture warnings without polluting stdout.
  logger?: { warn: (...args: unknown[]) => void }
  // Force re-sync even if syncedThisProcess is set. Tests use this.
  force?: boolean
}

interface SyncResult {
  insertedReveals: number
  insertedFields: number
  orphanedReveals: Array<{ entityType: string; entityId: string }>
}

export async function syncReveals(
  client: Client = defaultDb,
  options: SyncOptions = {}
): Promise<SyncResult> {
  if (syncedThisProcess && !options.force && client === defaultDb) {
    return { insertedReveals: 0, insertedFields: 0, orphanedReveals: [] }
  }

  const logger = options.logger ?? console
  const specs = buildSpecs()
  let insertedReveals = 0
  let insertedFields = 0

  // Build the set of valid (type, id) keys so we can detect orphans.
  const liveKeys = new Set<string>(
    specs.map((s) => `${s.entityType}:${s.entityId}`)
  )

  for (const spec of specs) {
    const reveal = await client.execute({
      sql: `INSERT OR IGNORE INTO entity_reveals
              (id, entity_type, entity_id, visibility, chapter_association)
            VALUES (?, ?, ?, 'hidden', ?)`,
      args: [
        crypto.randomUUID(),
        spec.entityType,
        spec.entityId,
        spec.chapterAssociation,
      ],
    })
    if ((reveal.rowsAffected ?? 0) > 0) insertedReveals++

    for (const field of spec.fieldNames) {
      const fieldRes = await client.execute({
        sql: `INSERT OR IGNORE INTO entity_field_reveals
                (id, entity_type, entity_id, field_name, is_revealed)
              VALUES (?, ?, ?, ?, 0)`,
        args: [crypto.randomUUID(), spec.entityType, spec.entityId, field],
      })
      if ((fieldRes.rowsAffected ?? 0) > 0) insertedFields++
    }
  }

  // Find reveal rows whose entity is no longer in the data files. We don't
  // delete them — the DM may have custom details attached. Just warn.
  const existing = await client.execute(
    `SELECT entity_type, entity_id FROM entity_reveals`
  )
  const orphans: Array<{ entityType: string; entityId: string }> = []
  for (const row of existing.rows) {
    const key = `${row.entity_type}:${row.entity_id}`
    if (!liveKeys.has(key)) {
      orphans.push({
        entityType: String(row.entity_type),
        entityId: String(row.entity_id),
      })
    }
  }
  if (orphans.length > 0) {
    logger.warn(
      `[reveal-sync] ${orphans.length} orphaned reveal row(s) — entity removed from data files but reveal data retained:`,
      orphans
    )
  }

  if (client === defaultDb) syncedThisProcess = true
  return { insertedReveals, insertedFields, orphanedReveals: orphans }
}
