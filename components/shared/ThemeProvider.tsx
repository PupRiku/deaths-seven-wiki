// Placeholder for future role-based theming. Today this just passes children
// through; once the player JRPG visual treatment lands it can override CSS
// variables on its mounted subtree.
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
