# Death's Seven Wiki - Visual Redesign Implementation Guide

## Context

This document supplements the main `CLAUDE.md` with instructions for implementing the visual redesign defined in `VISUAL_LANGUAGE.md`. The redesign shifts the aesthetic from dark fantasy (gold-on-black, parchment tones) to a Kingdom Hearts-inspired style (soft glows on midnight blue, warm-cool color tension).

## The Spec

Read `VISUAL_LANGUAGE.md` thoroughly before making any changes. It is the authoritative source for all color values, typography, component patterns, and implementation order.

## Critical Rules

1. **No light theme.** This is a dark-only application.
2. **No EB Garamond.** The body font is now Inter. Remove all references.
3. **No gold.** Every `--gold` reference becomes `--orange` or `--text-accent`. No exceptions.
4. **Glows are box-shadows only.** Never use CSS `filter: blur()` or `text-shadow` for glow effects. Always `box-shadow` with the appropriate `--glow-*` token.
5. **Glow only on interactive/active states.** Static cards, static text, and inactive elements get zero glow.
6. **0.5px borders by default.** The only 2px border is the left accent on cards, boxed-text, dm-notes, and nav-item.active.
7. **Cinzel minimum size is 11px (0.6875rem).** Anything smaller uses Inter.
8. **border-radius: 0 on elements with single-sided borders.** Cards with `border-left: 2px` get `border-radius` on the right side only if needed, or more simply, use `border-radius: var(--radius-lg)` since the left border is thin enough to look fine with uniform radius at 8px.

## Implementation Order

Follow this exact order. Each step should be a separate commit.

### Step 1: CSS Foundation

- Replace the `:root` block in `app/globals.css` with the complete variable block from Section 8 of the spec
- Replace the `@import` Google Fonts URL (add Inter, remove EB Garamond)
- Update global `body`, `h1-h6`, and scrollbar styles per Section 12

### Step 2: Utility Classes

- Update all CSS utility classes (`.card`, `.badge`, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.search-input`, `.boxed-text`, `.dm-note`, `.dm-note-label`, `.dm-note p`, `.section-header`, `.section-type-bar.*`, `.key-info-item`, `.combatant-row`, `.hp-bar`, `.hp-bar-fill.*`, `.chapter-tab`, `.nav-*`, `.fade-in`)
- Add new animation keyframes (`glowPulse`) and utility class (`.glow-pulse`)
- Spec Sections 5.1 through 5.12 and Section 6 define all of these

### Step 3: Sidebar Component

- `npm install @tabler/icons-react`
- Update `components/ui/Sidebar.tsx`:
  - Import Tabler icon components (`IconBook`, `IconUsers`, `IconBooks`, `IconSwords`, `IconNotebook`)
  - Replace the `icon` string field in NAV with a React component reference
  - Render `<IconName size={16} />` instead of `<span className="nav-item-icon">`
  - Update the logo subtitle and footer section colors

### Step 4: Homepage

- Update `app/page.tsx`:
  - Replace emoji quick-link icons with Tabler icons
  - Update all inline `style` objects: replace gold references with orange, old bg colors with new ones
  - Update the Seven Sins tracker inline styles
  - Update the Party section inline styles (cyan accents stay)

### Step 5: NPC Page

- Update `app/npcs/page.tsx`:
  - Update `ALIGNMENT_COLORS`: replace `var(--gold)` with `var(--orange)` for Neutral
  - Update `STATUS_COLORS`: replace `#27ae60` with `var(--status-success)`, `#c0392b` with `var(--status-danger)`, `var(--gold-dim)` with `var(--orange-dim)`, `var(--purple)` remains
  - Update `StatBlock` component inline styles: `#0f0c09` becomes `var(--bg-base)`, accent border patterns use new opacity format
  - Update `StatRow` component: label color to `var(--text-muted)`, value color to `var(--text-primary)`, mod color to `var(--text-secondary)`
  - Update the NPC card rendering, filter bar, alignment badge colors
  - Stat values in the 6-column grid should use `var(--cyan-bright)` for the number, not `var(--text-primary)` - this is the FF-influenced "mechanical data feels different" principle

### Step 6: Encounter Page

- Update `app/encounter/page.tsx`:
  - All inline styles referencing old colors
  - The active combatant should get `box-shadow: 0 0 16px var(--glow-orange)` instead of the old `#c9a96e22`
  - HP bar fill colors: `#27ae60` to `var(--status-success)`, `#f39c12` to `var(--status-warning)`, `#c0392b` to `var(--status-danger)`
  - Add `box-shadow` glow to HP bar fills per spec (Section 5.10)

### Step 7: Reference Page

- Update `app/reference/page.tsx`: inline style color references

### Step 8: Session Log Page

- Update `app/session-log/page.tsx`: inline style color references

### Step 9: Chapters Page

- Update `app/chapters/page.tsx`: inline style color references, chapter tab styles

## Testing Checklist

After implementation, verify:

- [ ] Body background is midnight blue (#060b18), not warm black
- [ ] All text is readable (primary text is cool white-blue, not warm parchment)
- [ ] Orange (#e8834a) appears on: heading accents, primary buttons, active chapter tabs, key-info bullets, boxed-text borders, logo title
- [ ] Cyan (#22d3ee) appears on: active nav item, default card left border, player combatant border, stat cell values, search focus glow
- [ ] Purple (#8b5cf6) appears on: arcane/magical elements, complex alignment badge, Lust sin color
- [ ] No gold (#c9a96e) appears anywhere
- [ ] No EB Garamond font appears anywhere
- [ ] Hover glow appears on: primary button hover, card hover, active combatant row
- [ ] Static content has no glow effects
- [ ] HP bars have subtle color-matched glow
- [ ] Cinzel is used for headings, nav labels, badges, buttons (never below 11px)
- [ ] Inter is used for body text, descriptions, form inputs, small labels
- [ ] All sin colors render correctly on the midnight blue backgrounds
- [ ] Mobile responsive behavior still works (sidebar collapse)
