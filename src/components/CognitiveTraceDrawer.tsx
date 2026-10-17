import React from 'react';
import { ReasoningTrace, ThemeMode } from '../types';
import { Brain, X, CheckCircle2, Clock, Zap, Target, Database, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface CognitiveTraceDrawerProps {
  trace: ReasoningTrace | null;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const CognitiveTraceDrawer: React.FC<CognitiveTraceDrawerProps> = ({
  trace,
  isOpen,
  onClose,
  theme
}) => {
  if (!isOpen || !trace) return null;

  const isDark = theme === 'dark';

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'intent_classification':
        return <Target className="w-4 h-4 text-emerald-400" />;
      case 'entity_extraction':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'memory_retrieval':
        return <Database className="w-4 h-4 text-purple-400" />;
      case 'few_shot_matching':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'tool_selection':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'safety_evaluation':
        return <ShieldCheck className="w-4 h-4 text-green-400" />;
      case 'response_synthesis':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Brain className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div 
        className={`w-full max-w-xl h-full shadow-2xl flex flex-col transition-transform transform ${
          isDark 
            ? 'bg-zinc-950/95 border-l border-zinc-800 text-zinc-100' 
            : 'bg-white/95 border-l border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-200/80 bg-zinc-50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Cognitive Reasoning Trace</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Step-by-step LLM explainability & intent verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
            }`}
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Summary Banner */}
        <div className={`p-5 border-b ${isDark ? 'border-zinc-800/60 bg-zinc-900/20' : 'border-zinc-200 bg-zinc-50/50'}`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Input Query</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              Model: {trace.selectedModel.toUpperCase()}
            </span>
          </div>
          <p className="text-sm font-medium italic mb-3">
            &ldquo;{trace.query}&rdquo;
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-white border-zinc-200'}`}>
              <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Latency</div>
              <div className="font-semibold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                {trace.totalLatencyMs} ms
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-white border-zinc-200'}`}>
              <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Confidence</div>
              <div className="font-semibold text-cyan-400 mt-0.5">
                {Math.round(trace.overallConfidence * 100)}%
              </div>
            </div>
            <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-white border-zinc-200'}`}>
              <div className={`text-[10px] uppercase font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Target Tool</div>
              <div className="font-mono font-medium text-purple-400 mt-0.5 truncate px-1">
                {trace.primaryIntent}
              </div>
            </div>
          </div>
        </div>

        {/* Step Breakdown */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Cognitive Trajectory ({trace.steps.length} Steps)
            </h3>
            <span className="text-[11px] text-zinc-500">
              Evaluated at {trace.timestamp}
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
            {trace.steps.map((st, idx) => (
              <div 
                key={idx}
                className={`relative rounded-xl border p-4 transition-all ${
                  isDark 
                    ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {/* Step Marker Dot */}
                <div className={`absolute -left-[31px] top-4 w-5 h-5 rounded-full border flex items-center justify-center ${
                  isDark 
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-300' 
                    : 'bg-white border-zinc-300 text-zinc-700'
                }`}>
                  <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {getStepIcon(st.step)}
                    <span className="text-xs font-semibold tracking-tight">{st.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {st.tokensUsed && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
                      }`}>
                        {st.tokensUsed} tokens
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-zinc-400">
                      {st.durationMs}ms
                    </span>
                  </div>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {st.detail}
                </p>

                {/* Confidence Bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                      style={{ width: `${Math.round(st.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-medium">
                    {Math.round(st.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center text-xs ${isDark ? 'border-zinc-800 bg-zinc-900/20 text-zinc-500' : 'border-zinc-200 bg-zinc-50 text-zinc-500'}`}>
          Forge Cognitive Engine v2.4 • Dynamic Few-Shot Grounded Inference
        </div>
      </div>
    </div>
  );
};
