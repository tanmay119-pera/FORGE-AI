export function matchesShortcut(key: string, ctrlOrMeta: boolean, targetKey: string): boolean {
  return ctrlOrMeta && key.toLowerCase() === targetKey.toLowerCase();
}
export function formatShortcutLabel(isMac: boolean, letter: string): string {
  return isMac ? `Cmd+${letter.toUpperCase()}` : `Ctrl+${letter.toUpperCase()}`;
}
