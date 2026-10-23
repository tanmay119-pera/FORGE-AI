export function statusColorToken(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("on time") || s === "healthy" || s === "completed") return "emerald";
  if (s.includes("delay") || s === "degraded") return "amber";
  return "slate";
}
