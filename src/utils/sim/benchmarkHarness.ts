export function measureSyncOps(fn: () => void, iterations = 1000): { iterations: number; totalMs: number; avgUs: number } {
  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const totalMs = Math.max(0.001, performance.now() - t0);
  return { iterations, totalMs: Number(totalMs.toFixed(3)), avgUs: Number(((totalMs * 1000) / iterations).toFixed(3)) };
}
