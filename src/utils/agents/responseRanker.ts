export function scoreCandidateResponse(text: string, hasStructuredAction: boolean): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lengthScore = words >= 4 && words <= 60 ? 0.6 : 0.3;
  return Number((lengthScore + (hasStructuredAction ? 0.4 : 0)).toFixed(2));
}
