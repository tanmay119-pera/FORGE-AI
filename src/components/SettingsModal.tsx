import React, { useState } from 'react';
import { AgoraConfig, ThemeMode } from '../types';
import { X, Key, Radio, Settings, ShieldCheck, Check, Sparkles, MapPin, Car, Volume2 } from 'lucide-react';
import { geminiService, DEFAULT_GEMINI_KEY } from '../services/geminiService';
import { elevenLabsService, DEFAULT_ELEVENLABS_VOICE_ID } from '../services/elevenLabsService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgoraConfig;
  onSaveConfig: (config: AgoraConfig) => void;
  theme: ThemeMode;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  theme
}) => {
  const [formData, setFormData] = useState<AgoraConfig>(config);
  const [geminiKey, setGeminiKey] = useState<string>(() => geminiService.getApiKey() || DEFAULT_GEMINI_KEY);
  const [gmapsKey, setGmapsKey] = useState<string>(() => (typeof window !== 'undefined' && localStorage.getItem('forge_gmaps_key')) || '');
  const [uberToken, setUberToken] = useState<string>(() => (typeof window !== 'undefined' && localStorage.getItem('forge_uber_token')) || '');
  const [elevenLabsKey, setElevenLabsKey] = useState<string>(() => elevenLabsService.getApiKey());
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState<string>(() => elevenLabsService.getVoiceId() || DEFAULT_ELEVENLABS_VOICE_ID);
  const [saved, setSaved] = useState(false);
  const isPureBlack = theme === 'dark';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    geminiService.setApiKey(geminiKey);
    elevenLabsService.setApiKey(elevenLabsKey);
    elevenLabsService.setVoiceId(elevenLabsVoiceId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_gmaps_key', gmapsKey.trim());
      localStorage.setItem('forge_uber_token', uberToken.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl transition-all ${
        isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-white text-[#111111]'
      }`}>
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-violet-500/10 text-violet-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">FORGE Settings</h3>
              <p className="text-xs text-neutral-400">Configure Gemini AI & Agora RTC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isPureBlack ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          {/* Gemini AI Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini API Key (Live Active)</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">● Connected</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter Gemini API Key..."
                className={`w-full px-3 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                  isPureBlack
                    ? 'bg-[#141414] text-white'
                    : 'bg-[#f4f4f6] text-black'
                }`}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Powered by Google Gemini 3.6 Flash with Model Context Protocol function calling.
            </p>
          </div>

          {/* ElevenLabs Realistic Voice Settings */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                <span>ElevenLabs Voice Settings</span>
              </label>
              <span className="text-[10px] text-violet-400 font-semibold">● MwUMLXurEzSN7bIfIdXF</span>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={elevenLabsVoiceId}
                  onChange={(e) => setElevenLabsVoiceId(e.target.value)}
                  placeholder="ElevenLabs Voice ID (Default: MwUMLXurEzSN7bIfIdXF)"
                  className={`w-full px-3 py-2 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                    isPureBlack
                      ? 'bg-[#141414] text-white placeholder:text-neutral-600'
                      : 'bg-[#f4f4f6] text-black placeholder:text-neutral-400'
                  }`}
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  placeholder="Enter ElevenLabs API Key (xi-api-key)..."
                  className={`w-full px-3 py-2 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                    isPureBlack
                      ? 'bg-[#141414] text-white placeholder:text-neutral-600'
                      : 'bg-[#f4f4f6] text-black placeholder:text-neutral-400'
                  }`}
                />
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Ultra-realistic human voice generated via ElevenLabs Turbo v2.5. Falls back to browser speech if key is omitted.
            </p>
          </div>

          {/* Google Maps Platform API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Maps API Key (Optional)</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">● Free Engine Active</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={gmapsKey}
                onChange={(e) => setGmapsKey(e.target.value)}
                placeholder="AIzaSy... (Leave empty for built-in smart routing)"
                className={`w-full px-3 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                  isPureBlack
                    ? 'bg-[#141414] text-white placeholder:text-neutral-600'
                    : 'bg-[#f4f4f6] text-black placeholder:text-neutral-400'
                }`}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Used for live distance calculation, geocoding, and driving duration.
            </p>
          </div>

          {/* Uber API Credentials */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-violet-400" />
                <span>Uber API / Server Token (Optional)</span>
              </label>
              <span className="text-[10px] text-violet-400 font-semibold">● Deep-Link Ready</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={uberToken}
                onChange={(e) => setUberToken(e.target.value)}
                placeholder="Enter Uber Server Token / Client ID (Optional)..."
                className={`w-full px-3 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                  isPureBlack
                    ? 'bg-[#141414] text-white placeholder:text-neutral-600'
                    : 'bg-[#f4f4f6] text-black placeholder:text-neutral-400'
                }`}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Powers instant multi-tier ride estimation (UberGo, Premier, XL, Auto) & 1-click booking.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Agora App ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. 4d8b9f... (Leave empty for browser fallback mode)"
                value={formData.appId}
                onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                  isPureBlack
                    ? 'bg-[#141414] text-white placeholder:text-neutral-600'
                    : 'bg-[#f4f4f6] text-black placeholder:text-neutral-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              RTC Channel Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Radio className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                  isPureBlack
                    ? 'bg-[#141414] text-white'
                    : 'bg-[#f4f4f6] text-black'
                }`}
              />
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl flex items-start gap-2.5 ${
            isPureBlack ? 'bg-violet-950/20 text-violet-300' : 'bg-violet-50 text-violet-800'
          }`}>
            <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-violet-400" />
            <div className="text-[11px] leading-relaxed">
              <strong>Live Gemini 3.6 Flash Active:</strong> Gemini processes real-time natural reasoning and triggers MCP tools with sub-second turnaround.
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-2xl transition-colors ${
                isPureBlack ? 'hover:bg-[#1a1a1a] text-neutral-400' : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-2xl bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 transition-colors shadow-md shadow-violet-600/25"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
