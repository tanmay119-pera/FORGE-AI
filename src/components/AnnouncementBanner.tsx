import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#050505] text-white border-b border-neutral-900/80 px-4 py-2.5 text-xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex-1 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap text-center">
          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-violet-600 text-white shadow-sm shadow-violet-600/30">
            Conversational AI
          </span>
          <span className="font-medium text-neutral-300 text-xs">
            Quickly build your multimodal interactive AI agent application with Model Context Protocol (MCP)
          </span>
          <a
            href="#studio"
            className="inline-flex items-center gap-1 font-bold text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
