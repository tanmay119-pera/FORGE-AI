export function computeBackoffDelay(attempt: number, baseMs = 100, capMs = 5000): number {
  return Math.min(capMs, baseMs * (2 ** Math.max(0, attempt)));
}
