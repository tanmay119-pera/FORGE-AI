import { MCPToolRegistry } from "./mcp/toolRegistry.ts";
import { LatencyHistogram } from "./telemetry/latencyHistogram.ts";

export interface DiagnosticsSnapshot {
  activeTools: number;
  latency: { count: number; p50: number; p95: number; p99: number };
}

export function buildDiagnosticsSnapshot(
  registry: MCPToolRegistry,
  histogram: LatencyHistogram
): DiagnosticsSnapshot {
  return {
    activeTools: registry.listActive().length,
    latency: histogram.summary(),
  };
}
