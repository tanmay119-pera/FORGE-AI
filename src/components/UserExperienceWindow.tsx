import React, { useState, useRef, useEffect } from 'react';
import { VoiceState, ThemeMode, ToolCallExecution } from '../types';
import { ThreeOrb } from './ThreeOrb';
import { Mic, Square, Loader2, ArrowUp, Sparkles, Car, Train, Calendar, ShoppingBag, Volume2, CheckCircle2, MapPin, Clock, ChevronDown, Plus, RotateCcw, Flame, Check, Zap, Gauge, Plane, ExternalLink, ArrowRight, Tag, User, Navigation } from 'lucide-react';
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
    <div className={`absolute left-0 bottom-full mb-2.5 w-72 sm:w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-left ${
      isPureBlack ? 'bg-[#161616] border-neutral-700/80 text-white' : 'bg-white border-neutral-200 text-neutral-900 shadow-2xl'
    }`}>
      {/* Header */}
      <div className={`px-3.5 py-2.5 border-b flex items-center justify-between text-[11px] font-bold uppercase tracking-wider ${
        isPureBlack ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-500 bg-neutral-50/70'
      }`}>
        <span>Select Model</span>
        <span className="text-[10px] text-violet-500 font-semibold">Autonomous AI</span>
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
              ? isPureBlack
                ? 'bg-[#222222] border border-violet-500/40 text-white'
                : 'bg-violet-50 border border-violet-300 text-neutral-900 shadow-sm'
              : isPureBlack
              ? 'hover:bg-[#1c1c1c] border border-transparent text-neutral-300'
              : 'hover:bg-neutral-50 border border-transparent text-neutral-700'
          }`}
        >
          <div className={`p-2 rounded-lg mt-0.5 ${
            selectedModel === 'p1'
              ? isPureBlack ? 'bg-violet-600/30 text-violet-400' : 'bg-violet-600 text-white'
              : isPureBlack ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className={`font-bold text-xs ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>Forge P1</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isPureBlack
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700/60'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}>
                Normal Work
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 leading-snug ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Fast, everyday tasks & sub-25ms autonomous voice response.
            </p>
          </div>
          {selectedModel === 'p1' && (
            <Check className="w-4 h-4 text-violet-500 mt-1 flex-shrink-0" />
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
              ? isPureBlack
                ? 'bg-[#222222] border border-amber-500/40 text-white'
                : 'bg-amber-50 border border-amber-300 text-neutral-900 shadow-sm'
              : isPureBlack
              ? 'hover:bg-[#1c1c1c] border border-transparent text-neutral-300'
              : 'hover:bg-neutral-50 border border-transparent text-neutral-700'
          }`}
        >
          <div className={`p-2 rounded-lg mt-0.5 ${
            selectedModel === 'p2'
              ? isPureBlack ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500 text-white'
              : isPureBlack ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-600'
          }`}>
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className={`font-bold text-xs ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>Forge P2</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isPureBlack
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                Extreme Work
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 leading-snug ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Deep reasoning, complex multi-step MCP execution & extreme planning.
            </p>
          </div>
          {selectedModel === 'p2' && (
            <Check className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
          )}
        </button>
      </div>

      {/* Efficiency Section */}
      <div className={`p-3 border-t ${
        isPureBlack ? 'border-neutral-800 bg-[#121212]' : 'border-neutral-200 bg-neutral-50/70'
      }`}>
        <div className={`flex items-center justify-between text-[11px] font-bold mb-2 uppercase tracking-wider ${
          isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-violet-500" />
            <span>Efficiency</span>
          </span>
          <span className="text-[10px] text-violet-500 capitalize font-semibold">{efficiency} Mode</span>
        </div>

        <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
          isPureBlack ? 'bg-[#1a1a1a] border-neutral-800' : 'bg-white border-neutral-200 shadow-inner'
        }`}>
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
                    : isPureBlack
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span className="text-[11px] font-bold">{labels[level].name}</span>
                <span className={`text-[9px] ${isSelected ? 'text-violet-200' : isPureBlack ? 'text-neutral-500' : 'text-neutral-400'}`}>
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
    { label: '💡 The Basics', action: 'prompt', prompt: 'Tell me the basics of Forge and how it works' },
    { label: '👤 My Memory', action: 'prompt', prompt: 'Show my saved user profile & memory' },
    { label: '🚗 Ride Home', action: 'prompt', prompt: 'Take me home' },
    { label: 'Talk with Forge', action: 'voice', prompt: '' },
    { label: 'Cab Dispatch', action: 'prompt', prompt: 'Book an Uber Premier to Central Station for the 6 PM train' },
    { label: 'Live Trains', action: 'prompt', prompt: 'Check Vande Bharat Express live train status and platform' },
    { label: 'Flight Radar', action: 'prompt', prompt: 'Track IndiGo flight 6E-204 status and gate' },
    { label: 'Calendar Sync', action: 'prompt', prompt: 'Schedule boarding reminder on Google Calendar at 6:15 PM' },
    { label: 'Price Research', action: 'prompt', prompt: 'Research the price of Apple 30W Fast Charger across Blinkit' }
  ];

  // ==========================================
  // VIEW 1: HERO HOME VIEW (Before any message is sent)
  // ==========================================
  if (!hasChatStarted) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-300">
        
        {/* 1. Header with Feature Badge */}
        <div className="text-center space-y-2.5 pt-2 pb-1 select-none flex flex-col items-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            isPureBlack
              ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
              : 'bg-violet-50 text-violet-700 border-violet-200 shadow-sm'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI • Sub-25ms Voice • Model Context Protocol</span>
          </div>

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

        {/* 3. Main Input Card (Matching User Screenshot Exactly in Dark & Apple-Clean in Light) */}
        <div className="w-full max-w-2xl mt-4 px-2">
          <form
            onSubmit={handleSend}
            className={`w-full rounded-[26px] border shadow-2xl p-4 sm:p-5 flex flex-col justify-between transition-all focus-within:ring-1 focus-within:ring-violet-500/30 ${
              isPureBlack
                ? 'bg-[#1a1a1a] border-neutral-800/90 focus-within:border-neutral-700'
                : 'bg-white border-neutral-200/90 shadow-xl focus-within:border-neutral-400'
            }`}
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
              placeholder="Ask Forge anything or tell it to book a ride, check trains, track flights..."
              disabled={isThinking || isExecuting}
              className={`w-full bg-transparent text-sm sm:text-base focus:outline-none resize-none leading-relaxed font-medium ${
                isPureBlack
                  ? 'text-neutral-100 placeholder:text-neutral-500'
                  : 'text-neutral-900 placeholder:text-neutral-400'
              }`}
            />

            {/* Bottom Controls Row inside the Card */}
            <div className={`flex items-center justify-between pt-3 mt-1 border-t ${
              isPureBlack ? 'border-neutral-800/40' : 'border-neutral-200/80'
            }`}>
              
              {/* Left: Interactive Model & Efficiency Selector Badge */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer select-none ${
                    isPureBlack
                      ? 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700/60 text-neutral-200'
                      : 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-800 shadow-sm'
                  }`}
                  title="Select Forge Model & Efficiency"
                >
                  {selectedModel === 'p1' ? (
                    <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  ) : (
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>{selectedModel === 'p1' ? 'Forge P1' : 'Forge P2'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${
                    isPureBlack ? 'bg-neutral-900/80 text-neutral-400' : 'bg-neutral-200/90 text-neutral-600'
                  }`}>
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
                      : isPureBlack
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak with Forge'}
                >
                  {isListening ? (
                    <Square className="w-4 h-4 fill-current text-white" />
                  ) : isThinking || isExecuting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                {/* Circular Send Button with Up Arrow ↑ */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isThinking || isExecuting}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim()
                      ? isPureBlack
                        ? 'bg-white text-black hover:bg-neutral-200 shadow-md cursor-pointer'
                        : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md cursor-pointer'
                      : isPureBlack
                      ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
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
        {/* 5. SCROLLABLE CONTENT: CLEAN, UNBOXED, BIG HEADINGS */}
        {/* ======================================================== */}
        <div className="w-full max-w-3xl mt-16 px-4 select-none">
          
          {/* Section 1 Header - BIG & NOTICEABLE */}
          <div className="text-center mb-10">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-violet-500 uppercase block mb-2">
              TWO INTELLIGENCE ENGINES
            </span>
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight mb-3 ${
              isPureBlack ? 'text-white' : 'text-neutral-900'
            }`}>
              Choose your Forge model
            </h2>
            <p className={`text-sm sm:text-base max-w-lg mx-auto leading-relaxed ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
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
              <div className={`flex items-baseline justify-between border-b pb-3 ${
                isPureBlack ? 'border-neutral-900' : 'border-neutral-200'
              }`}>
                <div className="flex items-baseline gap-2.5">
                  <h3 className={`font-extrabold text-2xl sm:text-3xl tracking-tight ${
                    isPureBlack ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Forge P1
                  </h3>
                  <span className={`text-xs sm:text-sm font-medium ${
                    isPureBlack ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>· Normal work</span>
                </div>
                {selectedModel === 'p1' && (
                  <span className="text-xs font-bold text-violet-500">Selected</span>
                )}
              </div>
              <p className={`text-sm leading-relaxed font-normal ${
                isPureBlack ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Optimized for fast everyday tasks, quick lookups, single commands, and sub-25ms autonomous voice conversation.
              </p>
              <div className={`pt-1 text-xs sm:text-sm space-y-1.5 ${
                isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
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
              <div className={`flex items-baseline justify-between border-b pb-3 ${
                isPureBlack ? 'border-neutral-900' : 'border-neutral-200'
              }`}>
                <div className="flex items-baseline gap-2.5">
                  <h3 className={`font-extrabold text-2xl sm:text-3xl tracking-tight ${
                    isPureBlack ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Forge P2
                  </h3>
                  <span className={`text-xs sm:text-sm font-medium ${
                    isPureBlack ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>· Extreme work</span>
                </div>
                {selectedModel === 'p2' && (
                  <span className="text-xs font-bold text-amber-500">Selected</span>
                )}
              </div>
              <p className={`text-sm leading-relaxed font-normal ${
                isPureBlack ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Deep reasoning and complex multi-step execution across rides, trains, flights, calendars, and live stores simultaneously.
              </p>
              <div className={`pt-1 text-xs sm:text-sm space-y-1.5 ${
                isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                <p>• Multi-step autonomous tool chaining</p>
                <p>• Chained actions across multiple services</p>
                <p>• High-precision execution for extreme tasks</p>
              </div>
            </div>

          </div>

          {/* Section 2 Header & Capabilities - BIG & NOTICEABLE */}
          <div className={`mt-20 pt-10 border-t ${isPureBlack ? 'border-neutral-900' : 'border-neutral-200'}`}>
            <div className="text-center mb-10">
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-violet-500 uppercase block mb-2">
                CAPABILITIES
              </span>
              <h2 className={`text-3xl sm:text-5xl font-black tracking-tight mb-3 ${
                isPureBlack ? 'text-white' : 'text-neutral-900'
              }`}>
                What can you do with Forge?
              </h2>
              <p className={`text-sm sm:text-base max-w-lg mx-auto leading-relaxed ${
                isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Speak naturally or tap any capability below to run live autonomous actions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              <div
                onClick={() => handleQuickChip('Book an Uber Premier to Central Station Platform 4 Gate')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isPureBlack ? 'text-white group-hover:text-violet-400' : 'text-neutral-900 group-hover:text-violet-600'
                }`}>
                  Cab Dispatch
                </p>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  5-tier Uber fleet with Google Maps routing, live drivers, and fare breakdown.
                </p>
                <p className={`text-xs pt-1 transition-colors ${
                  isPureBlack ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}>
                  "Book Uber Premier to Central Station" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Check Vande Bharat Express live train status and platform')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isPureBlack ? 'text-white group-hover:text-violet-400' : 'text-neutral-900 group-hover:text-violet-600'
                }`}>
                  Live Trains
                </p>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Track Vande Bharat, Shatabdi & Rajdhani speeds, delays, and platforms.
                </p>
                <p className={`text-xs pt-1 transition-colors ${
                  isPureBlack ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}>
                  "Check Vande Bharat Express status" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Track IndiGo flight 6E-204 status and gate')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isPureBlack ? 'text-white group-hover:text-violet-400' : 'text-neutral-900 group-hover:text-violet-600'
                }`}>
                  Flight Radar
                </p>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Live airport gates, terminal security wait times, and baggage carousel tracking.
                </p>
                <p className={`text-xs pt-1 transition-colors ${
                  isPureBlack ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}>
                  "Track IndiGo flight 6E-204" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Schedule boarding reminder on Google Calendar at 6:15 PM')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isPureBlack ? 'text-white group-hover:text-violet-400' : 'text-neutral-900 group-hover:text-violet-600'
                }`}>
                  Calendar Sync
                </p>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Create events, schedule reminders, and sync Google Meet alerts hands-free.
                </p>
                <p className={`text-xs pt-1 transition-colors ${
                  isPureBlack ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}>
                  "Schedule boarding reminder at 6:15 PM" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Research the price of Apple 30W Fast Charger across Blinkit')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isPureBlack ? 'text-white group-hover:text-violet-400' : 'text-neutral-900 group-hover:text-violet-600'
                }`}>
                  Price Comparison
                </p>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Compare instant prices across Blinkit, Zepto, Swiggy Instamart, and Amazon.
                </p>
                <p className={`text-xs pt-1 transition-colors ${
                  isPureBlack ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}>
                  "Compare Apple 30W Charger price" →
                </p>
              </div>

              <div
                onClick={() => handleQuickChip('Tell me the basics of Forge and how MCP tools work')}
                className="cursor-pointer group space-y-1.5"
              >
                <p className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  isPureBlack ? 'text-white group-hover:text-violet-400' : 'text-neutral-900 group-hover:text-violet-600'
                }`}>
                  Architecture & Basics
                </p>
                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  4-stage pipeline, Model Context Protocol, and autonomous agents in sub-25ms.
                </p>
                <p className={`text-xs pt-1 transition-colors ${
                  isPureBlack ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-900'
                }`}>
                  "Tell me the basics of Forge" →
                </p>
              </div>
            </div>
          </div>

          {/* Clean Creator Credit */}
          <div className="mt-16 mb-8 text-center select-none text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5">
            <span className={isPureBlack ? 'text-neutral-500' : 'text-neutral-600'}>Built by Tanmay (Adesh Srivastava)</span>
            <a
              href="mailto:forge.ai@gmail.com"
              className="text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 transition-colors font-medium tracking-wide"
            >
              forge.ai@gmail.com
            </a>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE PROPER CHAT BOX WINDOW
  // ==========================================
  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col h-[76vh] min-h-[540px] rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in duration-300 ${
      isPureBlack ? 'border-neutral-800 bg-[#000000] text-white' : 'border-neutral-200 bg-white text-neutral-900 shadow-xl'
    }`}>
      
      {/* A. Chat Box Header */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between select-none ${
        isPureBlack ? 'border-neutral-800/90 bg-[#0a0a0a]' : 'border-neutral-200 bg-neutral-50/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <ForgeIcon size={18} className="w-4 h-4" />
            </div>
            <span className={`font-bold text-base tracking-tight ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>Forge</span>
          </div>

          {/* Live Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online • MCP Connected</span>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleResetChat}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
            isPureBlack
              ? 'border-neutral-700/80 bg-[#161616] hover:bg-[#222222] text-neutral-300 hover:text-white'
              : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900'
          }`}
          title="Start fresh conversation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-violet-500" />
          <span>New Chat</span>
        </button>
      </div>

      {/* B. Proper Chat Box Message Stream */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin ${
        isPureBlack ? 'bg-[#000000]' : 'bg-[#fafafa]'
      }`}>
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
                    : isPureBlack
                    ? 'bg-[#141414] text-[#ededed] rounded-bl-sm border border-neutral-800/80'
                    : 'bg-white text-neutral-900 rounded-bl-sm border border-neutral-200/90 shadow-sm'
                }`}
              >
                <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-1.5 block font-medium ${
                  isUser ? 'text-violet-200 text-right' : isPureBlack ? 'text-neutral-400 text-left' : 'text-neutral-500 text-left'
                }`}>
                  {msg.time}
                </span>
              </div>

              {/* Inline Action Widget (Theme-aware with command dispatch) */}
              {!isUser && msg.execution && msg.execution.result && (
                <div className="w-full max-w-[88%] sm:max-w-[82%] pt-1">
                  <InlineActionCard execution={msg.execution} theme={theme} onCommandClick={(cmd) => handleQuickChip(cmd)} />
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

      {/* C. Sleek Bottom Composer Bar */}
      <div className={`p-3 sm:p-4 border-t ${
        isPureBlack ? 'border-neutral-800/90 bg-[#0a0a0a]' : 'border-neutral-200 bg-neutral-50/80'
      }`}>
        <form
          onSubmit={handleSend}
          className={`w-full rounded-2xl p-2.5 pl-4 flex items-center gap-2.5 border transition-all ${
            isPureBlack
              ? 'border-neutral-800 bg-[#141414] focus-within:border-neutral-700'
              : 'border-neutral-200 bg-white shadow-sm focus-within:border-neutral-300'
          }`}
        >
          {/* Interactive Model & Efficiency Selector in Composer */}
          <div className="relative" ref={composerDropdownRef}>
            <button
              type="button"
              onClick={() => setIsComposerDropdownOpen(prev => !prev)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold select-none border transition-all cursor-pointer ${
                isPureBlack
                  ? 'bg-neutral-800/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700/60'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200 shadow-sm'
              }`}
              title="Select Model & Efficiency"
            >
              {selectedModel === 'p1' ? (
                <Sparkles className="w-3 h-3 text-violet-500" />
              ) : (
                <Flame className="w-3 h-3 text-amber-500" />
              )}
              <span>{selectedModel === 'p1' ? 'Forge P1' : 'Forge P2'}</span>
              <span className={`text-[9px] px-1 rounded capitalize ${
                isPureBlack ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-200 text-neutral-600'
              }`}>
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
            className={`flex-1 bg-transparent text-xs sm:text-sm focus:outline-none font-medium ${
              isPureBlack ? 'text-white placeholder:text-neutral-500' : 'text-neutral-900 placeholder:text-neutral-400'
            }`}
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-2 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-violet-600 text-white ring-4 ring-violet-500/40 animate-pulse'
                : isPureBlack
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
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
                ? isPureBlack
                  ? 'bg-white text-black hover:bg-neutral-200 shadow-md cursor-pointer'
                  : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md cursor-pointer'
                : isPureBlack
                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
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

// Inline rich Action Card rendered right inside the conversation
const InlineActionCard: React.FC<{
  execution: ToolCallExecution;
  theme: ThemeMode;
  onCommandClick?: (cmd: string) => void;
}> = ({ execution, theme, onCommandClick }) => {
  const isPureBlack = theme === 'dark';
  const { toolName, result } = execution;

  // 0. Personalized User Memory & Executive Context Card
  if (toolName === 'user_memory') {
    const data = result as any;
    const profile = data.currentProfile || {};
    return (
      <div className={`p-4 sm:p-5 rounded-2xl space-y-4 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base tracking-tight">{profile.name || 'Personalized User Profile'}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  {profile.tier || 'Executive Diamond'}
                </span>
              </div>
              <p className={`text-xs ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'} mt-0.5`}>
                {profile.email} • User-Aware In-Model Reasoning
              </p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
            data.action === 'updated'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
          }`}>
            {data.action === 'updated' ? '✓ Updated' : 'Recalled'}
          </span>
        </div>

        {/* Saved Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className={`p-3 rounded-xl border ${isPureBlack ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-violet-500 font-bold text-[10px] uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Saved Home
              </span>
              <button
                type="button"
                onClick={() => onCommandClick?.(`Take me home`)}
                className="text-[10px] text-violet-400 hover:underline font-semibold"
              >
                Ride Home →
              </button>
            </div>
            <p className={`font-semibold text-xs ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>
              {profile.homeAddress || 'Connaught Place, New Delhi'}
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${isPureBlack ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-violet-500 font-bold text-[10px] uppercase flex items-center gap-1">
                <Navigation className="w-3 h-3" /> Saved Office
              </span>
              <button
                type="button"
                onClick={() => onCommandClick?.(`Take me to work`)}
                className="text-[10px] text-violet-400 hover:underline font-semibold"
              >
                Ride Office →
              </button>
            </div>
            <p className={`font-semibold text-xs ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>
              {profile.workAddress || 'Cyber Hub Building 10, Gurugram'}
            </p>
          </div>
        </div>

        {/* Preferences & Quick Actions */}
        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
          isPureBlack ? 'bg-[#181818] border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
        }`}>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Preferred Fleet</span>
            <span className="font-bold text-violet-500">{profile.preferredRideService || 'Premier'} (Auto Selected)</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onCommandClick?.('Take me home')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors"
            >
              "Take me home"
            </button>
            <button
              type="button"
              onClick={() => onCommandClick?.('Take me to work')}
              className="px-2.5 py-1 text-[11px] rounded-lg border border-violet-500/40 hover:bg-violet-500/10 text-violet-400 font-bold transition-colors"
            >
              "Take me to work"
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. Forge Basics & System Architecture Card
  if (toolName === 'forge_basics') {
    const data = result as any;
    return (
      <div className={`p-4 sm:p-5 rounded-2xl space-y-4 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base tracking-tight">{data.title || 'Forge Architecture & Basics'}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-500 border border-violet-500/30">
                  Autonomous AI
                </span>
              </div>
              <p className={`text-xs ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'} mt-0.5`}>
                Built by Tanmay (Adesh Srivastava) • Sub-25ms Real-Time Engine
              </p>
            </div>
          </div>
        </div>

        {/* 4-Stage Execution Pipeline */}
        <div>
          <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
            ⚡ Autonomous End-to-End Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-violet-500 font-bold block text-[10px] uppercase">1. Voice Ingestion</span>
              <p className={`text-[11px] font-medium mt-0.5 ${isPureBlack ? 'text-neutral-300' : 'text-neutral-700'}`}>Sub-25ms WebRTC / Agora SD-RTN</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-fuchsia-500 font-bold block text-[10px] uppercase">2. Intelligence</span>
              <p className={`text-[11px] font-medium mt-0.5 ${isPureBlack ? 'text-neutral-300' : 'text-neutral-700'}`}>Gemini 3.6 Flash Native Function Calling</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-emerald-500 font-bold block text-[10px] uppercase">3. Real MCP Tools</span>
              <p className={`text-[11px] font-medium mt-0.5 ${isPureBlack ? 'text-neutral-300' : 'text-neutral-700'}`}>Uber, Railways, Flights, Blinkit, Calendar</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${isPureBlack ? 'bg-[#181818] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-amber-500 font-bold block text-[10px] uppercase">4. Neural Voice</span>
              <p className={`text-[11px] font-medium mt-0.5 ${isPureBlack ? 'text-neutral-300' : 'text-neutral-700'}`}>ElevenLabs Neural Speech Output</p>
            </div>
          </div>
        </div>

        {/* 5 Real-World Pillars with Direct Clickable Commands */}
        <div>
          <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
            <span>🛠️ Real-World Capabilities & Sample Commands</span>
            <span className="text-[10px] text-violet-500 font-medium">Click any to run</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(data.pillars || []).map((pillar: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => onCommandClick?.(pillar.sampleCommand)}
                className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] group ${
                  isPureBlack
                    ? 'bg-[#181818] hover:bg-[#202020] border-neutral-800 hover:border-violet-500/50'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-violet-400 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-violet-500 group-hover:text-violet-400">{pillar.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isPureBlack ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {pillar.badge}
                  </span>
                </div>
                <p className={`text-[11px] leading-snug line-clamp-2 ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {pillar.description}
                </p>
                <div className="mt-1.5 text-[10px] font-semibold text-neutral-500 group-hover:text-violet-500 flex items-center gap-1">
                  <span className="truncate max-w-[240px]">"{pillar.sampleCommand}"</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Engines */}
        <div className={`pt-2.5 border-t text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2 ${
          isPureBlack ? 'border-neutral-800/60 text-neutral-400' : 'border-neutral-200 text-neutral-600'
        }`}>
          <div>
            <strong className="text-violet-500">Forge P1:</strong> Normal Velocity • <strong className="text-amber-500">Forge P2:</strong> Extreme Reasoning
          </div>
          <span className="text-[10px] text-neutral-500">Engineered by Tanmay • forge.ai@gmail.com</span>
        </div>
      </div>
    );
  }

  // 1. Cab Dispatch Card (5-tier options, Google Maps routing, driver details, Uber link)
  if (toolName === 'cab_dispatch') {
    const options = result.options || [];
    const route = result.route;

    return (
      <div className={`p-4 rounded-2xl space-y-3.5 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800/80 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h5 className="font-bold text-xs">Uber Ride Dispatched</h5>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-violet-500/15 text-violet-500">
                  Google Maps
                </span>
              </div>
              <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {route ? `${route.distanceKm} km • ~${route.durationMinutes} mins • ${route.trafficLevel} Traffic` : result.destination}
              </p>
            </div>
          </div>
          <span className={`text-base font-extrabold ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`}>
            {result.fareEstimate}
          </span>
        </div>

        {/* 5-tier options preview if available */}
        {options.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
            {options.map((opt: any) => (
              <div
                key={opt.service}
                className={`p-1.5 rounded-lg text-center border text-[11px] ${
                  opt.name === result.service
                    ? isPureBlack
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300 font-bold'
                      : 'bg-violet-50 border-violet-400 text-violet-900 font-bold'
                    : isPureBlack
                    ? 'bg-[#1a1a1a] border-neutral-800/60 text-neutral-400'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="text-[10px] truncate">{opt.name.replace('Uber ', '')}</div>
                <div className="font-extrabold">{opt.fare}</div>
              </div>
            ))}
          </div>
        )}

        <div className={`pt-2 border-t flex items-center justify-between text-xs ${
          isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
        }`}>
          <div>
            <div className="font-bold text-[11px]">{result.driver.name} ★ {result.driver.rating}</div>
            <div className={`text-[10px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {result.driver.carModel} • {result.driver.licensePlate}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className={`text-[9px] uppercase font-bold block ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Start PIN
              </span>
              <span className={`font-mono text-base font-extrabold ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`}>
                {result.otp}
              </span>
            </div>
            {result.uberDeepLink && (
              <a
                href={result.uberDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 border border-neutral-700 flex items-center gap-1 text-[10px] font-bold shadow-sm"
                title="Open in Uber"
              >
                <span>Uber</span>
                <ExternalLink className="w-3 h-3 text-neutral-300" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Train Status Card
  if (toolName === 'transit_tracker') {
    return (
      <div className={`p-4 rounded-2xl space-y-2.5 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800/80 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">{result.trainName}</h5>
              <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
                #{result.trainNumber} • {result.departureStation} → {result.arrivalStation}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            On Time
          </span>
        </div>

        <div className={`pt-2 border-t grid grid-cols-3 gap-2 text-xs ${
          isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
        }`}>
          <div>
            <span className={`text-[9px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Platform</span>
            <span className={`font-bold text-sm ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`}>{result.platform}</span>
          </div>
          <div>
            <span className={`text-[9px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Speed</span>
            <span className="font-semibold text-xs">{result.currentSpeed || '130 km/h'}</span>
          </div>
          <div className="text-right">
            <span className={`text-[9px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Departure</span>
            <span className="font-semibold text-xs">{result.scheduledDeparture}</span>
          </div>
        </div>

        {result.cateringStatus && (
          <div className={`text-[10px] pt-1 border-t ${
            isPureBlack ? 'border-neutral-800/40 text-neutral-400' : 'border-neutral-100 text-neutral-600'
          }`}>
            🍽️ {result.cateringStatus}
          </div>
        )}
      </div>
    );
  }

  // 3. Flight Tracker Card
  if (toolName === 'flight_tracker') {
    return (
      <div className={`p-4 rounded-2xl space-y-2.5 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800/80 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">{result.airline} {result.flightNumber}</h5>
              <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {result.origin} → {result.destination}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            {result.status}
          </span>
        </div>

        <div className={`pt-2 border-t grid grid-cols-3 gap-2 text-xs ${
          isPureBlack ? 'border-neutral-800/60' : 'border-neutral-200'
        }`}>
          <div>
            <span className={`text-[9px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Gate</span>
            <span className={`font-bold text-sm ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`}>{result.gate}</span>
          </div>
          <div>
            <span className={`text-[9px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Terminal</span>
            <span className="font-semibold text-xs">{result.terminal}</span>
          </div>
          <div className="text-right">
            <span className={`text-[9px] block uppercase font-bold ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>Departure</span>
            <span className="font-semibold text-xs">{result.scheduledDeparture}</span>
          </div>
        </div>

        <div className={`text-[10px] pt-1.5 border-t flex items-center justify-between ${
          isPureBlack ? 'border-neutral-800/40 text-neutral-400' : 'border-neutral-100 text-neutral-600'
        }`}>
          <span>🧳 Carousel: {result.baggageBelt}</span>
          <span>⏱️ Security Wait: ~{result.securityWaitMins} mins</span>
        </div>
      </div>
    );
  }

  // 4. Calendar Sync Card
  if (toolName === 'calendar_sync') {
    return (
      <div className={`p-4 rounded-2xl space-y-2 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800/80 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">{result.title}</h5>
              <p className={`text-[10px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-500'}`}>{result.date}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`}>
            Google Calendar Synced
          </span>
        </div>
        <div className={`text-xs flex items-center gap-2 pt-1 border-t ${
          isPureBlack ? 'border-neutral-800/60 text-neutral-400' : 'border-neutral-200 text-neutral-600'
        }`}>
          <Clock className={`w-3.5 h-3.5 ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`} />
          <span>{result.startTime} - {result.endTime}</span>
          {result.location && <span className="text-[11px] truncate max-w-[200px]">• {result.location}</span>}
        </div>
      </div>
    );
  }

  // 5. Local Pricing Card
  if (toolName === 'local_pricing') {
    const options = result.options || [];
    return (
      <div className={`p-4 rounded-2xl space-y-3 border transition-all ${
        isPureBlack
          ? 'bg-[#121212] border-neutral-800/80 text-white'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-md'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs">{result.product}</h5>
              <p className={`text-[11px] ${isPureBlack ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Best: {result.cheapestVendor}
              </p>
            </div>
          </div>
          <span className={`text-base font-extrabold ${isPureBlack ? 'text-violet-400' : 'text-violet-600'}`}>
            {result.lowestPrice}
          </span>
        </div>

        {options.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
            {options.map((opt: any, idx: number) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-left text-[11px] ${
                  idx === 0
                    ? isPureBlack
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300 font-bold'
                      : 'bg-violet-50 border-violet-400 text-violet-900 font-bold'
                    : isPureBlack
                    ? 'bg-[#1a1a1a] border-neutral-800/60 text-neutral-400'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="text-[10px] font-semibold truncate">{opt.store}</div>
                <div className="font-extrabold mt-0.5">{opt.price}</div>
                <div className="text-[9px] text-neutral-500 mt-0.5">{opt.deliveryTime}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};
