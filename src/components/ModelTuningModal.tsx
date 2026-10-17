import React, { useState } from 'react';
import { PromptTuningPreset, ThemeMode } from '../types';
import { Sliders, X, Check, Sparkles, Zap, Shield, RotateCcw } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { audioCueService } from '../services/audioCueService';

interface ModelTuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onPresetApplied?: (preset: PromptTuningPreset) => void;
}

const PRESET_LIBRARY: PromptTuningPreset[] = [
  {
    id: 'preset-executive',
    name: 'Executive Deterministic',
    temperature: 0.15,
    topP: 0.85,
    topK: 40,
    reasoningDepth: 'balanced',
    description: 'High-precision tool invocation with zero hallucinations and crisp verbal conciseness.'
  },
  {
    id: 'preset-balanced',
    name: 'Balanced Co-Pilot',
    temperature: 0.40,
    topP: 0.90,
    topK: 50,
    reasoningDepth: 'balanced',
    description: 'Natural conversational flow balanced with reliable structured MCP parameter binding.'
  },
  {
    id: 'preset-creative',
    name: 'Creative Concierge',
    temperature: 0.75,
    topP: 0.95,
    topK: 64,
    reasoningDepth: 'deep_chain',
    description: 'Expressive travel storytelling and proactive multi-tool diurnal planning.'
  }
];

export const ModelTuningModal: React.FC<ModelTuningModalProps> = ({
  isOpen,
  onClose,
  theme,
  onPresetApplied
}) => {
  const isDark = theme === 'dark';
  const initialPreset = geminiService.getTuningPreset();

  const [activePreset, setActivePreset] = useState<PromptTuningPreset>(initialPreset);
  const [temperature, setTemperature] = useState<number>(initialPreset.temperature);
  const [topP, setTopP] = useState<number>(initialPreset.topP);
  const [topK, setTopK] = useState<number>(initialPreset.topK);
  const [reasoningDepth, setReasoningDepth] = useState<'rapid' | 'balanced' | 'deep_chain'>(initialPreset.reasoningDepth);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (p: PromptTuningPreset) => {
    setActivePreset(p);
    setTemperature(p.temperature);
    setTopP(p.topP);
    setTopK(p.topK);
    setReasoningDepth(p.reasoningDepth);
    audioCueService.playActionSuccess();
  };

  const handleSave = () => {
    const updated: PromptTuningPreset = {
      id: activePreset.id || 'custom',
      name: activePreset.name || 'Custom Preset',
      temperature,
      topP,
      topK,
      reasoningDepth,
      description: activePreset.description || 'Custom hyperparameter profile'
    };

    geminiService.setTuningPreset(updated);
    audioCueService.playActionSuccess();
    setSaveSuccess(true);
    onPresetApplied?.(updated);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    handleSelectPreset(PRESET_LIBRARY[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div 
        className={`w-full max-w-lg rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${
          isDark 
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">AI Model Hyperparameter Tuning</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Fine-tune Gemini 2.0 Flash inference profile & sampling parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-zinc-400">
              Cognitive Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_LIBRARY.map((preset) => {
                const isSelected = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 text-purple-300 font-semibold shadow-sm'
                        : isDark
                          ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-300'
                          : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="font-mono text-[10px] mt-2 opacity-75">T={preset.temperature}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Temperature (Randomness vs Precision)
              </span>
              <span className="font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                {temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>0.0 (Deterministic)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Top-P Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Top-P (Nucleus Sampling)
              </span>
              <span className="font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                {topP.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Reasoning Depth Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400">
              Reasoning Depth & Speed
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['rapid', 'balanced', 'deep_chain'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setReasoningDepth(mode)}
                  className={`p-2.5 rounded-xl border text-center transition-all capitalize font-medium ${
                    reasoningDepth === mode
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : isDark
                        ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400'
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-600'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-5 border-t flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50'}`}>
          <button
            onClick={handleReset}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Applied!
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Save & Apply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
