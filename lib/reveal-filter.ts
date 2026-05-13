// SPOILER PROTECTION BOUNDARY
// This module is the single source of truth for "what does a player see."
// Both the Player API (app/api/player/*) and the DM "See as Player" preview
// call filterEntityForPlayer(). Anything that isn't returned here cannot be
// seen by a player.

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

  if (reveal.visibility === 'discovered') {
    return {
      id: npc.id,
      entityType: 'npc',
      visibility: 'discovered',
      displayName: discoveredDisplayName(reveal),
      appearance: npc.appearance,
      image: npc.statBlock?.image,
      firstAppearance: npc.firstAppearance,
      tags: npc.tags,
    }
  }

  // revealed
  const roleRevealed = isFieldRevealed(fields, 'role')
  return {
    id: npc.id,
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
    tags: npc.tags,
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

  if (reveal.visibility === 'discovered') {
    return {
      id: loc.id,
      entityType: 'location',
      visibility: 'discovered',
      displayName: discoveredDisplayName(reveal),
      // Show the type ("City", "Dungeon", etc.) at discovered tier — that
      // is just structural metadata, not a spoiler.
      description: loc.type,
      tags: loc.tags,
    }
  }

  return {
    id: loc.id,
    entityType: 'location',
    visibility: 'revealed',
    displayName: loc.name,
    name: loc.name,
    altName: isFieldRevealed(fields, 'altName') ? loc.altName ?? null : null,
    type: loc.type,
    description: loc.description,
    sinArc: loc.sinArc,
    chapters: loc.chapters,
    tags: loc.tags,
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

  if (reveal.visibility === 'discovered') {
    return {
      id: faction.id,
      entityType: 'faction',
      visibility: 'discovered',
      displayName: discoveredDisplayName(reveal),
      type: faction.type,
      alignment: faction.alignment,
      color: faction.color,
      tags: faction.tags,
    }
  }

  return {
    id: faction.id,
    entityType: 'faction',
    visibility: 'revealed',
    displayName: faction.name,
    name: faction.name,
    type: faction.type,
    alignment: faction.alignment,
    color: faction.color,
    description: faction.description,
    tags: faction.tags,
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

  if (reveal.visibility === 'discovered') {
    return {
      id: item.id,
      entityType: 'item',
      visibility: 'discovered',
      // Discovered items use the in-world found name (discovered_name) —
      // never the true name.
      displayName: discoveredDisplayName(reveal),
      type: item.type,
      tags: item.tags,
    }
  }

  return {
    id: item.id,
    entityType: 'item',
    visibility: 'revealed',
    displayName: item.name,
    name: item.name,
    type: item.type,
    description: item.description,
    tags: item.tags,
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
  // Defensive: only return data for this exact entity. If reveal/field rows
  // somehow mix entities, drop the mismatched ones rather than leaking.
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
