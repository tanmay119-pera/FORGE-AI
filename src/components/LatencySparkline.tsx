import React from "react";
export const LatencySparkline: React.FC<{ p50: number; p95: number }> = ({ p50, p95 }) => (
  <div className="rounded border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
    <span>p50: <strong>{p50}ms</strong></span> • <span>p95: <strong>{p95}ms</strong></span>
  </div>
);
