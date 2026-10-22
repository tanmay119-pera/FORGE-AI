export function clampedJitterMs(baseMs: number, factor = 0.5, variance = 0.2): number {
  const delta = baseMs * variance * (factor * 2 - 1);
  return Math.max(1, Math.round(baseMs + delta));
}
