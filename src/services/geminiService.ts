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
  private conversationHistory: Array<{ role: 'user' | 'model'; parts: any[] }> = [];

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

  public clearHistory() {
    this.conversationHistory = [];
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

CORE KNOWLEDGE & ARCHITECTURE:
- Forge connects real-time conversational voice intelligence with real-world tool execution using the Model Context Protocol (MCP).
- Dual Intelligence Engines:
  * Forge P1: Rapid everyday velocity, sub-25ms voice conversations & single-turn execution.
  * Forge P2: Deep multi-step reasoning, chained cross-service plans & high-precision execution.
- Real-World Tool Suite:
  1. forge_basics: Explains Forge architecture, real-world capabilities, and live commands. Call this whenever asked "tell me the basics", "how do you work?", "what can you do?", or "explain Forge".
  2. cab_dispatch: Searches live 5-tier Uber options (Uber Auto, UberGo, Premier, UberXL, Uber Black) with Google Maps routing, distance, duration, fares, verified drivers, and OTP PIN.
  3. transit_tracker: Checks real-time train status (Vande Bharat, Shatabdi, Rajdhani, Gatimaan, Tejas) with current speed, next station, and platforms.
  4. flight_tracker: Tracks live airport flights (IndiGo, Air India, Emirates), terminal gates, security wait times, and baggage belts.
  5. calendar_sync: Syncs reminders and meetings on Google Calendar with Meet links and buffers.
  6. local_pricing: Instant local store pricing comparison across Blinkit (8m), Zepto (10m), Swiggy Instamart, and Amazon.

CRITICAL BASICS & OVERVIEW RULES:
- When asked "tell me the basics", "explain how this works", "what are your features?", or "give me an overview":
  IMMEDIATELY call the forge_basics tool with topic "overview"!
  In your spoken response, highlight Forge's sub-25ms voice, live MCP tool execution, and suggest 2 quick sample commands to try.

CRITICAL CAB & RIDESHARE RULES:
- When the user asks to book a cab, hail a ride, get an Uber or taxi (e.g., "I want to book a cab", "Book a cab", "Call me a taxi", "Get me an Uber"):
  1. If the user HAS NOT specified BOTH their pickup location AND destination:
     DO NOT call cab_dispatch yet!
     Instead, directly ask: "Where are you right now, and where would you like to go?"
  2. If the user gave only destination (e.g., "Take me to Airport"), ask for pickup: "Understood, heading to the airport. Where should the driver pick you up?"
  3. If the user gave only pickup (e.g., "I am at Cyber Hub"), ask for destination: "Got it. Where are you heading?"
  4. Once you have BOTH pickup and destination locations (either in a single turn or after clarification):
     IMMEDIATELY call the cab_dispatch tool with pickup and destination.
  5. After cab_dispatch returns, summarize the Uber options (UberGo, Premier, UberXL, and Auto) with prices and ETAs, and confirm the best match.

Keep your spoken responses executive, concise (1-2 sentences max), crisp, professional, and confident.`;

    // Append to conversation history (keep max 10 turns)
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: this.conversationHistory,
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

      // Record function call and function response into conversation history
      this.conversationHistory.push({
        role: 'model',
        parts: [functionCallPart]
      });
      this.conversationHistory.push({
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: toolName,
              response: { result: toolResult }
            }
          }
        ]
      });

      // Now send the tool result back to Gemini for final natural speech synthesis
      const followUpBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: this.conversationHistory
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
          this.conversationHistory.push({
            role: 'model',
            parts: [{ text: finalText }]
          });
          onMCPLog('server_to_client', 'llm/gemini_response', { text: finalText });
          return finalText;
        }
      }

      // Fallback concise speech
      let fallbackSpeech = '';
      if (toolName === 'cab_dispatch') {
        fallbackSpeech = `Uber options found: UberGo is ${toolResult.fareEstimate} arriving in ${toolResult.etaMinutes} mins. Driver Rajesh is en route with PIN ${toolResult.otp}.`;
      } else if (toolName === 'transit_tracker') {
        fallbackSpeech = `${toolResult.trainName} is running on time at ${toolResult.platform}. Departure is ${toolResult.scheduledDeparture}.`;
      } else if (toolName === 'flight_tracker') {
        fallbackSpeech = `${toolResult.airline} flight ${toolResult.flightNumber} to ${toolResult.destination} is ${toolResult.status} at ${toolResult.terminal}, Gate ${toolResult.gate}. Security wait is ${toolResult.securityWaitMins} mins.`;
      } else if (toolName === 'calendar_sync') {
        fallbackSpeech = `Synced to your calendar: ${toolResult.title} at ${toolResult.startTime}.`;
      } else {
        fallbackSpeech = `Found ${toolResult.product} on ${toolResult.cheapestVendor} for ${toolResult.lowestPrice}.`;
      }
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: fallbackSpeech }]
      });
      return fallbackSpeech;
    }

    // Direct text reply from Gemini (e.g. asking "Where are you right now and where would you like to go?")
    const textReply = parts.find((p: any) => p.text)?.text || 'I have processed your request.';
    this.conversationHistory.push({
      role: 'model',
      parts: [{ text: textReply }]
    });
    onMCPLog('server_to_client', 'llm/gemini_response', { text: textReply }, elapsed);
    return textReply;
  }
}

export const geminiService = new GeminiService();
