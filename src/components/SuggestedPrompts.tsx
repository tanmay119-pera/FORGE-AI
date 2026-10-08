import React from 'react';
import { ThemeMode } from '../types';
import { Sparkles, Car, Train, Calendar, ShoppingBag, Plane } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  theme: ThemeMode;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt, theme }) => {
  const isPureBlack = theme === 'dark';

  const prompts = [
    {
      title: 'The Basics',
      text: 'Tell me the basics of Forge and how MCP tools work',
      icon: Sparkles
    },
    {
      title: 'Showstopper',
      text: 'Book a cab to Central Station for the 6 PM train',
      icon: Sparkles
    },
    {
      title: 'Cab (Multi-Turn)',
      text: 'I want to book a cab',
      icon: Car
    },
    {
      title: 'Cab (Direct)',
      text: 'Book a cab from Connaught Place to Terminal 3 Airport',
      icon: Car
    },
    {
      title: 'Train',
      text: 'Check Vande Bharat Express live train status and platform',
      icon: Train
    },
    {
      title: 'Flight',
      text: 'Track IndiGo flight 6E-204 status and gate',
      icon: Plane
    },
    {
      title: 'Calendar',
      text: 'Schedule boarding reminder on Google Calendar at 6:15 PM',
      icon: Calendar
    },
    {
      title: 'Price',
      text: 'Find price of Apple 30W Fast Charger across Blinkit',
      icon: ShoppingBag
    }
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-violet-400" />
        <span>Quick Suggestions</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {prompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(p.text)}
              className={`flex-shrink-0 group text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 ${
                isPureBlack
                  ? 'bg-[#121212] hover:bg-[#1a1a1a] text-[#ededed]'
                  : 'bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#171717]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-violet-400 group-hover:text-violet-300">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-medium max-w-[170px] truncate">
                  {p.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
