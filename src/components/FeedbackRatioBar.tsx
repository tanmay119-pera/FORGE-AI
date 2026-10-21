import React from "react";
export const FeedbackRatioBar: React.FC<{ ratio: number }> = ({ ratio }) => (
  <div className="text-[11px] text-slate-400">Alignment: <span className="font-semibold text-emerald-300">{Math.round(ratio * 100)}%</span></div>
);
