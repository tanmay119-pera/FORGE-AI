export interface SubsystemHealth { name: string; ok: boolean; latencyMs: number; }
export function computeOverallHealth(subsystems: SubsystemHealth[]): "healthy" | "degraded" | "down" {
  if (subsystems.length === 0) return "healthy";
  const failing = subsystems.filter((s) => !s.ok).length;
  if (failing === 0) return "healthy";
  return failing === subsystems.length ? "down" : "degraded";
}
