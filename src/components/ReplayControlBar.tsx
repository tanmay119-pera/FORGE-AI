import React from "react";
export const ReplayControlBar: React.FC<{ onReplay: () => void }> = ({ onReplay }) => (
  <button type="button" onClick={onReplay} className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-200 hover:bg-cyan-500/20">Replay Turn</button>
);
