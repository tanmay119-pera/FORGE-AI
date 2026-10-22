import React from "react";
import type { VoiceState } from "../types";
export const VoiceStateTag: React.FC<{ state: VoiceState }> = ({ state }) => (
  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] uppercase text-cyan-300">{state}</span>
);
