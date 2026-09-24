import React from 'react';
import { VoiceState, ThemeMode, AgoraConfig, ToolCallExecution } from '../types';
import { ThreeOrb } from './ThreeOrb';
import { VoiceController } from './VoiceController';
import { SuggestedPrompts } from './SuggestedPrompts';
import { ActionDashboard } from './ActionDashboard';
import { Sparkles, Terminal, Cpu, Radio, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { MCP_TOOLS } from '../services/mcpTools';

interface VoiceStudioProps {
  voiceState: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onTextSubmit: (text: string) => void;
  transcript: string;
  assistantSpeech: string;
  theme: ThemeMode;
  agoraConnected: boolean;
  onToggleAgora: () => void;
  audioVolume: number;
  executions: ToolCallExecution[];
  onClearExecutions: () => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  voiceState,
  onStartListening,
  onStopListening,
  onTextSubmit,
  transcript,
  assistantSpeech,
  theme,
  agoraConnected,
  onToggleAgora,
  audioVolume,
  executions,
  onClearExecutions
}) => {
  const isPureBlack = theme === 'dark';

  return (
    <section id="studio" className="space-y-10 pt-4">
      
      {/* 1. Hero Headline (Enterprise SaaS style matching ZEGOCLOUD) */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-600/10 text-violet-400 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Voice AI Engine • Built by Tanmay (Adesh Srivastava)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Next-Gen Conversational Voice AI <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            With Real MCP Tool Calling
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Go beyond conventional chat. An autonomous voice co-pilot that listens over Agora SD-RTN real-time channels, reasons via Gemini 3.6 Flash, and triggers verified real-world actions using the Model Context Protocol.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-neutral-400">
          <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
            ⚡ &lt;25ms Audio Latency
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
            🛠️ Model Context Protocol (MCP)
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
            🤖 Gemini 3.6 Flash Native Tools
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
            🎙️ Hardware Echo Cancellation
          </span>
        </div>
      </div>

      {/* 2. Interactive Studio Playground Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Voice Console (5 cols) */}
        <div className={`lg:col-span-5 p-6 rounded-3xl transition-all ${
          isPureBlack ? 'bg-[#0d0d0d]' : 'bg-[#f7f7f9] shadow-sm'
        }`}>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Live Voice Studio
            </span>
            <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
              Full-Duplex RTC
            </span>
          </div>

          {/* Clean Fluid Violet Voice Orb */}
          <ThreeOrb
            voiceState={voiceState}
            volume={audioVolume}
            theme={theme}
          />

          {/* Voice & Type Input Controller */}
          <div className="mt-2">
            <VoiceController
              voiceState={voiceState}
              onStartListening={onStartListening}
              onStopListening={onStopListening}
              onTextSubmit={onTextSubmit}
              transcript={transcript}
              assistantSpeech={assistantSpeech}
              theme={theme}
              agoraConnected={agoraConnected}
              onToggleAgora={onToggleAgora}
            />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="mt-5 pt-4 border-t border-neutral-800/40">
            <SuggestedPrompts
              onSelectPrompt={onTextSubmit}
              theme={theme}
            />
          </div>
        </div>

        {/* Right Column: Active MCP Tool Registry & Execution Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* MCP Tool Registry Box */}
          <div className={`p-6 rounded-3xl transition-all ${
            isPureBlack ? 'bg-[#0d0d0d]' : 'bg-[#f7f7f9] shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Active MCP Tool Registry</h3>
                <p className="text-xs text-neutral-400">Connected tools available for real-time model invocation</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-violet-400">
                4 Tools Mounted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {MCP_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className={`p-3.5 rounded-2xl text-xs space-y-1.5 transition-colors ${
                    isPureBlack ? 'bg-[#141414] hover:bg-[#1a1a1a]' : 'bg-white hover:bg-neutral-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-violet-400">{tool.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400">
                      Mounted
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Action Cards Stream (Rendered side-effects when tools are invoked) */}
          {executions.length > 0 ? (
            <div className="space-y-4">
              <ActionDashboard
                executions={executions}
                theme={theme}
                onClear={onClearExecutions}
              />
            </div>
          ) : (
            <div className={`p-8 rounded-3xl text-center transition-all ${
              isPureBlack ? 'bg-[#0d0d0d] text-neutral-400' : 'bg-[#f7f7f9] text-neutral-500'
            }`}>
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-violet-600/15 text-violet-400 font-bold">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-white">Studio Action Deck Ready</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Speak or type a command like "Book a cab to Central Station for the 6 PM train" to watch Forge orchestrate MCP tools live on screen.
              </p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
