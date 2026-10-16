export type ErrorCategory = "network" | "auth" | "quota" | "validation" | "unknown";
export function categorizeError(err: unknown): ErrorCategory {
  const msg = String(err instanceof Error ? err.message : err).toLowerCase();
  if (msg.includes("401") || msg.includes("403") || msg.includes("unauthorized")) return "auth";
  if (msg.includes("429") || msg.includes("quota") || msg.includes("rate")) return "quota";
  if (msg.includes("network") || msg.includes("timeout") || msg.includes("fetch")) return "network";
  if (msg.includes("invalid") || msg.includes("required")) return "validation";
  return "unknown";
}
