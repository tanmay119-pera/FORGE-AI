export function extractTrainNumber(text: string): string | null {
  const m = text.match(/\b(\d{5})\b/);
  return m ? m[1] : null;
}
export function formatCoachSeat(coach: string, berth: number): string {
  return `${coach.trim().toUpperCase()}-${berth}`;
}
