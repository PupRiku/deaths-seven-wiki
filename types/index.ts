// ============================================================
// DEADLY SEVEN WIKI — TYPE DEFINITIONS
// ============================================================

// --- CHAPTERS ---

export type SectionType = 'prose' | 'scene' | 'encounter' | 'npc'

export interface Section {
  title: string
  type: SectionType
  content?: string
  boxedText?: string
  boxedText2?: string
  keyInfo?: string[]
  creatures?: string[]
  tactics?: string | string[]
  dmNote?: string
  bucket?: {
    discovery: string
    encounter?: string
    aftermath?: string
    dmNote: string
  }
}

export interface Chapter {
  number: number
  title: string
  act: 1 | 2 | 3
  levelStart: number
  levelEnd: number
  summary: string
  sessions?: number
  sections: Section[]
  tags?: string[]
}

// Lightweight chapter metadata for index/navigation (no section content)
export interface ChapterMeta {
  number: number
  title: string
  act: 1 | 2 | 3
  levelStart: number
  levelEnd: number
  sectionCount: number
  summary: string
}



// --- NPCS ---

export type NPCStatus = 'Active' | 'Deceased' | 'Unknown' | 'Imprisoned'
export type NPCAlignment = 'Ally' | 'Enemy' | 'Neutral' | 'Complex'

export interface NPC {
  id: string
  name: string
  race: string
  role: string
  status: NPCStatus
  alignment: NPCAlignment
  location: string
  arc: string
  description: string
  personality: string
  notes: string[]
  firstAppearance: number // chapter number
  statBlock?: StatBlock
  tags: string[]
}

// --- STAT BLOCKS ---

export interface StatBlock {
  name: string
  cr: string
  ac: number
  hp: number | string
  speed: string
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
  savingThrows?: string[]
  skills?: string[]
  damageImmunities?: string[]
  damageResistances?: string[]
  conditionImmunities?: string[]
  senses?: string
  languages?: string
  traits?: { name: string; description: string }[]
  actions?: { name: string; description: string }[]
  bonusActions?: { name: string; description: string }[]
  reactions?: { name: string; description: string }[]
  legendaryActions?: { name: string; description: string }[]
  legendaryResistances?: number
}

// --- SINS ---

export type SinName =
  | 'Greed'
  | 'Lust'
  | 'Sloth'
  | 'Gluttony'
  | 'Envy'
  | 'Wrath'
  | 'Pride'

export type SinStatus = 'Active' | 'Reaped' | 'Unknown'

export interface Sin {
  sin: SinName
  virtue: string
  host: string
  hostDescription: string
  location: string
  chapter: number
  status: SinStatus
  concept: string
  siphonEffect: string
  notes: string[]
  color: string
}

// --- PLAYER CHARACTERS ---

export interface PlayerCharacter {
  player: string
  characterName: string
  pastName: string
  pastRace: string
  pastClass: string
  newRace: string
  newClass: string
  background: string
  hp: number
  ac: number
  stats: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
  keyVulnerabilities: string[]
  keyStrengths: string[]
  personalArc: string
  homeland: string
  notes: string[]
}

// --- LOCATIONS ---

export interface Location {
  id: string
  name: string
  altName?: string
  type: string
  description: string
  sinArc?: SinName
  chapterIntroduced: number
  npcsPresent: string[]
  notes: string[]
  tags: string[]
}

// --- SESSION LOG ---

export interface SessionNote {
  id: string
  sessionNumber: number
  chapter: number
  date: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// --- INITIATIVE TRACKER ---

export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number
  maxHp: number
  ac: number
  conditions: string[]
  isPlayer: boolean
  isEnemy: boolean
  notes: string
  color?: string
}

export interface EncounterState {
  id: string
  name: string
  round: number
  turn: number
  combatants: Combatant[]
  isActive: boolean
  createdAt: string
}

// --- SEARCH ---

export interface SearchResult {
  type: 'chapter' | 'npc' | 'location' | 'sin' | 'note'
  id: string
  title: string
  subtitle: string
  excerpt: string
  url: string
}

// --- EXPORT ---

export type ExportFormat = 'txt' | 'md'

export interface ExportOptions {
  format: ExportFormat
  includeChapters?: boolean
  includeSessions?: boolean
  sessionRange?: { start: number; end: number }
  chapterRange?: { start: number; end: number }
}
