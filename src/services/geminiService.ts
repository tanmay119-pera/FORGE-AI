import { MCP_TOOLS, executeMCPTool } from './mcpTools';
import { ToolCallExecution, UserProfile } from '../types';

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
  private userContext: UserProfile | null = null;
  private conversationHistory: Array<{ role: 'user' | 'model'; parts: any[] }> = [];

  constructor() {
    this.apiKey = (typeof window !== 'undefined' && localStorage.getItem('forge_gemini_key')) || DEFAULT_GEMINI_KEY;
    if (typeof window !== 'undefined') {
      const rawUser = localStorage.getItem('forge_user');
      if (rawUser) {
        try {
          this.userContext = JSON.parse(rawUser);
        } catch (e) {}
      }
    }
  }

  public setUserContext(user: UserProfile | null) {
    this.userContext = user;
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('forge_user', JSON.stringify(user));
    }
  }

  public getUserContext(): UserProfile | null {
    return this.userContext;
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

    const activeUser: UserProfile = this.userContext || {
      name: 'Tanmay (Adesh Srivastava)',
      email: 'forge.ai@gmail.com',
      avatar: '',
      provider: 'google',
      tier: 'Executive Diamond',
      homeAddress: 'Connaught Place, New Delhi',
      workAddress: 'Cyber Hub Building 10, Gurugram',
      preferredRideService: 'Premier',
      frequentDestinations: ['Indira Gandhi Airport Terminal 3', 'Central Railway Station Platform 4'],
      preferences: { quietRide: true, autoConfirmThreshold: '₹800' }
    };
    const firstName = activeUser.name ? activeUser.name.split(' ')[0] : 'Sir';

    const systemPrompt = `You are Forge P1, an executive autonomous voice and action co-pilot built by Tanmay (Adesh Srivastava).
When asked who you are, who created you, who made you, or what you are, ALWAYS state that you are Forge P1, built by Tanmay (Adesh Srivastava). Never claim to be made by Gemini, Google, or Agora.

ACTIVE USER PERSONALIZATION PROFILE (USER-BASED CONTEXT):
- Active User Name: ${activeUser.name} (${firstName})
- User Email: ${activeUser.email}
- Account Tier: ${activeUser.tier || 'Executive Diamond'}
- Saved Home Location: ${activeUser.homeAddress || 'Connaught Place, New Delhi'}
- Saved Work Location: ${activeUser.workAddress || 'Cyber Hub Building 10, Gurugram'}
- Preferred Ride Fleet: ${activeUser.preferredRideService || 'Premier'}
- Frequent Routes: ${(activeUser.frequentDestinations || ['Indira Gandhi Airport Terminal 3', 'Central Railway Station Platform 4']).join(', ')}

CORE KNOWLEDGE & ARCHITECTURE:
- Forge connects real-time conversational voice intelligence with real-world tool execution using the Model Context Protocol (MCP).
- Dual Intelligence Engines:
  * Forge P1: Rapid everyday velocity, sub-25ms voice conversations & single-turn execution.
  * Forge P2: Deep multi-step reasoning, chained cross-service plans & high-precision execution.
- Real-World Tool Suite:
  1. user_memory: Recalls and updates saved personal preferences, home/work addresses, and ride fleet choices for ${firstName}. Call this whenever asked "what is my home address?", "who am I?", "remember my address...", or "show my profile".
  2. forge_basics: Explains Forge architecture, real-world capabilities, and live commands. Call this whenever asked "tell me the basics", "how do you work?", "what can you do?", or "explain Forge".
  3. cab_dispatch: Searches live 5-tier Uber options (Uber Auto, UberGo, Premier, UberXL, Uber Black) with Google Maps routing, distance, duration, fares, verified drivers, and OTP PIN.
  4. transit_tracker: Checks real-time train status (Vande Bharat, Shatabdi, Rajdhani, Gatimaan, Tejas) with current speed, next station, and platforms.
  5. flight_tracker: Tracks live airport flights (IndiGo, Air India, Emirates), terminal gates, security wait times, and baggage belts.
  6. calendar_sync: Syncs reminders and meetings on Google Calendar with Meet links and buffers.
  7. local_pricing: Instant local store pricing comparison across Blinkit (8m), Zepto (10m), Swiggy Instamart, and Amazon.

CRITICAL USER PERSONALIZATION & MEMORY RULES:
1. USER-BASED ADDRESS RESOLUTION:
   - If ${firstName} asks for a ride home ("Take me home", "Book a cab to my house", "Ride home"), AUTOMATICALLY use their Saved Home Location ("${activeUser.homeAddress || 'Connaught Place, New Delhi'}") as the destination!
   - If ${firstName} asks for a ride to office ("Take me to work", "Ride to office", "Cab to Cyber Hub"), AUTOMATICALLY use their Saved Work Location ("${activeUser.workAddress || 'Cyber Hub Building 10, Gurugram'}") as the destination!
   - If ${firstName} requests an Uber without specifying pickup, suggest or use their Saved Home Location as pickup ("${activeUser.homeAddress || 'Connaught Place'}").
   - Always prioritize ${firstName}'s preferred ride tier ("${activeUser.preferredRideService || 'Premier'}").
2. PROFILE & MEMORY UPDATES:
   - When asked to remember an address or preference (e.g. "Remember my home address is...", "Set work location to...", "I prefer Uber Black"), IMMEDIATELY call the user_memory tool with action="set"!
   - When asked "What are my saved locations?", "Who am I?", or "What do you know about me?", IMMEDIATELY call the user_memory tool with action="get"!

CRITICAL BASICS & OVERVIEW RULES:
- When asked "tell me the basics", "explain how this works", "what are your features?", or "give me an overview":
  IMMEDIATELY call the forge_basics tool with topic "overview"!
  In your spoken response, highlight Forge's sub-25ms voice, live MCP tool execution, and suggest 2 quick sample commands to try.

CRITICAL CAB & RIDESHARE RULES:
- When the user asks to book a cab, hail a ride, get an Uber or taxi (e.g., "I want to book a cab", "Book a cab", "Call me a taxi", "Get me an Uber"):
  1. If the user HAS NOT specified BOTH their pickup location AND destination (and no saved home/work destination was implied):
     DO NOT call cab_dispatch yet!
     Instead, directly ask: "Where are you right now, and where would you like to go?"
  2. If the user gave only destination (e.g., "Take me to Airport"), ask for pickup or confirm home: "Understood, heading to the airport. Should I pick you up from your saved location at ${activeUser.homeAddress || 'Connaught Place'}?"
  3. If the user gave only pickup (e.g., "I am at Cyber Hub"), ask for destination: "Got it. Where are you heading?"
  4. Once you have BOTH pickup and destination locations (either in a single turn or after clarification):
     IMMEDIATELY call the cab_dispatch tool with pickup, destination, and vehicle_type="${activeUser.preferredRideService || 'Premier'}".
  5. After cab_dispatch returns, summarize the Uber options with prices and ETAs, and confirm the best match.

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
      if (toolName === 'user_memory') {
        fallbackSpeech = toolResult.message || `Retrieved personalized memory.`;
      } else if (toolName === 'cab_dispatch') {
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
