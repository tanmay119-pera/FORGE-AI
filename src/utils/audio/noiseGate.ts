export function applyNoiseGate(
  samples: number[],
  threshold = 0.015,
  attenuation = 0.1
): number[] {
  return samples.map((val) => (Math.abs(val) < threshold ? val * attenuation : val));
}

export function normalizePeak(samples: number[], targetPeak = 0.9): number[] {
  let maxAbs = 0;
  for (const s of samples) {
    const a = Math.abs(s);
    if (a > maxAbs) maxAbs = a;
  }
  if (maxAbs === 0) return [...samples];
  const gain = targetPeak / maxAbs;
  return samples.map((s) => Number((s * gain).toFixed(6)));
}
