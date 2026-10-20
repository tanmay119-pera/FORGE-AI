import React from "react";
export const MaskedKeyDisplay: React.FC<{ maskedValue: string }> = ({ maskedValue }) => (
  <code className="rounded bg-slate-900 px-2 py-1 text-xs text-slate-300">{maskedValue}</code>
);
