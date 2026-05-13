# Death's Seven — Campaign Companion

A local Next.js app for running and playing Death's Seven D&D 5e campaign. Same app, two faces: a DM wiki and a player companion view, gated by simple role-based auth.

## Features

### DM side (`/dm/*`)
- 📖 Chapter navigation with full module content
- 👥 NPC quick reference (searchable)
- ⚔️ Initiative & encounter tracker with stat blocks
- 📝 Live session note capture
- ⬇️ Export notes as .md or .txt
- 👁️ **Reveal Manager** — control what each player sees, per-entity and per-field

### Player side (`/player/*`)
- Mobile-first bottom-tab UI (Dashboard / World / Party / Journal)
- Player API routes (`/api/player/{npcs,locations,factions,items}`) enforce the
  Selective Reveal System — hidden entities never appear in responses
- Companion UI surfaces are scaffold-only; the data layer is in place

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Set the DM passphrase by writing its SHA-256 hash into `.env.local`. Generate it with:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('your-passphrase').digest('hex'))"
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| URL              | Purpose                                                     |
|------------------|-------------------------------------------------------------|
| `/`              | Role-selection landing (DM passphrase or Player link)       |
| `/join`          | Player token entry                                          |
| `/dm/*`          | All DM wiki pages (auth-gated by `dm_session` cookie)       |
| `/player/*`      | Player companion pages (auth-gated by `player_session`)     |
| `/api/auth/*`    | DM & player login / logout                                   |
| `/api/dm/*`      | DM-only data routes (auth-gated)                            |
| `/api/player/*`  | Player-only data routes (auth-gated)                        |

## Player tokens

On first run, four player tokens are seeded into the database and printed to the dev-server console:

```
  Mikey  → ROLANDO  (Rolando Ornasca)
  Kilt   → MICHAEL  (Michael Portsmith)
  Will   → SAL      (Thornvatore)
  JT     → DRAZIER  (Drazier "Gabriel" Stormbound)
```

Players visit `/join`, enter their token, and land on `/player`. Sessions last 30 days. To rotate tokens, edit `lib/db.ts` `PLAYER_TOKEN_SEEDS` and re-seed (delete rows in `player_tokens`).

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- libSQL (SQLite) for session data persistence
- Cinzel / Inter typography on a Kingdom Hearts-inspired midnight-blue palette (see [docs/VISUAL_LANGUAGE.md](docs/VISUAL_LANGUAGE.md))
- `@tabler/icons-react` for line iconography

## Selective Reveal System

The reveal system controls what players can see. NPCs, locations, factions,
and items each have a base **visibility** of Hidden / Discovered / Revealed,
plus per-field reveal toggles for individual notes, properties, key locations,
etc.

- **Hidden** — entity is completely absent from `/api/player/*` responses
- **Discovered** — only physical/observable info: NPC `appearance`, location type, faction type+alignment, item type. The display name is whatever the DM has set in `discovered_name` (falls back to `???`).
- **Revealed** — full base data, plus per-field reveal toggles for notes, properties, key members, etc.

The DM manages all this from `/dm/reveals`. The filtering logic lives in
[lib/reveal-filter.ts](lib/reveal-filter.ts) — it is the single source of
truth for "what does a player see," shared by both the Player API and the
DM "See as Player" preview.

The data files (`data/npcs/`, `data/reference/`) remain the source of truth
for content; the reveal tables (`entity_reveals`, `entity_field_reveals`,
`entity_custom_details`) only control visibility. Entities are synced from
the data files into reveal rows on app startup via [lib/reveal-sync.ts](lib/reveal-sync.ts).

## Tests

```bash
npm test           # one-off
npm run test:watch # watch mode
```
