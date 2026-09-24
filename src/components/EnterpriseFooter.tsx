import React from 'react';
import { ThemeMode } from '../types';
import { ForgeIcon } from './ForgeIcon';
import { Award, Shield, Terminal, ArrowUpRight, MessageCircle, ExternalLink } from 'lucide-react';

interface EnterpriseFooterProps {
  theme?: ThemeMode;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({ theme = 'dark' }) => {
  const isPureBlack = theme === 'dark';

  return (
    <footer className={`w-full border-t pt-16 pb-12 transition-colors duration-300 ${
      isPureBlack
        ? 'bg-[#000000] text-[#ededed] border-neutral-900'
        : 'bg-[#fafafa] text-[#111111] border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid: Brand + 4 Nav Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16">
          
          {/* Brand & Awards Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <ForgeIcon size={34} className="w-9 h-9" />
              <span className={`font-extrabold text-xl tracking-tight ${
                isPureBlack ? 'text-white' : 'text-neutral-900'
              }`}>FORGE</span>
            </div>

            <p className={`text-xs max-w-sm leading-relaxed ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              The next-generation conversational Voice AI co-pilot. Orchestrating real-world side effects via Model Context Protocol (MCP) with Agora SD-RTN sub-25ms latency and Gemini 3.6 Flash multimodal intelligence.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {['LinkedIn', 'X', 'GitHub', 'Discord', 'YouTube'].map((net) => (
                <a
                  key={net}
                  href="#"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                    isPureBlack
                      ? 'bg-neutral-900 hover:bg-violet-600 text-neutral-400 hover:text-white'
                      : 'bg-neutral-200 hover:bg-violet-600 text-neutral-700 hover:text-white'
                  }`}
                  title={net}
                >
                  {net[0]}
                </a>
              ))}
            </div>

            {/* Awards Badges */}
            <div className="flex items-center gap-2.5 pt-2">
              <div className={`px-3 py-2 rounded-xl text-center border ${
                isPureBlack
                  ? 'bg-neutral-900/90 border-neutral-800'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="text-[9px] uppercase font-bold text-amber-500">Leader</div>
                <div className={`text-[11px] font-black ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>Voice AI</div>
                <div className="text-[8px] text-neutral-500">2026</div>
              </div>

              <div className={`px-3 py-2 rounded-xl text-center border ${
                isPureBlack
                  ? 'bg-neutral-900/90 border-neutral-800'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="text-[9px] uppercase font-bold text-violet-500">Top Rated</div>
                <div className={`text-[11px] font-black ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>MCP Tools</div>
                <div className="text-[8px] text-neutral-500">2026</div>
              </div>

              <div className={`px-3 py-2 rounded-xl text-center border ${
                isPureBlack
                  ? 'bg-neutral-900/90 border-neutral-800'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}>
                <div className="text-[9px] uppercase font-bold text-emerald-500">Speed</div>
                <div className={`text-[11px] font-black ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>&lt;25ms RTT</div>
                <div className="text-[8px] text-neutral-500">Global</div>
              </div>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${
              isPureBlack ? 'text-white' : 'text-neutral-900'
            }`}>Products</h4>
            <ul className={`space-y-2.5 text-xs ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Conversational Voice AI</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Real-Time Audio Engine</a></li>
              <li><a href="#mcp" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>MCP Tool Orchestrator</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Agora SD-RTN Integration</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Gemini 3.6 Flash Engine</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Acoustic Echo Cancellation</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Voice Studio Playground</a></li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${
              isPureBlack ? 'text-white' : 'text-neutral-900'
            }`}>Solutions</h4>
            <ul className={`space-y-2.5 text-xs ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Autonomous Travel & Cabs</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Rail & Transit Logistics</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Calendar Schedule Buffer</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Instant Commerce & Deals</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Enterprise Support Voice</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Telehealth & Care Agents</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Voice Commerce</a></li>
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${
              isPureBlack ? 'text-white' : 'text-neutral-900'
            }`}>Developers</h4>
            <ul className={`space-y-2.5 text-xs ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li><a href="https://github.com/AgoraIO-Conversational-AI/recipe-agent-mcp" target="_blank" rel="noreferrer" className={`transition-colors flex items-center gap-1 ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Developer Hub <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="#mcp" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>MCP Protocol Spec</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Agora RTC Web SDK</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Gemini Function Calling</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Documentation</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Interactive API Console</a></li>
              <li><a href="#studio" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Pricing & Quotas</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${
              isPureBlack ? 'text-white' : 'text-neutral-900'
            }`}>Company</h4>
            <ul className={`space-y-2.5 text-xs ${
              isPureBlack ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <li><a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>About FORGE</a></li>
              <li><span className={`font-semibold ${isPureBlack ? 'text-violet-400' : 'text-violet-700'}`}>Creator: Tanmay (Adesh Srivastava)</span></li>
              <li><a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Architecture Overview</a></li>
              <li><a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>Security & Privacy</a></li>
              <li><a href="mailto:forge.ai@gmail.com" className={`transition-colors ${isPureBlack ? 'hover:text-white text-violet-400' : 'hover:text-black text-violet-700 font-medium'}`}>Contact: forge.ai@gmail.com</a></li>
              <li><a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-white' : 'hover:text-black font-medium'}`}>System Status</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isPureBlack ? 'border-neutral-900 text-neutral-500' : 'border-neutral-200 text-neutral-600'
        }`}>
          <div>
            Copyright © 2021-2026 FORGE. All Rights Reserved. Built by <strong className={isPureBlack ? 'text-neutral-300' : 'text-neutral-900 font-bold'}>Tanmay (Adesh Srivastava)</strong>.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-neutral-300' : 'hover:text-neutral-900'}`}>Privacy policy</a>
            <a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-neutral-300' : 'hover:text-neutral-900'}`}>Cookie notice</a>
            <a href="#" className={`transition-colors ${isPureBlack ? 'hover:text-neutral-300' : 'hover:text-neutral-900'}`}>Terms of service</a>
          </div>
        </div>

      </div>

      {/* Floating Bottom-Right Violet CTA Pill */}
      <a
        href="#studio"
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full font-bold text-xs bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Talk to Voice Agent</span>
      </a>
    </footer>
  );
};
