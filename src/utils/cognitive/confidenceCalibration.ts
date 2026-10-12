export function calibrateConfidence(rawScore: number, toolMatchCount: number): number {
  const clamped = Math.max(0, Math.min(1, rawScore));
  const bonus = Math.min(0.15, toolMatchCount * 0.05);
  return Number(Math.min(1, clamped + bonus).toFixed(4));
}
