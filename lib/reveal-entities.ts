// Helpers that look up the source-of-truth entity object by (type, id) from
// the data files. Used by both DM and Player API routes so the lookup logic
// is in one place.

import { npcs } from '@/data/npcs'
import { LOCATIONS, FACTIONS, ITEMS } from '@/data/reference'
import type { EntityType, NPC, ReferenceLocation, Faction, Item } from '@/types'

export function getEntity(
  entityType: EntityType,
  entityId: string
): NPC | ReferenceLocation | Faction | Item | undefined {
  switch (entityType) {
    case 'npc':
      return npcs.find((n) => n.id === entityId)
    case 'location':
      return (LOCATIONS as unknown as ReferenceLocation[]).find(
        (l) => l.id === entityId
      )
    case 'faction':
      return (FACTIONS as unknown as Faction[]).find((f) => f.id === entityId)
    case 'item':
      return (ITEMS as unknown as Item[]).find((i) => i.id === entityId)
  }
}

export function entityName(
  entityType: EntityType,
  entity: NPC | ReferenceLocation | Faction | Item
): string {
  return entity.name
}

export function isValidEntityType(value: unknown): value is EntityType {
  return value === 'npc' || value === 'location' || value === 'faction' || value === 'item'
}

export function isValidVisibility(value: unknown): value is 'hidden' | 'discovered' | 'revealed' {
  return value === 'hidden' || value === 'discovered' || value === 'revealed'
}
