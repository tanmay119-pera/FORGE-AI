export function enforceMaxTranscriptChars(text: string, maxChars = 4000): { ok: boolean; truncated: string } {
  if (text.length <= maxChars) return { ok: true, truncated: text };
  return { ok: false, truncated: text.slice(0, maxChars) };
}
