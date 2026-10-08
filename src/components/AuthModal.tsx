import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { X, Sparkles, Check, Shield } from 'lucide-react';
import { ForgeIcon } from './ForgeIcon';
import { Avatar } from './Avatar';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  provider: 'apple' | 'google' | 'guest';
  tier: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  theme: ThemeMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  theme
}) => {
  const isPureBlack = theme === 'dark';
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleAppleLogin = () => {
    onLogin({
      name: 'Alex Rivera',
      email: 'alex.rivera@icloud.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'apple',
      tier: 'Executive Diamond'
    });
    onClose();
  };

  const handleGoogleLogin = () => {
    onLogin({
      name: 'Tanmay Sharma',
      email: 'tanmay.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
      tier: 'Executive Pro'
    });
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customName.trim() || 'Guest Explorer';
    onLogin({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@forge.ai`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      provider: 'guest',
      tier: 'Pilot Tier'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl transition-all ${
        isPureBlack ? 'bg-[#0e0e0e] text-[#ededed]' : 'bg-white text-[#111111]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <ForgeIcon size={26} className="w-6 h-6" />
            <h3 className="font-bold text-base">
              {currentUser ? 'Your Profile' : 'Sign in to FORGE'}
            </h3>
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

        {currentUser ? (
          /* Logged In View */
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-2xl flex items-center gap-3.5 ${
              isPureBlack ? 'bg-[#141414]' : 'bg-[#f4f4f6]'
            }`}>
              <Avatar name={currentUser.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm">{currentUser.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/15 text-violet-400">
                    {currentUser.tier}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{currentUser.email}</p>
                <span className="text-[10px] text-neutral-500 capitalize">Via {currentUser.provider} ID</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="flex-1 py-2.5 rounded-2xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors shadow-md shadow-violet-600/25"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Options */
          <div className="space-y-3 pt-2">
            <p className="text-xs text-neutral-400">
              Sign in with your Apple or Google ID to personalize travel preferences, sync your calendar, and unlock voice shortcuts.
            </p>

            {/* Apple Sign-In Button */}
            <button
              onClick={handleAppleLogin}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2.5 transition-all transform active:scale-98 ${
                isPureBlack
                  ? 'bg-white hover:bg-neutral-100 text-black shadow-md'
                  : 'bg-black hover:bg-neutral-800 text-white shadow-md'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.71-14.43-5.74-9.19-10.37-20.08-13.88-32.66-3.52-12.59-5.28-24.16-5.28-34.72 0-14.42 3.65-26.39 10.96-35.91 7.3-9.52 16.5-14.34 27.59-14.47 5.11 0 10.74 1.34 16.89 4.02 6.14 2.68 10.22 4.08 12.23 4.19 1.7 0 5.86-1.42 12.48-4.26 6.62-2.84 12.18-4.14 16.69-3.9 12.48.88 22.38 5.66 29.7 14.34-10.96 6.64-16.32 15.65-16.08 27.03.24 9.17 3.73 16.92 10.47 23.25 6.74 6.33 14.77 9.87 24.08 10.62-2.3 7.02-5.18 14.07-8.63 21.14zM119.22 31.84c0-7.06 2.6-13.87 7.8-20.43 5.2-6.56 11.66-10.64 19.38-12.24.48 1.44.72 2.87.72 4.3 0 7.36-2.73 14.41-8.2 21.14-5.46 6.74-12.02 10.82-19.7 12.24z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2.5 transition-all transform active:scale-98 ${
                isPureBlack
                  ? 'bg-[#181818] hover:bg-[#222222] text-white'
                  : 'bg-[#f4f4f6] hover:bg-[#eaeaec] text-black'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick Guest Name Input */}
            <div className="pt-2">
              <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1.5">Or enter your name</div>
              <form onSubmit={handleCustomLogin} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Tanmay"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className={`flex-1 px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                    isPureBlack ? 'bg-[#181818] text-white placeholder:text-neutral-600' : 'bg-[#f4f4f6] text-black placeholder:text-neutral-400'
                  }`}
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
