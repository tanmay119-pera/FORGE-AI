import React, { useState, useRef, useEffect } from 'react';
import { VoiceState, ThemeMode, ToolCallExecution } from '../types';
import { ThreeOrb } from './ThreeOrb';
import { Mic, Square, Loader2, ArrowUp, Sparkles, Car, Train, Calendar, ShoppingBag, Volume2, CheckCircle2, MapPin, Clock, ChevronDown, Plus, RotateCcw, Flame, Check, Zap, Gauge } from 'lucide-react';
import { UserProfile } from './AuthModal';
import { ForgeIcon } from './ForgeIcon';

interface Message {
  id: string;
  sender: 'user' | 'forge';
  text: string;
  time: string;
  execution?: ToolCallExecution;
}

interface UserExperienceWindowProps {
  voiceState: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onTextSubmit: (text: string) => void;
  transcript: string;
  assistantSpeech: string;
  theme: ThemeMode;
  audioVolume: number;
  currentUser: UserProfile | null;
  executions: ToolCallExecution[];
}

export const UserExperienceWindow: React.FC<UserExperienceWindowProps> = ({
  voiceState,
  onStartListening,
  onStopListening,
  onTextSubmit,
  transcript,
  assistantSpeech,
  theme,
  audioVolume,
  currentUser,
  executions
}) => {
  const isPureBlack = theme === 'dark';
  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking';
  const isThinking = voiceState === 'thinking';
  const isExecuting = voiceState === 'executing';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasChatStarted = messages.length > 0;

  // Model & Efficiency selection
  type ModelType = 'p1' | 'p2';
  type EfficiencyLevel = 'low' | 'medium' | 'high';

  const [selectedModel, setSelectedModel] = useState<ModelType>('p1');
  const [efficiency, setEfficiency] = useState<EfficiencyLevel>('medium');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isComposerDropdownOpen, setIsComposerDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const composerDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (composerDropdownRef.current && !composerDropdownRef.current.contains(e.target as Node)) {
        setIsComposerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderModelDropdown = (onClose: () => void) => (
    <div className="absolute left-0 bottom-full mb-2.5 w-72 sm:w-80 rounded-2xl bg-[#161616] border border-neutral-700/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-neutral-800 flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
        <span>Select Model</span>
        <span className="text-[10px] text-violet-400 font-semibold">Autonomous AI</span>
      </div>

      {/* Model Options */}
      <div className="p-2 space-y-1.5">
        {/* Forge P1 */}
        <button
          type="button"
          onClick={() => {
            setSelectedModel('p1');
            onClose();
          }}
          className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-all text-left ${
            selectedModel === 'p1'
              ? 'bg-[#222222] border border-violet-500/40 text-white'
              : 'hover:bg-[#1c1c1c] border border-transparent text-neutral-300'
          }`}
        >
          <div className={`p-2 rounded-lg mt-0.5 ${
            selectedModel === 'p1' ? 'bg-violet-600/30 text-violet-400' : 'bg-neutral-800 text-neutral-400'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-white">Forge P1</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                Normal Work
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              Fast, everyday tasks & sub-25ms autonomous voice response.
            </p>
          </div>
          {selectedModel === 'p1' && (
            <Check className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
          )}
        </button>

        {/* Forge P2 */}
        <button
          type="button"
          onClick={() => {
            setSelectedModel('p2');
            onClose();
          }}
          className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-all text-left ${
            selectedModel === 'p2'
              ? 'bg-[#222222] border border-amber-500/40 text-white'
              : 'hover:bg-[#1c1c1c] border border-transparent text-neutral-300'
          }`}
        >
          <div className={`p-2 rounded-lg mt-0.5 ${
            selectedModel === 'p2' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'
          }`}>
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-white">Forge P2</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Extreme Work
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              Deep reasoning, complex multi-step MCP execution & extreme planning.
            </p>
          </div>
          {selectedModel === 'p2' && (
            <Check className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
          )}
        </button>
      </div>

      {/* Efficiency Section */}
      <div className="p-3 border-t border-neutral-800 bg-[#121212]">
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-2 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-violet-400" />
            <span>Efficiency</span>
          </span>
          <span className="text-[10px] text-violet-300 capitalize font-semibold">{efficiency} Mode</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#1a1a1a] border border-neutral-800">
          {(['low', 'medium', 'high'] as EfficiencyLevel[]).map((level) => {
            const isSelected = efficiency === level;
            const labels = {
              low: { name: 'Low', desc: 'Fastest' },
              medium: { name: 'Medium', desc: 'Balanced' },
              high: { name: 'High', desc: 'Max Depth' },
            };
            return (
              <button
                key={level}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEfficiency(level);
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                <span className="text-[11px] font-bold">{labels[level].name}</span>
                <span className={`text-[9px] ${isSelected ? 'text-violet-200' : 'text-neutral-500'}`}>
                  {labels[level].desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantSpeech, transcript]);

  // Sync assistant speech into conversation
  useEffect(() => {
    if (assistantSpeech) {
      const latestExecution = executions[0];
      setMessages(prev => {
        if (prev[prev.length - 1]?.text === assistantSpeech) return prev;
        return [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'forge',
            text: assistantSpeech,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            execution: latestExecution
          }
        ];
      });
    }
  }, [assistantSpeech, executions]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim();
    if (!query || isThinking || isExecuting) return;

    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: query,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    onTextSubmit(query);
    setInputText('');
  };

  const handleQuickChip = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    onTextSubmit(text);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputText('');
  };

  // Quick Action Pills directly matching Screenshot style
  const quickPills = [
    { label: 'Talk with Forge', action: 'voice', prompt: '' },
    { label: 'Research', action: 'prompt', prompt: 'Research the price of Apple 30W Fast Charger across Blinkit' },
    { label: 'Cab Dispatch', action: 'prompt', prompt: 'Book an Uber Premier to Central Station for the 6 PM train' },
    { label: 'Live Trains', action: 'prompt', prompt: 'Check Vande Bharat Express live train status and platform' },
    { label: 'Calendar Sync', action: 'prompt', prompt: 'Schedule boarding reminder on Google Calendar at 6:15 PM' },
    { label: 'More', action: 'prompt', prompt: 'What autonomous tools and actions can Forge execute?' }
  ];

  // ==========================================
  // VIEW 1: HERO HOME VIEW (Before any message is sent)
  // ==========================================
  if (!hasChatStarted) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-300">
        
        {/* 1. Header (Matching Screenshot 'What can I help with?') */}
        <div className="text-center space-y-2 pt-2 pb-1 select-none">
          <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
            isPureBlack ? 'text-white' : 'text-neutral-900'
          }`}>
            What can I help with?
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${
            isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Powered by <strong className={isPureBlack ? 'text-violet-400 font-bold' : 'text-violet-700 font-bold'}>Forge</strong> with real-world tool execution & sub-25ms voice.
          </p>
        </div>

        {/* 2. Fluid 3D Revolving Gyroscopic Crystal Visualizer */}
        <div className="relative my-1 flex flex-col items-center">
          <ThreeOrb
            voiceState={voiceState}
            volume={audioVolume}
            theme={theme}
          />

          {/* State text */}
          <div className={`text-xs font-semibold mt-0.5 flex items-center gap-2 ${
            isPureBlack ? 'text-violet-400' : 'text-violet-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            <span>
              {isListening ? 'Listening to your voice...' : isThinking ? 'Forge is processing...' : isExecuting ? 'Executing tool action...' : isSpeaking ? 'Speaking...' : 'Forge ready'}
            </span>
          </div>
        </div>

        {/* 3. Main Black Input Card (Matching User Screenshot Exactly) */}
        <div className="w-full max-w-2xl mt-4 px-2">
          <form
            onSubmit={handleSend}
            className="w-full rounded-[26px] bg-[#1a1a1a] border border-neutral-800/90 shadow-2xl p-4 sm:p-5 flex flex-col justify-between transition-all focus-within:border-neutral-700 focus-within:ring-1 focus-within:ring-violet-500/30"
          >
            {/* Top text input / prompt field */}
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Forge anything or tell it to book a ride, check trains..."
              disabled={isThinking || isExecuting}
              className="w-full bg-transparent text-sm sm:text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed"
            />

            {/* Bottom Controls Row inside the Card */}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-neutral-800/40">
              
              {/* Left: Interactive Model & Efficiency Selector Badge */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 transition-all cursor-pointer select-none"
                  title="Select Forge Model & Efficiency"
                >
                  {selectedModel === 'p1' ? (
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  ) : (
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{selectedModel === 'p1' ? 'Forge P1' : 'Forge P2'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900/80 text-neutral-400 font-medium capitalize">
                    {efficiency}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-neutral-400 ml-0.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && renderModelDropdown(() => setIsDropdownOpen(false))}
              </div>

              {/* Right: Actions (Voice Mic + Circular Send Button ↑) */}
              <div className="flex items-center gap-2">
                
                {/* Hands-free Voice Mic Button */}
                <button
                  type="button"
                  onClick={isListening ? onStopListening : onStartListening}
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-violet-600 text-white ring-4 ring-violet-500/40 animate-pulse'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak with Forge'}
                >
                  {isListening ? (
                    <Square className="w-4 h-4 fill-current text-white" />
                  ) : isThinking || isExecuting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                {/* Circular Send Button with Up Arrow ↑ (Matching Screenshot) */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isThinking || isExecuting}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim()
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-md cursor-pointer'
                      : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Send to Forge"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>

              </div>
            </div>
          </form>
        </div>

        {/* 4. Pills Row Below Main Bar */}
        <div className="w-full max-w-2xl mt-3 flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none px-2 flex-wrap">
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (pill.action === 'voice') {
                  if (!isListening) onStartListening();
                  else onStopListening();
                } else {
                  handleQuickChip(pill.prompt);
                }
              }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isPureBlack
                  ? 'bg-[#121212] hover:bg-[#1f1f1f] text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200 shadow-sm'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 5. SCROLLABLE CONTENT: MODEL DESCRIPTIONS & CAPABILITIES */}
        {/* ======================================================== */}

        {/* ======================================================== */}
        {/* 5. SCROLLABLE CONTENT: CLEAN, UNBOXED, BIG HEADINGS */}
        {/* ======================================================== */}
        <div className="w-full max-w-3xl mt-16 px-4 select-none">
          
          {/* Section 1 Header - BIG & NOTICEABLE */}
          <div className="text-center mb-10">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-violet-400 uppercase block mb-2">
              TWO INTELLIGENCE ENGINES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Choose your Forge model
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Select between everyday rapid velocity and deep multi-step autonomous planning.
            </p>
          </div>

          {/* Section 1 Models: Pure clean text, no boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14">
            
            {/* Model 1: Forge P1 */}
            <div
              onClick={() => setSelectedModel('p1')}
              className="cursor-pointer group space-y-3 transition-opacity hover:opacity-90"
            >
              <div className="flex items-baseline justify-between border-b border-neutral-900 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    Forge P1
                  </h3>
                  <span className="text-xs sm:text-sm text-neutral-400 font-medium">· Normal work</span>
                </div>
                {selectedModel === 'p1' && (
                  <span className="text-xs font-bold text-violet-400">Selected</span>
                )}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                Optimized for fast everyday tasks, quick lookups, single commands, and sub-25ms autonomous voice conversation.
              </p>
              <div className="pt-1 text-xs sm:text-sm text-neutral-400 space-y-1.5">
                <p>• Sub-25ms voice response time</p>
                <p>• Daily tasks, quick lookups & reminders</p>
                <p>• Instant answers with low latency</p>
              </div>
            </div>

            {/* Model 2: Forge P2 */}
            <div
              onClick={() => setSelectedModel('p2')}
              className="cursor-pointer group space-y-3 transition-opacity hover:opacity-90"
            >
              <div className="flex items-baseline justify-between border-b border-neutral-900 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    Forge P2
                  </h3>
                  <span className="text-xs sm:text-sm text-neutral-400 font-medium">· Extreme work</span>
                </div>
                {selectedModel === 'p2' && (
                  <span className="text-xs font-bold text-amber-400">Selected</span>
                )}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                Deep reasoning and complex multi-step execution across rides, trains, calendars, and live stores simultaneously.
              </p>
              <div className="pt-1 text-xs sm:text-sm text-neutral-400 space-y-1.5">
                <p>• Multi-step autonomous tool chaining</p>
                <p>• Chained actions across multiple services</p>
                <p>• High-precision execution for extreme tasks</p>
              </div>
            </div>

          </div>

          {/* Section 2 Header & Capabilities - BIG & NOTICEABLE */}
          <div className="mt-20 pt-10 border-t border-neutral-900">
            <div className="text-center mb-10">
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-violet-400 uppercase block mb-2">
                CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
                What can you do with Forge?
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Speak naturally or tap any capability below to run live autonomous actions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div
                onClick={() => handleQuickChip('Book an Uber Premier to Central Station Platform 4 Gate')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-400 transition-colors tracking-tight">
                  Cab Dispatch
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Book Premier or Go rides, check surge pricing, and get live driver updates.
                </p>
                <p className="text-xs text-neutral-500 pt-1 group-hover:text-neutral-300 transition-colors">
                  "Book Uber Premier to Central Station" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Check Vande Bharat Express live train status and platform')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-400 transition-colors tracking-tight">
                  Live Trains
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Track train locations, platform numbers, and live delay forecasts.
                </p>
                <p className="text-xs text-neutral-500 pt-1 group-hover:text-neutral-300 transition-colors">
                  "Check Vande Bharat Express live status" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Schedule boarding reminder on Google Calendar at 6:15 PM')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-400 transition-colors tracking-tight">
                  Calendar Sync
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Create events, schedule reminders, and sync calendar alerts hands-free.
                </p>
                <p className="text-xs text-neutral-500 pt-1 group-hover:text-neutral-300 transition-colors">
                  "Schedule boarding reminder at 6:15 PM" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Research the price of Apple 30W Fast Charger across Blinkit')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-400 transition-colors tracking-tight">
                  Price Research
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Compare instant product prices and check delivery store availability.
                </p>
                <p className="text-xs text-neutral-500 pt-1 group-hover:text-neutral-300 transition-colors">
                  "Compare Apple 30W Charger price" →
                </p>
              </div>
            </div>
          </div>

          {/* Clean Creator Credit */}
          <div className="mt-16 mb-8 text-center select-none text-xs sm:text-sm text-neutral-500 font-medium flex flex-col items-center gap-1.5">
            <span>Built by Tanmay (Adesh Srivastava)</span>
            <a
              href="mailto:forge.ai@gmail.com"
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium tracking-wide"
            >
              forge.ai@gmail.com
            </a>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE PROPER CHAT BOX WINDOW (Strictly on Pure Black Background)
  // ==========================================
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[76vh] min-h-[540px] rounded-3xl border border-neutral-800 bg-[#000000] text-white shadow-2xl overflow-hidden animate-in fade-in duration-300">
      
      {/* A. Chat Box Header (Pure Black) */}
      <div className="px-5 py-3.5 border-b border-neutral-800/90 bg-[#0a0a0a] flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <ForgeIcon size={18} className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-white tracking-tight">Forge</span>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-700/80 bg-[#161616] hover:bg-[#222222] text-neutral-300 hover:text-white transition-all shadow-sm"
          title="Start fresh conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-violet-400" />
          <span>New Chat</span>
        </button>
      </div>

      {/* B. Proper Chat Box Message Stream (Pure Black Background) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#000000] scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-violet-600 text-white rounded-br-sm shadow-md'
                    : 'bg-[#141414] text-[#ededed] rounded-bl-sm border border-neutral-800/80'
                }`}
              >
                <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-1.5 block font-medium ${
                  isUser ? 'text-violet-200 text-right' : 'text-neutral-400 text-left'
                }`}>
                  {msg.time}
                </span>
              </div>

              {/* Inline Action Widget (Rendered in black theme) */}
              {!isUser && msg.execution && msg.execution.result && (
                <div className="w-full max-w-[85%] sm:max-w-[78%] pt-1">
                  <InlineActionCard execution={msg.execution} theme="dark" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live User Speech Transcription Preview */}
        {isListening && transcript && (
          <div className="flex flex-col items-end space-y-1 animate-pulse">
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-xs bg-violet-600/80 text-white italic shadow-md">
              "{transcript}"
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* C. Sleek Bottom Composer Bar (Pure Black) */}
      <div className="p-3 sm:p-4 border-t border-neutral-800/90 bg-[#0a0a0a]">
        <form
          onSubmit={handleSend}
          className="w-full rounded-2xl p-2.5 pl-4 flex items-center gap-2.5 border border-neutral-800 bg-[#141414] focus-within:border-neutral-700 transition-all"
        >
          {/* Interactive Model & Efficiency Selector in Composer */}
          <div className="relative" ref={composerDropdownRef}>
            <button
              type="button"
              onClick={() => setIsComposerDropdownOpen(prev => !prev)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold select-none bg-neutral-800/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 transition-all cursor-pointer"
              title="Select Model & Efficiency"
            >
              {selectedModel === 'p1' ? (
                <Sparkles className="w-3 h-3 text-violet-400" />
              ) : (
                <Flame className="w-3 h-3 text-amber-400" />
              )}
              <span>{selectedModel === 'p1' ? 'Forge P1' : 'Forge P2'}</span>
              <span className="text-[9px] px-1 rounded bg-neutral-900 text-neutral-400 capitalize">
                {efficiency}
              </span>
              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isComposerDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isComposerDropdownOpen && renderModelDropdown(() => setIsComposerDropdownOpen(false))}
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message Forge..."
            disabled={isThinking || isExecuting}
            className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none font-medium text-white placeholder:text-neutral-500"
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-2 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-violet-600 text-white ring-4 ring-violet-500/40 animate-pulse'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak to Forge'}
          >
            {isListening ? (
              <Square className="w-4 h-4 fill-current text-white" />
            ) : isThinking || isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Circular Up Arrow Send Button ↑ */}
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking || isExecuting}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-md cursor-pointer'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

    </div>
  );
};

// Inline borderless Action Card rendered right inside the conversation
const InlineActionCard: React.FC<{ execution: ToolCallExecution; theme: ThemeMode }> = ({ execution, theme }) => {
  const isPureBlack = theme === 'dark';
  const { toolName, result } = execution;

  if (toolName === 'cab_dispatch') {
    return (
      <div className={`p-4 rounded-3xl space-y-3 ${
        isPureBlack
          ? 'bg-[#141414] text-white'
          : 'bg-white text-neutral-900 shadow-md border border-neutral-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">{result.service} Confirmed</h5>
              <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>{result.destination}</p>
            </div>
          </div>
          <span className={`text-sm font-extrabold ${isPureBlack ? 'text-violet-400' : 'text-violet-700'}`}>{result.fareEstimate}</span>
        </div>

        <div className={`pt-2 border-t flex items-center justify-between text-xs ${
          isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
        }`}>
          <div>
            <div className="font-bold text-[11px]">{result.driver.name} ★ {result.driver.rating}</div>
            <div className={`text-[10px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>{result.driver.carModel} • {result.driver.licensePlate}</div>
          </div>
          <div className="text-right">
            <span className={`text-[9px] uppercase font-bold block ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Start PIN</span>
            <span className={`font-mono text-base font-extrabold ${isPureBlack ? 'text-violet-400' : 'text-violet-700'}`}>{result.otp}</span>
          </div>
        </div>
      </div>
    );
  }

  if (toolName === 'transit_tracker') {
    return (
      <div className={`p-4 rounded-3xl space-y-2.5 ${
        isPureBlack
          ? 'bg-[#141414] text-white'
          : 'bg-white text-neutral-900 shadow-md border border-neutral-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">{result.trainName}</h5>
              <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>#{result.trainNumber}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            On Time
          </span>
        </div>

        <div className={`pt-2 border-t flex items-center justify-between text-xs ${
          isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
        }`}>
          <div>
            <span className={`text-[10px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Assigned Platform</span>
            <span className={`font-bold ${isPureBlack ? 'text-violet-400' : 'text-violet-700'}`}>{result.platform}</span>
          </div>
          <div className="text-right">
            <span className={`text-[10px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Departure</span>
            <span className="font-semibold">{result.scheduledDeparture}</span>
          </div>
        </div>
      </div>
    );
  }

  if (toolName === 'calendar_sync') {
    return (
      <div className={`p-4 rounded-3xl space-y-2 ${
        isPureBlack
          ? 'bg-[#141414] text-white'
          : 'bg-white text-neutral-900 shadow-md border border-neutral-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs">{result.title}</h5>
          </div>
          <span className={`text-[10px] font-bold ${isPureBlack ? 'text-violet-400' : 'text-violet-700'}`}>Calendar Synced</span>
        </div>
        <div className={`text-xs flex items-center gap-2 pt-1 ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <Clock className={`w-3.5 h-3.5 ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`} />
          <span>{result.startTime} - {result.endTime} ({result.date})</span>
        </div>
      </div>
    );
  }

  return null;
};
