import React from "react";
export const ActionPreviewStrip: React.FC<{ label: string; eta: string }> = ({ label, eta }) => (
  <div className="flex items-center justify-between rounded-md bg-slate-800/80 px-3 py-1.5 text-xs text-slate-200">
    <span>{label}</span>
    <span className="font-mono text-cyan-300">{eta}</span>
  </div>
);
