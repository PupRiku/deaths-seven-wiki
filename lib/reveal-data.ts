import type { Client } from '@libsql/client'
import { db as defaultDb } from '@/lib/db'
import type {
  EntityCustomDetail,
  EntityFieldReveal,
  EntityReveal,
  EntityType,
  Visibility,
} from '@/types'

function rowToReveal(row: Record<string, unknown>): EntityReveal {
  return {
    id: String(row.id),
    entityType: row.entity_type as EntityType,
    entityId: String(row.entity_id),
    visibility: row.visibility as Visibility,
    discoveredName: row.discovered_name === null ? null : String(row.discovered_name),
    chapterAssociation:
      row.chapter_association === null ? null : Number(row.chapter_association),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function rowToFieldReveal(row: Record<string, unknown>): EntityFieldReveal {
  return {
    id: String(row.id),
    entityType: row.entity_type as EntityType,
    entityId: String(row.entity_id),
    fieldName: String(row.field_name),
    isRevealed: Number(row.is_revealed) === 1,
    revealedAt: row.revealed_at === null ? null : String(row.revealed_at),
  }
}

function rowToCustomDetail(row: Record<string, unknown>): EntityCustomDetail {
  return {
    id: String(row.id),
    entityType: row.entity_type as EntityType,
    entityId: String(row.entity_id),
    title: String(row.title),
    content: String(row.content),
    isRevealed: Number(row.is_revealed) === 1,
    revealedAt: row.revealed_at === null ? null : String(row.revealed_at),
    createdAt: String(row.created_at),
    sortOrder: Number(row.sort_order),
  }
}

export async function loadReveals(client: Client = defaultDb): Promise<{
  reveals: EntityReveal[]
  fields: EntityFieldReveal[]
  customDetails: EntityCustomDetail[]
}> {
  const [revealsRes, fieldsRes, detailsRes] = await Promise.all([
    client.execute(`SELECT * FROM entity_reveals`),
    client.execute(`SELECT * FROM entity_field_reveals`),
    client.execute(
      `SELECT * FROM entity_custom_details ORDER BY sort_order ASC`
    ),
  ])
  return {
    reveals: revealsRes.rows.map((r) => rowToReveal(r as Record<string, unknown>)),
    fields: fieldsRes.rows.map((r) => rowToFieldReveal(r as Record<string, unknown>)),
    customDetails: detailsRes.rows.map((r) =>
      rowToCustomDetail(r as Record<string, unknown>)
    ),
  }
}

export async function loadRevealsByType(
  entityType: EntityType,
  client: Client = defaultDb
): Promise<{
  reveals: EntityReveal[]
  fields: EntityFieldReveal[]
  customDetails: EntityCustomDetail[]
}> {
  const [revealsRes, fieldsRes, detailsRes] = await Promise.all([
    client.execute({
      sql: `SELECT * FROM entity_reveals WHERE entity_type = ?`,
      args: [entityType],
    }),
    client.execute({
      sql: `SELECT * FROM entity_field_reveals WHERE entity_type = ?`,
      args: [entityType],
    }),
    client.execute({
      sql: `SELECT * FROM entity_custom_details WHERE entity_type = ? ORDER BY sort_order ASC`,
      args: [entityType],
    }),
  ])
  return {
    reveals: revealsRes.rows.map((r) => rowToReveal(r as Record<string, unknown>)),
    fields: fieldsRes.rows.map((r) => rowToFieldReveal(r as Record<string, unknown>)),
    customDetails: detailsRes.rows.map((r) =>
      rowToCustomDetail(r as Record<string, unknown>)
    ),
  }
}

export async function loadRevealForEntity(
  entityType: EntityType,
  entityId: string,
  client: Client = defaultDb
): Promise<{
  reveal: EntityReveal | null
  fields: EntityFieldReveal[]
  customDetails: EntityCustomDetail[]
}> {
  const [revealsRes, fieldsRes, detailsRes] = await Promise.all([
    client.execute({
      sql: `SELECT * FROM entity_reveals WHERE entity_type = ? AND entity_id = ? LIMIT 1`,
      args: [entityType, entityId],
    }),
    client.execute({
      sql: `SELECT * FROM entity_field_reveals WHERE entity_type = ? AND entity_id = ?`,
      args: [entityType, entityId],
    }),
    client.execute({
      sql: `SELECT * FROM entity_custom_details WHERE entity_type = ? AND entity_id = ? ORDER BY sort_order ASC`,
      args: [entityType, entityId],
    }),
  ])
  return {
    reveal: revealsRes.rows[0]
      ? rowToReveal(revealsRes.rows[0] as Record<string, unknown>)
      : null,
    fields: fieldsRes.rows.map((r) => rowToFieldReveal(r as Record<string, unknown>)),
    customDetails: detailsRes.rows.map((r) =>
      rowToCustomDetail(r as Record<string, unknown>)
    ),
  }
}

export { rowToReveal, rowToFieldReveal, rowToCustomDetail }
