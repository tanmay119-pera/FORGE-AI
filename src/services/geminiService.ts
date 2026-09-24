import { MCP_TOOLS, executeMCPTool } from './mcpTools';
import { ToolCallExecution } from '../types';

export const DEFAULT_GEMINI_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';
const GEMINI_MODEL = 'gemini-2.0-flash';

// Convert MCP Tool Definitions into Gemini Tool Declarations format
const geminiFunctionDeclarations = MCP_TOOLS.map(tool => ({
  name: tool.name,
  description: tool.description,
  parameters: tool.parameters
}));

export class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = (typeof window !== 'undefined' && localStorage.getItem('forge_gemini_key')) || DEFAULT_GEMINI_KEY;
  }

  public setApiKey(key: string) {
    this.apiKey = key.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_gemini_key', this.apiKey);
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public async processQuery(
    prompt: string,
    onToolExecute: (execution: ToolCallExecution) => void,
    onMCPLog: (direction: 'client_to_server' | 'server_to_client', method: string, payload: any, durationMs?: number) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is missing.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${this.apiKey}`;

    const systemPrompt = `You are Forge P1, an executive autonomous voice and action co-pilot built by Tanmay (Adesh Srivastava).
When asked who you are, who created you, who made you, or what you are, ALWAYS state that you are Forge P1, built by Tanmay (Adesh Srivastava). Never claim to be made by Gemini, Google, or Agora.
You have access to real-time tools for:
1. cab_dispatch: Booking rides and cabs (Uber/Ola).
2. transit_tracker: Checking live trains (e.g. Vande Bharat, Shatabdi, delay, platform).
3. calendar_sync: Syncing reminders and travel schedules on Google Calendar.
4. local_pricing: Looking up instant store prices (Blinkit, Zepto, Amazon).

When a user mentions travel, catching a train, booking a cab, scheduling an event, or comparing prices, ALWAYS call the corresponding function.
If the user gives a multi-action request (e.g. "Book a cab to Central Station for the 6 PM train"), execute the appropriate tools.
Keep your final spoken response concise (1-2 sentences max), crisp, professional, and executive.`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      tools: [
        {
          functionDeclarations: geminiFunctionDeclarations
        }
      ]
    };

    onMCPLog('client_to_server', 'llm/gemini_query', { model: GEMINI_MODEL, prompt });

    const startTime = performance.now();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const elapsed = Math.round(performance.now() - startTime);

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    // Check if Gemini invoked a function call!
    const functionCallPart = parts.find((p: any) => p.functionCall);

    if (functionCallPart && functionCallPart.functionCall) {
      const { name: toolName, args } = functionCallPart.functionCall;

      // Log to MCP inspector
      onMCPLog('client_to_server', 'tools/call', { name: toolName, arguments: args });

      // Execute tool
      const toolStart = performance.now();
      const toolResult = await executeMCPTool(toolName, args);
      const toolDuration = Math.round(performance.now() - toolStart);

      onMCPLog('server_to_client', 'tools/call_result', {
        name: toolName,
        content: [{ type: 'text', text: JSON.stringify(toolResult) }]
      }, toolDuration);

      // Report executed tool to dashboard
      const execution: ToolCallExecution = {
        id: 'exec-' + Date.now().toString(36),
        toolName,
        args,
        status: 'success',
        result: toolResult,
        executedAt: new Date().toLocaleTimeString()
      };
      onToolExecute(execution);

      // Now send the tool result back to Gemini for final natural speech synthesis
      const followUpBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          },
          {
            role: 'model',
            parts: [functionCallPart]
          },
          {
            role: 'user',
            parts: [
              {
                functionResponse: {
                  name: toolName,
                  response: { result: toolResult }
                }
              }
            ]
          }
        ]
      };

      const finalRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followUpBody)
      });

      if (finalRes.ok) {
        const finalData = await finalRes.json();
        const finalText = finalData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (finalText) {
          onMCPLog('server_to_client', 'llm/gemini_response', { text: finalText });
          return finalText;
        }
      }

      // Fallback concise speech
      if (toolName === 'cab_dispatch') {
        return `Your ${toolResult.service} is confirmed. Driver Rajesh arrives in ${toolResult.etaMinutes} minutes. PIN is ${toolResult.otp}.`;
      } else if (toolName === 'transit_tracker') {
        return `${toolResult.trainName} is running on time at ${toolResult.platform}. Departure is ${toolResult.scheduledDeparture}.`;
      } else if (toolName === 'calendar_sync') {
        return `Synced to your calendar: ${toolResult.title} at ${toolResult.startTime}.`;
      } else {
        return `Found ${toolResult.product} on ${toolResult.cheapestVendor} for ${toolResult.lowestPrice}.`;
      }
    }

    // Direct text reply from Gemini
    const textReply = parts.find((p: any) => p.text)?.text || 'I have processed your request.';
    onMCPLog('server_to_client', 'llm/gemini_response', { text: textReply }, elapsed);
    return textReply;
  }
}

export const geminiService = new GeminiService();
