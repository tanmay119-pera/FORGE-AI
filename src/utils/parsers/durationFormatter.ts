export function formatEtaDuration(totalMins: number): string {
  if (totalMins < 60) return `${Math.max(1, Math.round(totalMins))} min`;
  const hrs = Math.floor(totalMins / 60);
  const mins = Math.round(totalMins % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
