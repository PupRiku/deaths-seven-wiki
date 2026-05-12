// Color helpers shared across pages that build opacity tints from hex values.

/**
 * Convert a hex color (#rgb or #rrggbb) and an alpha (0–1) into a CSS rgba() string.
 * Useful for tinting badge backgrounds/borders where the source color is a raw hex.
 *
 * For CSS-variable inputs (e.g. var(--cyan)), use the color-mix CSS helper instead —
 * rgbaFromHex parses character codes and silently corrupts when given a var().
 */
export function rgbaFromHex(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const expanded = h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h
  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
