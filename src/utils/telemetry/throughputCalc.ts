export function tokensPerSecond(tokenCount: number, durationMs: number): number {
  if (durationMs <= 0) return 0;
  return Number(((tokenCount * 1000) / durationMs).toFixed(2));
}
