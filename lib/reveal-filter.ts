// SPOILER PROTECTION BOUNDARY
// This module is the single source of truth for "what does a player see."
// Both the Player API (app/api/player/*) and the DM "See as Player" preview
// call filterEntityForPlayer(). Anything that isn't returned here cannot be
// seen by a player.
//
// What we DO NOT return at any tier:
// - Source `entityId` (e.g. "the-aspirant", "king-kaelen", "relic-stone") —
//   these are semantic and leak plot via the Network tab. We emit an opaque
//   `pid` (deterministic SHA-256 prefix) instead.
// - Source `tags` — DM-side tags include classifications like "boss",
//   "sin host", "aspirant", "true reapers", "pride arc" which are spoilers
//   in themselves. The data files have no concept of player-safe tags yet,
//   so we omit tags entirely. (Add a separate `playerTags` field to data
//   if/when player UI needs categorization.)
//
// What we DO NOT return at the discovered tier (tighter than revealed):
// - Stat-block image (filenames are semantic — `/images/fizzle.png`)
// - firstAppearance chapter (tells the player when an unknown NPC matters)
// - Real name, description, role, personality, notes, statBlock, custom details

import crypto from 'crypto'
import type {
  NPC,
  ReferenceLocation,
  Faction,
  Item,
  EntityType,
  EntityReveal,
  EntityFieldReveal,
  EntityCustomDetail,
  PlayerEntity,
} from '@/types'

type FilterableEntity = NPC | ReferenceLocation | Faction | Item

// Deterministic per-(type, id) opaque ID. Stable across requests, but does
// not reveal the source entityId. Truncated SHA-256 hex — collisions across
// the small entity set are practically impossible.
function opaquePid(entityType: EntityType, entityId: string): string {
  return crypto
    .createHash('sha256')
    .update(`${entityType}:${entityId}`)
    .digest('hex')
    .slice(0, 16)
}

function isFieldRevealed(fields: EntityFieldReveal[], name: string): boolean {
  return fields.some((f) => f.fieldName === name && f.isRevealed)
}

function revealedNotesByIndex(
  fields: EntityFieldReveal[],
  notes: string[]
): string[] {
  const out: string[] = []
  for (let i = 0; i < notes.length; i++) {
    if (isFieldRevealed(fields, `notes:${i}`)) out.push(notes[i])
  }
  return out
}

function revealedArrayByIndex(
  fields: EntityFieldReveal[],
  prefix: string,
  source: string[]
): string[] {
  const out: string[] = []
  for (let i = 0; i < source.length; i++) {
    if (isFieldRevealed(fields, `${prefix}:${i}`)) out.push(source[i])
  }
  return out
}

function revealedCustomDetails(
  customDetails: EntityCustomDetail[]
): Array<{ id: string; title: string; content: string }> {
  return customDetails
    .filter((d) => d.isRevealed)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((d) => ({ id: d.id, title: d.title, content: d.content }))
}

function discoveredDisplayName(reveal: EntityReveal): string {
  return reveal.discoveredName ?? '???'
}

// === NPC ===

function filterNpc(
  npc: NPC,
  reveal: EntityReveal,
  fields: EntityFieldReveal[],
  customDetails: EntityCustomDetail[]
): PlayerEntity | null {
  if (reveal.visibility === 'hidden') return null

  const pid = opaquePid('npc', reveal.entityId)

  if (reveal.visibility === 'discovered') {
    return {
      pid,
      entityType: 'npc',
      visibility: 'discovered',
      displayName: discoveredDisplayName(reveal),
      appearance: npc.appearance,
    }
  }

  // revealed
  const roleRevealed = isFieldRevealed(fields, 'role')
  return {
    pid,
    entityType: 'npc',
    visibility: 'revealed',
    displayName: npc.name,
    name: npc.name,
    race: npc.race,
    role: roleRevealed ? npc.role : null,
    appearance: npc.appearance,
    description: npc.description,
    alignment: npc.alignment,
    location: npc.location,
    status: npc.status,
    image: npc.statBlock?.image,
    firstAppearance: npc.firstAppearance,
    revealedFields: {
      role: roleRevealed ? npc.role : null,
      personality: isFieldRevealed(fields, 'personality') ? npc.personality : null,
      stat_block:
        npc.statBlock && isFieldRevealed(fields, 'stat_block') ? npc.statBlock : null,
      notes: revealedNotesByIndex(fields, npc.notes),
    },
    customDetails: revealedCustomDetails(customDetails),
  }
}

// === Location ===

function filterLocation(
  loc: ReferenceLocation,
  reveal: EntityReveal,
  fields: EntityFieldReveal[],
  customDetails: EntityCustomDetail[]
): PlayerEntity | null {
  if (reveal.visibility === 'hidden') return null

  const pid = opaquePid('location', reveal.entityId)

  if (reveal.visibility === 'discovered') {
    return {
      pid,
      entityType: 'location',
      visibility: 'discovered',
      displayName: discoveredDisplayName(reveal),
      // Show the type ("City", "Dungeon", etc.) at discovered tier — that
      // is just structural metadata, not a spoiler.
      description: loc.type,
    }
  }

  return {
    pid,
    entityType: 'location',
    visibility: 'revealed',
    displayName: loc.name,
    name: loc.name,
    altName: isFieldRevealed(fields, 'altName') ? loc.altName ?? null : null,
    type: loc.type,
    description: loc.description,
    sinArc: loc.sinArc,
    chapters: loc.chapters,
    revealedFields: {
      keyLocations: revealedArrayByIndex(fields, 'keyLocations', loc.keyLocations),
      npcsPresent:
        isFieldRevealed(fields, 'npcsPresent') && loc.npcsPresent
          ? loc.npcsPresent
          : null,
      notes: isFieldRevealed(fields, 'notes') ? loc.notes : null,
    },
    customDetails: revealedCustomDetails(customDetails),
  }
}

// === Faction ===

function filterFaction(
  faction: Faction,
  reveal: EntityReveal,
  fields: EntityFieldReveal[],
  customDetails: EntityCustomDetail[]
): PlayerEntity | null {
  if (reveal.visibility === 'hidden') return null

  const pid = opaquePid('faction', reveal.entityId)

  if (reveal.visibility === 'discovered') {
    return {
      pid,
      entityType: 'faction',
      visibility: 'discovered',
      displayName: discoveredDisplayName(reveal),
      type: faction.type,
      alignment: faction.alignment,
      color: faction.color,
    }
  }

  return {
    pid,
    entityType: 'faction',
    visibility: 'revealed',
    displayName: faction.name,
    name: faction.name,
    type: faction.type,
    alignment: faction.alignment,
    color: faction.color,
    description: faction.description,
    revealedFields: {
      leader: isFieldRevealed(fields, 'leader') ? faction.leader : null,
      founder: isFieldRevealed(fields, 'founder') ? faction.founder : null,
      keyMembers: revealedArrayByIndex(fields, 'keyMembers', faction.keyMembers),
      notes: revealedNotesByIndex(fields, faction.notes),
    },
    customDetails: revealedCustomDetails(customDetails),
  }
}

// === Item ===

function filterItem(
  item: Item,
  reveal: EntityReveal,
  fields: EntityFieldReveal[],
  customDetails: EntityCustomDetail[]
): PlayerEntity | null {
  if (reveal.visibility === 'hidden') return null

  const pid = opaquePid('item', reveal.entityId)

  if (reveal.visibility === 'discovered') {
    return {
      pid,
      entityType: 'item',
      visibility: 'discovered',
      // Discovered items use the in-world found name (discovered_name) —
      // never the true name.
      displayName: discoveredDisplayName(reveal),
      type: item.type,
    }
  }

  return {
    pid,
    entityType: 'item',
    visibility: 'revealed',
    displayName: item.name,
    name: item.name,
    type: item.type,
    description: item.description,
    revealedFields: {
      properties: revealedArrayByIndex(fields, 'properties', item.properties),
      notes: isFieldRevealed(fields, 'notes') ? item.notes : null,
    },
    customDetails: revealedCustomDetails(customDetails),
  }
}

// === Dispatcher ===

export function filterEntityForPlayer(
  entity: FilterableEntity,
  entityType: EntityType,
  reveal: EntityReveal,
  fields: EntityFieldReveal[],
  customDetails: EntityCustomDetail[]
): PlayerEntity | null {
  // Defensive: only return data for this exact entity. If the caller pairs
  // the wrong entity object with a reveal row, OR passes field/detail rows
  // belonging to a different entity, drop everything rather than leak.
  if (entity.id !== reveal.entityId) return null

  const ownFields = fields.filter(
    (f) => f.entityType === entityType && f.entityId === reveal.entityId
  )
  const ownDetails = customDetails.filter(
    (d) => d.entityType === entityType && d.entityId === reveal.entityId
  )

  switch (entityType) {
    case 'npc':
      return filterNpc(entity as NPC, reveal, ownFields, ownDetails)
    case 'location':
      return filterLocation(
        entity as ReferenceLocation,
        reveal,
        ownFields,
        ownDetails
      )
    case 'faction':
      return filterFaction(entity as Faction, reveal, ownFields, ownDetails)
    case 'item':
      return filterItem(entity as Item, reveal, ownFields, ownDetails)
  }
}
