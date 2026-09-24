import React, { useState } from 'react';
import { ThemeMode, AgoraConfig } from '../types';
import { Moon, Sun, Settings, Volume2, User, ChevronDown } from 'lucide-react';
import { ForgeIcon } from './ForgeIcon';
import { UserProfile } from './AuthModal';
import { Avatar } from './Avatar';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: (e: React.MouseEvent<HTMLButtonElement>) => void;
  agoraConnected: boolean;
  agoraConfig: AgoraConfig;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile | null;
  volume: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  agoraConnected,
  onOpenSettings,
  onOpenAuth,
  currentUser,
  volume
}) => {
  const isPureBlack = theme === 'dark';
  const [isRotating, setIsRotating] = useState(false);

  const handleThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    onToggleTheme(e);
  };

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 ${
      isPureBlack
        ? 'bg-[#000000]/85 border-neutral-900 text-[#ededed]'
        : 'bg-[#ffffff]/90 border-neutral-200 text-[#111111]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-3">
            <ForgeIcon size={32} className="w-8 h-8" />
            <span className={`font-extrabold text-xl tracking-tight ${
              isPureBlack ? 'text-white' : 'text-neutral-900'
            }`}>FORGE</span>
          </a>

          {/* SaaS Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold">
            <a
              href="#studio"
              className={`transition-colors flex items-center gap-1 ${
                isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Products <ChevronDown className="w-3 h-3 text-neutral-500" />
            </a>
            
            {/* Real-Time Voice AI */}
            <a
              href="#studio"
              className={`bg-clip-text text-transparent font-bold flex items-center gap-1 ${
                isPureBlack
                  ? 'bg-gradient-to-r from-violet-400 to-fuchsia-400'
                  : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
              }`}
            >
              Real-Time Voice AI
            </a>

            <a
              href="#mcp"
              className={`transition-colors flex items-center gap-1 ${
                isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              MCP Tools <ChevronDown className="w-3 h-3 text-neutral-500" />
            </a>

            <a
              href="#solutions"
              className={`transition-colors flex items-center gap-1 ${
                isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Solutions <ChevronDown className="w-3 h-3 text-neutral-500" />
            </a>

            <a
              href="https://github.com/AgoraIO-Conversational-AI/recipe-agent-mcp"
              target="_blank"
              rel="noreferrer"
              className={`transition-colors ${
                isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Developers
            </a>

            <a
              href="#pricing"
              className={`transition-colors ${
                isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Pricing
            </a>

            <a
              href="#resources"
              className={`transition-colors ${
                isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              Resources
            </a>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Audio Volume Bar */}
          {agoraConnected && (
            <div className={`hidden md:flex items-center gap-2 text-[11px] ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <Volume2 className="w-3.5 h-3.5 text-violet-500" />
              <div className={`w-12 h-1 rounded-full overflow-hidden ${
                isPureBlack ? 'bg-neutral-800' : 'bg-neutral-200'
              }`}>
                <div
                  className="h-full bg-violet-600 transition-all duration-75 rounded-full"
                  style={{ width: `${Math.min(100, Math.round(volume * 150))}%` }}
                />
              </div>
            </div>
          )}

          {/* Login / Profile */}
          <button
            onClick={onOpenAuth}
            className={`text-xs font-semibold transition-colors px-2 py-1 ${
              isPureBlack ? 'text-neutral-300 hover:text-white' : 'text-neutral-800 hover:text-black'
            }`}
          >
            {currentUser ? (
              <span className="flex items-center gap-1.5">
                <Avatar name={currentUser.name} size="xs" />
                <span className="hidden sm:inline font-bold">{currentUser.name.split(' ')[0]}</span>
              </span>
            ) : (
              'Login'
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeClick}
            className={`p-2 rounded-full transition-all ${
              isPureBlack ? 'hover:bg-neutral-900 text-amber-400' : 'hover:bg-neutral-100 text-violet-700'
            }`}
            title="Toggle theme"
          >
            <div className={`transition-transform duration-500 ${isRotating ? 'rotate-[360deg] scale-110' : 'rotate-0'}`}>
              {isPureBlack ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-full transition-colors ${
              isPureBlack ? 'hover:bg-neutral-900 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-600 hover:text-black'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Violet CTA Pill "Talk to Agent" */}
          <a
            href="#studio"
            className="px-4 py-2 rounded-full text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/25 transition-all whitespace-nowrap"
          >
            Talk to Agent
          </a>

        </div>

      </div>
    </header>
  );
};
