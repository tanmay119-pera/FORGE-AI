import React, { useState } from 'react';
import { VoiceState, ThemeMode } from '../types';
import { Mic, Square, Loader2, Radio, ArrowUp, Send, Keyboard } from 'lucide-react';

interface VoiceControllerProps {
  voiceState: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onTextSubmit: (text: string) => void;
  transcript: string;
  assistantSpeech: string;
  theme: ThemeMode;
  agoraConnected: boolean;
  onToggleAgora: () => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  voiceState,
  onStartListening,
  onStopListening,
  onTextSubmit,
  transcript,
  assistantSpeech,
  theme,
  agoraConnected,
  onToggleAgora
}) => {
  const isPureBlack = theme === 'dark';
  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';
  const isThinking = voiceState === 'thinking';
  const isExecuting = voiceState === 'executing';

  const [inputText, setInputText] = useState('');

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isThinking || isExecuting) return;
    onTextSubmit(query);
    setInputText('');
  };

  const getStateText = () => {
    switch (voiceState) {
      case 'listening':
        return 'Listening to voice...';
      case 'thinking':
        return 'Planning actions...';
      case 'executing':
        return 'Executing MCP tool...';
      case 'speaking':
        return 'Speaking...';
      default:
        return 'Speak or Type';
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      
      {/* State status indicator */}
      <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
        <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
        <span>{getStateText()}</span>
      </div>

      {/* Primary Glowing Mic Button */}
      <div className="relative group my-1">
        <div
          className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-500 ${
            isListening || isSpeaking
              ? 'bg-violet-600/50 scale-125'
              : 'bg-violet-600/20 group-hover:bg-violet-600/35'
          }`}
        />

        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 transform active:scale-95 shadow-xl ${
            isListening
              ? 'bg-violet-500 text-white ring-4 ring-violet-400/40 animate-pulse'
              : isSpeaking
                ? 'bg-violet-600 text-white ring-4 ring-violet-300/40'
                : isThinking || isExecuting
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-400/40'
                  : isPureBlack
                    ? 'bg-[#121212] text-violet-400 hover:text-white hover:bg-violet-600'
                    : 'bg-white text-violet-600 hover:bg-violet-600 hover:text-white shadow-md'
          }`}
        >
          {isListening ? (
            <Square className="w-7 h-7 fill-current" />
          ) : isThinking || isExecuting ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
      </div>

      <p className="text-xs text-neutral-400 font-medium">
        {isListening ? 'Tap to finish speech' : 'Tap mic to talk, or type below'}
      </p>

      {/* NEW: Text Input Option (For anyone who prefers typing) */}
      <form
        onSubmit={handleSendText}
        className={`w-full max-w-xl p-1.5 rounded-2xl flex items-center gap-2 transition-all ${
          isPureBlack ? 'bg-[#121212]' : 'bg-[#f4f4f6]'
        }`}
      >
        <div className="pl-3 text-neutral-400">
          <Keyboard className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a command (e.g. Book a cab, check train delay)..."
          disabled={isThinking || isExecuting}
          className={`flex-1 bg-transparent px-2 py-2 text-xs focus:outline-none ${
            isPureBlack ? 'text-white placeholder:text-neutral-500' : 'text-black placeholder:text-neutral-400'
          }`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking || isExecuting}
          className={`p-2 rounded-xl transition-all ${
            inputText.trim() && !isThinking && !isExecuting
              ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/25'
              : 'text-neutral-500 cursor-not-allowed'
          }`}
          title="Send Command"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>

      {/* Live Conversation Stream */}
      <div className={`w-full max-w-xl p-4 rounded-2xl text-left transition-all ${
        isPureBlack ? 'bg-[#0e0e0e]' : 'bg-[#f7f7f8]'
      }`}>
        <div className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-2 flex items-center justify-between">
          <span>Interaction Stream</span>
          {agoraConnected && (
            <span className="text-emerald-500 font-mono text-[9px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Voice
            </span>
          )}
        </div>

        {transcript && (
          <div className="mb-2">
            <span className="text-[11px] font-bold text-violet-400 block">Input</span>
            <p className={`text-sm italic font-medium ${isPureBlack ? 'text-[#f5f5f5]' : 'text-[#171717]'}`}>
              "{transcript}"
            </p>
          </div>
        )}

        {assistantSpeech ? (
          <div>
            <span className="text-[11px] font-bold text-violet-400 block">Forge</span>
            <p className={`text-sm font-medium ${isPureBlack ? 'text-[#ededed]' : 'text-[#171717]'}`}>
              {assistantSpeech}
            </p>
          </div>
        ) : !transcript ? (
          <p className="text-xs text-neutral-400 italic">
            Say or type: "Book a cab to Central Station for the 6 PM train" or tap any quick suggestion.
          </p>
        ) : null}
      </div>

      {/* Voice Channel Toggle */}
      <button
        onClick={onToggleAgora}
        className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
          agoraConnected
            ? isPureBlack ? 'bg-[#1a0a0a] text-red-400 hover:bg-[#2a1010]' : 'bg-red-50 text-red-700 hover:bg-red-100'
            : isPureBlack ? 'bg-[#140e24] text-violet-300 hover:bg-[#1f1538]' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
        }`}
      >
        <Radio className={`w-3.5 h-3.5 ${agoraConnected ? 'animate-pulse text-red-500' : 'text-violet-400'}`} />
        <span>{agoraConnected ? 'Leave Voice Channel' : 'Join Voice Channel'}</span>
      </button>

    </div>
  );
};
