import type {
  EntityCustomDetail,
  EntityFieldReveal,
  EntityReveal,
  EntityType,
  Faction,
  Item,
  NPC,
  ReferenceLocation,
  Visibility,
} from '@/types'

export type RevealEntity = NPC | ReferenceLocation | Faction | Item

// What /api/dm/reveals returns: one row per entity with its full source data
// plus all reveal-system metadata.
export interface RevealRecord {
  reveal: EntityReveal
  entity: RevealEntity
  fields: EntityFieldReveal[]
  customDetails: EntityCustomDetail[]
}

export type { EntityType, Visibility, EntityFieldReveal, EntityCustomDetail, EntityReveal }
