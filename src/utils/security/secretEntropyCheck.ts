export function looksLikeApiKey(text: string): boolean {
  return /\b(AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9]{16,})\b/.test(text);
}
