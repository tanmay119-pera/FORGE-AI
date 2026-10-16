import React from "react";
export const HealthStatusPill: React.FC<{ status: "healthy" | "degraded" | "down" }> = ({ status }) => (
  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300">{status}</span>
);
