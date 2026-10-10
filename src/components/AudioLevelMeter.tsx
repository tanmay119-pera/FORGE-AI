import React from "react";

interface AudioLevelMeterProps {
  rmsLevel: number;
  isSpeech: boolean;
}

export const AudioLevelMeter: React.FC<AudioLevelMeterProps> = ({ rmsLevel, isSpeech }) => {
  const pct = Math.min(100, Math.round(rmsLevel * 100));
  return (
    <div className="flex items-center gap-2 text-xs text-slate-300" aria-label="Microphone Input Level">
      <span className={`h-2 w-2 rounded-full ${isSpeech ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full bg-cyan-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-nums">{pct}%</span>
    </div>
  );
};
