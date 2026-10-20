import React from "react";
export const SecurityShieldBadge: React.FC<{ protectedMode: boolean }> = ({ protectedMode }) => (
  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">{protectedMode ? "PII Guard Active" : "Standard"}</span>
);
