# Death's Seven — Campaign Companion

A local Next.js app for running and playing Death's Seven D&D 5e campaign. Same app, two faces: a DM wiki and a player companion view, gated by simple role-based auth.

## Features

### DM side (`/dm/*`)
- 📖 Chapter navigation with full module content
- 👥 NPC quick reference (searchable)
- ⚔️ Initiative & encounter tracker with stat blocks
- 📝 Live session note capture
- ⬇️ Export notes as .md or .txt

### Player side (`/player/*`)
- Mobile-first bottom-tab UI (Dashboard / World / Party / Journal)
- Scaffold only — feature implementation is staged as separate work

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

## Tests

```bash
npm test           # one-off
npm run test:watch # watch mode
```
