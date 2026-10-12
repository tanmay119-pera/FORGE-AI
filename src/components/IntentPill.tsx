import React from "react";
import type { CopilotIntent } from "../utils/cognitive/intentRouter";

export const IntentPill: React.FC<{ intent: CopilotIntent }> = ({ intent }) => (
  <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-indigo-200">
    {intent.replace("_", " ")}
  </span>
);
