import React from "react";
export const ShortcutHint: React.FC<{ keys: string }> = ({ keys }) => (
  <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">{keys}</kbd>
);
