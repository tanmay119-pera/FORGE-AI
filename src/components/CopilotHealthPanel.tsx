import React from "react";
import { MCPStatsBadge } from "./MCPStatsBadge";
import { LatencySparkline } from "./LatencySparkline";
import { SecurityShieldBadge } from "./SecurityShieldBadge";

interface CopilotHealthPanelProps {
  toolCount: number;
  avgLatencyMs: number;
  p50Ms: number;
  p95Ms: number;
}

export const CopilotHealthPanel: React.FC<CopilotHealthPanelProps> = ({
  toolCount,
  avgLatencyMs,
  p50Ms,
  p95Ms,
}) => (
  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
    <MCPStatsBadge toolCount={toolCount} avgLatencyMs={avgLatencyMs} />
    <LatencySparkline p50={p50Ms} p95={p95Ms} />
    <SecurityShieldBadge protectedMode={true} />
  </div>
);
