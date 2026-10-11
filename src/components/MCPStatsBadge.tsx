import React from "react";

interface MCPStatsBadgeProps {
  toolCount: number;
  avgLatencyMs: number;
}

export const MCPStatsBadge: React.FC<MCPStatsBadgeProps> = ({ toolCount, avgLatencyMs }) => (
  <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-slate-900/70 px-3 py-1 text-xs text-cyan-200">
    <span className="font-semibold">{toolCount} MCP Tools</span>
    <span className="text-slate-400">•</span>
    <span className="tabular-nums">{avgLatencyMs}ms avg</span>
  </div>
);
