# Death's Seven Wiki - Visual Language Specification

## Aesthetic Direction: Kingdom Hearts Primary, FF Hybrid

A KH-inspired dark interface built on deep midnight blues with soft luminous glows, clean negative space, and warm-cool color tension. The design should feel like navigating a KH journal or menu screen - smooth, unhurried, slightly dreamlike - while retaining the typographic authority of Final Fantasy for headings and structural elements.

**Core emotional goals:** Clarity under pressure (session-facing tool), warmth in the dark (orange glows on midnight blue), and a sense of place (this is _Death's Seven's_ world, not a generic wiki).

---

## 1. Color System

### Background Hierarchy (deep to surface)

These replace the current warm-black `--bg-*` variables with midnight blue tones. Each step adds blue-gray light, like moonlight on dark water.

```css
--bg-deep: #060b18; /* Deepest - body background, void */
--bg-base: #0a1020; /* Sidebar, fixed chrome */
--bg-surface: #101828; /* Cards, content panels */
--bg-raised: #182030; /* Hover states, expanded cards */
--bg-hover: #1e2838; /* Active hover, selected items */
```

### Border Hierarchy

```css
--border: #1e2838; /* Default - subtle separation */
--border-bright: #2a3648; /* Emphasis - card edges, dividers */
--border-accent: #3a4a60; /* Strong - section separators */
```

### Text Hierarchy

```css
--text-primary: #e0ecff; /* Cool white-blue - body text, headings */
--text-secondary: #8090b0; /* Muted blue-gray - labels, metadata */
--text-muted: #4a5a78; /* Deep blue-gray - placeholders, disabled */
--text-accent: #e8834a; /* Orange - heading accents, interactive cues */
```

### Brand Palette (unchanged hex values, new dim/bright scales)

```css
--orange: #e8834a;
--orange-dim: #7a4a2a;
--orange-bright: #f4a876;

--purple: #8b5cf6;
--purple-dim: #5a3db8;
--purple-bright: #b794f6;

--cyan: #22d3ee;
--cyan-dim: #147a8a;
--cyan-bright: #67e8f9;
```

### Sin Colors (unchanged)

```css
--sin-greed: #f39c12;
--sin-lust: #9b59b6;
--sin-sloth: #3498db;
--sin-gluttony: #e67e22;
--sin-envy: #2ecc71;
--sin-wrath: #e74c3c;
--sin-pride: #c8d6e5; /* Shifted from near-white #ecf0f1 to soft steel */
```

### Semantic Status Colors

```css
--status-success: #34d399; /* Active, healthy HP */
--status-warning: #fbbf24; /* Wounded HP, caution */
--status-danger: #f87171; /* Critical HP, enemy, remove */
--status-info: #60a5fa; /* Scene type, informational */
```

### Glow Color Tokens

Used only in `box-shadow` for interactive/active states. Never on static content.

```css
--glow-orange: rgba(
  232,
  131,
  74,
  0.15
); /* Action glow - buttons, active turn */
--glow-cyan: rgba(34, 211, 238, 0.08); /* Focus glow - inputs, nav active */
--glow-purple: rgba(139, 92, 246, 0.1); /* Arcane glow - magic/sin elements */
--glow-success: rgba(52, 211, 153, 0.08); /* Status glow - healthy HP bars */
--glow-warning: rgba(251, 191, 36, 0.08); /* Status glow - wounded HP bars */
--glow-danger: rgba(248, 113, 113, 0.08); /* Status glow - critical HP bars */
```

---

## 2. Typography

### Font Stack

```css
--font-display: 'Cinzel Decorative', serif; /* KEPT - campaign title only */
--font-heading: 'Cinzel', serif; /* KEPT - headings, nav, badges, labels */
--font-body: 'Inter', system-ui, sans-serif; /* CHANGED from EB Garamond */
--font-mono: 'JetBrains Mono', monospace; /* KEPT - stats, dice, numbers */
```

**Why Inter replaces EB Garamond:** Inter is cleaner at small sizes on dark backgrounds, scans faster at the table during play, and pairs better with Cinzel's weight. EB Garamond's thin strokes strain against dark backgrounds at body sizes. The serif personality now lives entirely in Cinzel (headings, nav labels, badges) where it has room to breathe.

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Type Scale

| Size             | Font              | Weight | Tracking | Use                                    |
| ---------------- | ----------------- | ------ | -------- | -------------------------------------- |
| 1.75rem (28px)   | Cinzel Decorative | 400    | 0.04em   | Campaign title - once per page max     |
| 1.25rem (20px)   | Cinzel            | 600    | 0.04em   | h1 - page headings                     |
| 1rem (16px)      | Cinzel            | 600    | 0.05em   | h2 - section headings, card titles     |
| 0.875rem (14px)  | Cinzel            | 600    | 0.06em   | h3 - subsections, stat block headers   |
| 0.9375rem (15px) | Inter             | 400    | normal   | Body text - main content               |
| 0.8125rem (13px) | Inter             | 400    | normal   | Secondary text - metadata, captions    |
| 0.75rem (12px)   | Cinzel            | 600    | 0.1em    | Nav labels, badge text, button text    |
| 0.6875rem (11px) | Cinzel            | 400    | 0.12em   | Section group labels (smallest Cinzel) |

### Typography Rules

- **Cinzel never goes below 11px (0.6875rem).** Below that its serifs collapse.
- **Inter handles everything under 13px.** Small labels, form text, tooltips.
- **Letter-spacing increases as Cinzel size decreases.** 0.04em at 20px, up to 0.12em at 11px.
- **Body line-height is 1.65.** Tighter than the current 1.7 to match Inter's x-height.
- **Heading line-height is 1.3.** Same as current.

---

## 3. Spacing System

```css
--space-xs: 0.25rem; /* 4px  - badge padding, tight gaps */
--space-sm: 0.5rem; /* 8px  - inner card gaps, between badges */
--space-md: 0.75rem; /* 12px - card padding sides, between cards */
--space-lg: 1rem; /* 16px - card padding top/bottom, section gaps */
--space-xl: 1.5rem; /* 24px - between major sections */
--space-2xl: 2rem; /* 32px - page padding, large section breaks */
```

### Radius Scale

```css
--radius-sm: 4px; /* Badges, tiny elements */
--radius-md: 6px; /* Buttons, inputs, stat cells */
--radius-lg: 8px; /* Cards, panels, modals */
--radius-xl: 12px; /* Large containers, sidebar sections */
--radius-pill: 999px; /* Badges, pills */
```

---

## 4. Sidebar Width

```css
--sidebar-w: 240px; /* Unchanged */
```

---

## 5. Component Specifications

### 5.1 Cards (`.card`)

The primary content container. Replaces the current gold-accented cards.

```css
.card {
  background: var(--bg-surface);
  border: 0.5px solid var(--border);
  border-left: 2px solid var(--cyan); /* Default accent - cyan */
  border-radius: var(--radius-lg);
  padding: var(--space-lg) calc(var(--space-lg) + 0.25rem); /* 16px 20px */
  margin-bottom: var(--space-md);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  background: var(--bg-raised);
  border-color: var(--border-bright);
  box-shadow: 0 0 16px var(--glow-cyan);
}
```

**Accent color varies by context:**

- Default/player: `var(--cyan)`
- Enemy: `var(--status-danger)` (#f87171)
- Arcane/magical: `var(--purple)`
- Sin-affiliated: The matching `--sin-*` color
- DM note: `var(--status-success)` (#34d399)
- Read-aloud/story: `var(--orange)`

### 5.2 Boxed Text (`.boxed-text`) - Read-Aloud

```css
.boxed-text {
  background: rgba(232, 131, 74, 0.06);
  border: 0.5px solid rgba(232, 131, 74, 0.15);
  border-left: 2px solid var(--orange);
  border-radius: var(--radius-lg);
  padding: var(--space-lg) calc(var(--space-lg) + 0.25rem);
  margin: var(--space-md) 0;
  font-style: italic;
  color: var(--orange-bright);
  line-height: 1.75;
}
```

### 5.3 DM Notes (`.dm-note`)

```css
.dm-note {
  background: rgba(34, 211, 238, 0.04);
  border: 0.5px solid rgba(34, 211, 238, 0.1);
  border-left: 2px solid var(--status-success);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  margin: var(--space-md) 0;
}

.dm-note-label {
  font-family: var(--font-heading);
  font-size: 0.625rem; /* 10px */
  color: var(--status-success);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: var(--space-xs);
}

.dm-note p {
  margin: 0;
  color: #80c0a0;
  font-size: 0.8125rem;
  font-style: italic;
}
```

### 5.4 Badges (`.badge`)

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-family: var(--font-heading);
  font-size: 0.6875rem; /* 11px */
  letter-spacing: 0.06em;
  font-weight: 600;
  border: 0.5px solid;
}
```

**Badge color pattern:** Each badge type uses `color: X`, `border-color: X at 25% opacity`, `background: X at 8% opacity`.

| Badge Type        | Color Base                  |
| ----------------- | --------------------------- |
| Enemy             | #f87171                     |
| Ally              | #22d3ee                     |
| Neutral           | #e8834a                     |
| Complex           | #8b5cf6                     |
| Active (status)   | #34d399                     |
| Deceased (status) | #f87171                     |
| CR/Level          | #e8834a                     |
| Sin tag           | The matching --sin-\* color |

### 5.5 Buttons

```css
.btn {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: 0.5px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-primary {
  background: rgba(232, 131, 74, 0.12);
  border-color: rgba(232, 131, 74, 0.3);
  color: var(--orange);
}

.btn-primary:hover {
  background: var(--orange);
  color: var(--bg-deep);
  box-shadow: 0 0 16px var(--glow-orange);
}

.btn-ghost {
  background: transparent;
  border-color: var(--border-bright);
  color: var(--text-secondary);
}

.btn-ghost:hover {
  border-color: var(--border-accent);
  color: var(--text-primary);
}

.btn-danger {
  background: transparent;
  border-color: rgba(248, 113, 113, 0.2);
  color: var(--status-danger);
}

.btn-danger:hover {
  background: rgba(248, 113, 113, 0.08);
}
```

### 5.6 Navigation (Sidebar)

```css
.nav-logo {
  padding: 1.25rem 1rem 1rem;
  border-bottom: 0.5px solid var(--border);
}

.nav-logo-title {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--orange); /* Changed from gold to orange */
  letter-spacing: 0.08em;
  line-height: 1.3;
}

.nav-logo-sub {
  font-family: var(--font-heading);
  font-size: 0.6875rem;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  margin-top: 0.2rem;
}

.nav-section-label {
  font-family: var(--font-heading);
  font-size: 0.6875rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  padding: 0 1rem 0.3rem;
  display: block;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.15s ease;
  border-left: 2px solid transparent;
  border-radius: 0; /* No radius - left border accent */
  cursor: pointer;
}

.nav-item:hover {
  color: var(--text-primary);
  background: rgba(30, 40, 56, 0.5);
}

.nav-item.active {
  color: var(--cyan);
  border-left-color: var(--cyan);
  background: rgba(34, 211, 238, 0.06);
}
```

**Nav icons:** Replace the current unicode symbols (◈, ◉, ✦, ⚔, ✎) with [Tabler Icons](https://tabler.io/icons). Install `@tabler/icons-react` and use:

| Section     | Icon | Tabler Name    |
| ----------- | ---- | -------------- |
| Chapters    | 📖→  | `IconBook`     |
| NPCs        | 👥→  | `IconUsers`    |
| Reference   | 📚→  | `IconBooks`    |
| Encounter   | ⚔→   | `IconSwords`   |
| Session Log | 📝→  | `IconNotebook` |

### 5.7 Search Input

```css
.search-input {
  width: 100%;
  background: var(--bg-surface);
  border: 0.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.625rem 1rem;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 0 12px var(--glow-cyan);
}

.search-input::placeholder {
  color: var(--text-muted);
}
```

### 5.8 Chapter Tabs

```css
.chapter-tab {
  font-family: var(--font-heading);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  font-weight: 600;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-md);
  border: 0.5px solid var(--border);
  background: var(--bg-surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.chapter-tab:hover {
  border-color: var(--border-bright);
  color: var(--text-secondary);
}

.chapter-tab.active {
  border-color: rgba(232, 131, 74, 0.4);
  background: var(--bg-raised);
  color: var(--orange);
  box-shadow: 0 0 8px var(--glow-orange);
}
```

### 5.9 Stat Block

The stat block header uses a 2px top border in the NPC's accent color. The stat grid uses faint cyan-tinted cells (the FF influence - rigid, authoritative).

```css
/* Stat block container */
.stat-block {
  background: var(--bg-base);
  border: 0.5px solid; /* border-color set dynamically to accent + 20% opacity */
  border-top: 2px solid; /* border-color set dynamically to accent color */
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-top: var(--space-lg);
}

/* 6-column ability score grid */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.stat-cell {
  text-align: center;
  padding: 0.5rem 0.25rem;
  background: rgba(34, 211, 238, 0.04);
  border: 0.5px solid rgba(34, 211, 238, 0.1);
  border-radius: var(--radius-md);
}

.stat-cell-label {
  font-family: var(--font-heading);
  font-size: 0.625rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stat-cell-value {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--cyan-bright);
  font-weight: 500;
}

.stat-cell-mod {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-secondary);
}
```

### 5.10 Encounter Tracker

```css
.combatant-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-lg);
  border: 0.5px solid var(--border);
  background: var(--bg-surface);
  transition: all 0.2s ease;
}

.combatant-row.active {
  border-color: rgba(232, 131, 74, 0.3);
  background: var(--bg-raised);
  box-shadow: 0 0 16px var(--glow-orange);
}

.combatant-row.player {
  border-left: 2px solid var(--cyan);
}

.combatant-row.enemy {
  border-left: 2px solid var(--status-danger);
}

/* HP Bar */
.hp-bar {
  height: 5px;
  border-radius: 3px;
  background: var(--border);
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.hp-bar-fill.healthy {
  background: var(--status-success);
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.3);
}

.hp-bar-fill.wounded {
  background: var(--status-warning);
  box-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
}

.hp-bar-fill.critical {
  background: var(--status-danger);
  box-shadow: 0 0 6px rgba(248, 113, 113, 0.3);
}
```

### 5.11 Section Headers

```css
.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 0.5px solid var(--border);
}

.section-type-bar {
  width: 3px;
  height: 1rem;
  border-radius: 2px;
  flex-shrink: 0;
}

.section-type-bar.scene {
  background: var(--status-info);
}
.section-type-bar.encounter {
  background: var(--status-danger);
}
.section-type-bar.prose {
  background: var(--orange-dim);
}
.section-type-bar.npc {
  background: var(--purple);
}
```

### 5.12 Key Info Items

```css
.key-info-item {
  display: flex;
  gap: 0.6rem;
  margin: 0.4rem 0;
  align-items: flex-start;
}

.key-info-item::before {
  content: '◆';
  color: var(--orange); /* Changed from gold to orange */
  flex-shrink: 0;
  margin-top: 0.1rem;
  font-size: 0.75rem;
}
```

---

## 6. Animation & Motion

### Keyframes

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 0 8px var(--glow-cyan);
  }
  50% {
    box-shadow: 0 0 18px var(--glow-cyan);
  }
}
```

### Utility Classes

```css
.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

.glow-pulse {
  animation: glowPulse 3s ease-in-out infinite;
}
```

### Transition Durations

| Duration       | Use                                                     |
| -------------- | ------------------------------------------------------- |
| 0.15s ease     | Micro-interactions: hover color, border color           |
| 0.2s ease      | State changes: card expand, focus ring, active toggle   |
| 0.3s ease      | Entrances: page content fade-in, modal appearance       |
| 0.4s ease      | HP bar width changes                                    |
| 3s ease-in-out | Ambient: glow pulse on active combatant (infinite loop) |

### Rules

- All transitions use `ease`. Never `linear`, never `bounce`.
- Glow pulse only on: active combatant row, focused input (optional).
- Fade-in on: page content entering, lazy-loaded chapter content.
- **No glow or animation on static content.** Glows appear only in response to user action or to mark the currently active element.

---

## 7. Scrollbar

```css
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-base);
}
::-webkit-scrollbar-thumb {
  background: var(--border-accent);
  border-radius: 3px;
}
```

---

## 8. Complete CSS Variable Block

Drop-in replacement for the current `:root` block in `app/globals.css`:

```css
:root {
  /* Background hierarchy - midnight blues */
  --bg-deep: #060b18;
  --bg-base: #0a1020;
  --bg-surface: #101828;
  --bg-raised: #182030;
  --bg-hover: #1e2838;

  /* Borders */
  --border: #1e2838;
  --border-bright: #2a3648;
  --border-accent: #3a4a60;

  /* Text */
  --text-primary: #e0ecff;
  --text-secondary: #8090b0;
  --text-muted: #4a5a78;
  --text-accent: #e8834a;

  /* Brand palette */
  --orange: #e8834a;
  --orange-dim: #7a4a2a;
  --orange-bright: #f4a876;
  --purple: #8b5cf6;
  --purple-dim: #5a3db8;
  --purple-bright: #b794f6;
  --cyan: #22d3ee;
  --cyan-dim: #147a8a;
  --cyan-bright: #67e8f9;

  /* Sin colors */
  --sin-greed: #f39c12;
  --sin-lust: #9b59b6;
  --sin-sloth: #3498db;
  --sin-gluttony: #e67e22;
  --sin-envy: #2ecc71;
  --sin-wrath: #e74c3c;
  --sin-pride: #c8d6e5;

  /* Semantic status */
  --status-success: #34d399;
  --status-warning: #fbbf24;
  --status-danger: #f87171;
  --status-info: #60a5fa;

  /* Glow tokens (box-shadow only) */
  --glow-orange: rgba(232, 131, 74, 0.15);
  --glow-cyan: rgba(34, 211, 238, 0.08);
  --glow-purple: rgba(139, 92, 246, 0.1);
  --glow-success: rgba(52, 211, 153, 0.08);
  --glow-warning: rgba(251, 191, 36, 0.08);
  --glow-danger: rgba(248, 113, 113, 0.08);

  /* Typography */
  --font-display: 'Cinzel Decorative', serif;
  --font-heading: 'Cinzel', serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 0.75rem;
  --space-lg: 1rem;
  --space-xl: 1.5rem;
  --space-2xl: 2rem;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 999px;

  /* Layout */
  --sidebar-w: 240px;
}
```

---

## 9. Removed Variables (Migration Notes)

These old variables should be replaced during implementation:

| Old Variable    | Replacement                             |
| --------------- | --------------------------------------- |
| `--gold`        | `var(--orange)` or `var(--text-accent)` |
| `--gold-dim`    | `var(--orange-dim)`                     |
| `--gold-bright` | `var(--orange-bright)`                  |

The gold palette is fully replaced by orange. Any reference to `--gold` in component code, inline styles, or color maps (like `ALIGNMENT_COLORS`, `getAccentColor()`) should update to `--orange` or `--text-accent`.

---

## 10. Google Fonts Import (Updated)

Replace the current `@import` at line 1 of `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Change:** Added `Inter:wght@400;500;600`, removed `EB+Garamond`.

---

## 11. Icon Migration

Replace all unicode/emoji nav icons with Tabler Icons (`@tabler/icons-react`).

```bash
npm install @tabler/icons-react
```

| Current           | Replace With                 | Import                                               |
| ----------------- | ---------------------------- | ---------------------------------------------------- |
| `◈` (Chapters)    | `<IconBook size={16} />`     | `import { IconBook } from '@tabler/icons-react'`     |
| `◉` (NPCs)        | `<IconUsers size={16} />`    | `import { IconUsers } from '@tabler/icons-react'`    |
| `✦` (Reference)   | `<IconBooks size={16} />`    | `import { IconBooks } from '@tabler/icons-react'`    |
| `⚔` (Encounter)   | `<IconSwords size={16} />`   | `import { IconSwords } from '@tabler/icons-react'`   |
| `✎` (Session Log) | `<IconNotebook size={16} />` | `import { IconNotebook } from '@tabler/icons-react'` |

Also update the homepage quick link emojis (📖, 👥, ⚔️, 📝, 📚) to matching Tabler icons.

---

## 12. Global Styles (Updated)

```css
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg-deep);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem; /* 15px base */
  line-height: 1.65;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--text-accent); /* Orange heading color */
  line-height: 1.3;
}

h1 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  letter-spacing: 0.04em;
}

h2 {
  font-size: 1.25rem;
  letter-spacing: 0.04em;
}

h3 {
  font-size: 1rem;
  letter-spacing: 0.05em;
}

h4 {
  font-size: 0.875rem;
  letter-spacing: 0.06em;
}
```

---

## 13. Implementation Order

Suggested order for Claude Code to implement:

1. **CSS variables** - Replace `:root` block in `globals.css`
2. **Google Fonts import** - Swap the `@import` line
3. **Global styles** - Update body, heading, scrollbar styles
4. **Utility classes** - Update `.card`, `.badge`, `.btn-*`, `.search-input`, `.boxed-text`, `.dm-note`, `.section-header`, `.section-type-bar`, `.key-info-item`, `.combatant-row`, `.hp-bar`, `.chapter-tab`, `.nav-*` classes
5. **Sidebar component** - Update `Sidebar.tsx`: install `@tabler/icons-react`, replace unicode icons, update logo colors
6. **Homepage** - Update `page.tsx`: replace emoji icons, update inline styles referencing old colors
7. **NPC page** - Update `npcs/page.tsx`: update `ALIGNMENT_COLORS`, `STATUS_COLORS`, stat block inline styles
8. **Encounter page** - Update `encounter/page.tsx`: update inline styles
9. **Reference page** - Update `reference/page.tsx`: update inline styles
10. **Session Log page** - Update `session-log/page.tsx`: update inline styles
11. **Chapters page** - Update `chapters/page.tsx`: update inline styles

### Key Search-and-Replace Patterns

| Find                 | Replace                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `var(--gold)`        | `var(--orange)` or `var(--text-accent)`                                                  |
| `var(--gold-dim)`    | `var(--orange-dim)`                                                                      |
| `var(--gold-bright)` | `var(--orange-bright)`                                                                   |
| `'EB Garamond'`      | (Remove - no longer in font stack)                                                       |
| `#c9a96e`            | `#e8834a` (orange)                                                                       |
| `#7a6a55`            | `#7a4a2a` (orange-dim)                                                                   |
| `#e8c98a`            | `#f4a876` (orange-bright)                                                                |
| `#d4c5a9`            | `#e0ecff` (text-primary)                                                                 |
| `#9a8a70`            | `#8090b0` (text-secondary)                                                               |
| `#6a5a45`            | `#4a5a78` (text-muted)                                                                   |
| `#0d0a07`            | `#060b18` (bg-deep)                                                                      |
| `#100d09`            | `#0a1020` (bg-base)                                                                      |
| `#16120e`            | `#101828` (bg-surface)                                                                   |
| `#1e1810`            | `#182030` (bg-raised)                                                                    |
| `#2a2118`            | `#1e2838` (bg-hover / border)                                                            |
| `#27ae60`            | `var(--status-success)` or `#34d399`                                                     |
| `#c0392b`            | `var(--status-danger)` or `#f87171`                                                      |
| `#ecf0f1`            | `#c8d6e5` (sin-pride)                                                                    |
| `border-radius: 4px` | `border-radius: var(--radius-lg)` (for cards) or `var(--radius-md)` (for buttons/inputs) |

---

## 14. Design Principles Summary

1. **Midnight over black.** Backgrounds are deep blue, never warm brown-black.
2. **Glow is earned.** Only interactive/active elements get a glow. Static content stays flat.
3. **Orange is warmth.** The primary brand color represents action, story, and human connection.
4. **Cyan is wayfinding.** Navigation, player-affiliated elements, and focus states use cyan.
5. **Purple is mystery.** Arcane, magical, and sin-related elements use purple.
6. **Borders are whispers.** 0.5px default, never heavy. The 2px left accent is the loudest border in the system.
7. **Cinzel for authority, Inter for speed.** Serif headings slow you down to notice structure. Sans body text gets out of the way so you can read fast.
8. **Motion is dreamlike.** Nothing snaps. Everything eases. The interface glides.
