import React, { useState } from 'react';
import { MCPLogEntry, ThemeMode } from '../types';
import { Terminal, ChevronUp, ChevronDown, Check, Copy } from 'lucide-react';

interface MCPInspectorProps {
  logs: MCPLogEntry[];
  theme: ThemeMode;
}

export const MCPInspector: React.FC<MCPInspectorProps> = ({ logs, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isPureBlack = theme === 'dark';

  const copyPayload = (id: string, payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`w-full rounded-2xl transition-all duration-200 overflow-hidden ${
      isPureBlack ? 'bg-[#0a0a0a]' : 'bg-[#f6f6f8] shadow-sm'
    }`}>
      {/* Header bar strictly matching Screenshot 1 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-950/40 text-violet-400 font-mono font-bold">
            &gt;_
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>
                MCP PROTOCOL LIVE INSPECTOR
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-violet-500/15 text-violet-400">
                JSON-RPC 2.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {logs.length} Model Context Protocol RPC events captured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
          <span>{isOpen ? 'Hide Protocol Logs' : 'View Protocol Logs'}</span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Logs Body */}
      {isOpen && (
        <div className={`p-4 border-t max-h-80 overflow-y-auto font-mono text-xs space-y-3 ${
          isPureBlack ? 'border-neutral-900 bg-[#000000]' : 'border-neutral-200 bg-[#ffffff]'
        }`}>
          {logs.length === 0 ? (
            <div className="text-center py-6 text-neutral-500">
              No MCP tool calls dispatched yet. Speak or trigger an action in the studio above to inspect real-time JSON-RPC packets.
            </div>
          ) : (
            logs.map((log) => {
              const isOut = log.direction === 'client_to_server';
              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl text-[11px] ${
                    isPureBlack ? 'bg-[#0d0d0d]' : 'bg-[#f4f4f6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                        isOut
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isOut ? '→ SEND' : '← RECV'}
                      </span>
                      <span className={`font-semibold ${isPureBlack ? 'text-white' : 'text-neutral-900'}`}>
                        {log.method}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
                      {log.durationMs !== undefined && (
                        <span className="text-violet-400 font-bold">{log.durationMs}ms</span>
                      )}
                      <span>{log.timestamp}</span>
                      <button
                        onClick={() => copyPayload(log.id, log.payload)}
                        className="hover:text-white p-1"
                        title="Copy JSON payload"
                      >
                        {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <pre className={`p-2.5 rounded-lg overflow-x-auto text-[10px] leading-relaxed ${
                    isPureBlack ? 'bg-[#000000] text-neutral-300' : 'bg-[#ffffff] text-neutral-800'
                  }`}>
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
