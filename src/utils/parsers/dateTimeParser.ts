export function parseRelativeMinutes(utterance: string): number | null {
  const m = utterance.toLowerCase().match(/in\s+(\d+)\s*(min|minute|minutes|hr|hour|hours)/);
  if (!m) return null;
  const val = Number(m[1]);
  return m[2].startsWith("hr") || m[2].startsWith("hour") ? val * 60 : val;
}
