import React from "react";
export const AgentBadge: React.FC<{ role: string }> = ({ role }) => (
  <span className="inline-flex items-center rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-200">{role}</span>
);
