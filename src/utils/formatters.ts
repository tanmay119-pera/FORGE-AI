export function formatTimestampIso(ms: number): string {
  return new Date(ms).toISOString();
}
export function clampNumber(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}
