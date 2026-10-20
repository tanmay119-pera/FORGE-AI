export function maskSecretToken(token: string, visibleTail = 4): string {
  const t = token.trim();
  if (t.length <= visibleTail) return "*".repeat(t.length);
  return `${"*".repeat(Math.min(12, t.length - visibleTail))}${t.slice(-visibleTail)}`;
}
