import { MCP_TOOLS, executeMCPTool } from './mcpTools';
import { ToolCallExecution, UserProfile, PromptTuningPreset } from '../types';
import { aiTrainingService } from './aiTrainingService';

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
  private tuningPreset: PromptTuningPreset = {
    id: 'preset-executive',
    name: 'Executive Deterministic',
    temperature: 0.15,
    topP: 0.85,
    topK: 40,
    reasoningDepth: 'balanced',
    description: 'High-precision tool invocation with zero hallucinations and crisp verbal conciseness'
  };

  constructor() {
    this.apiKey = (typeof window !== 'undefined' && localStorage.getItem('forge_gemini_key')) || DEFAULT_GEMINI_KEY;
    if (typeof window !== 'undefined') {
      const rawUser = localStorage.getItem('forge_user');
      if (rawUser) {
        try {
          this.userContext = JSON.parse(rawUser);
        } catch (e) {}
      }
      const rawPreset = localStorage.getItem('forge_tuning_preset');
      if (rawPreset) {
        try {
          this.tuningPreset = { ...this.tuningPreset, ...JSON.parse(rawPreset) };
        } catch (e) {}
      }
    }
  }

  public setTuningPreset(preset: Partial<PromptTuningPreset>) {
    this.tuningPreset = { ...this.tuningPreset, ...preset };
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_tuning_preset', JSON.stringify(this.tuningPreset));
    }
  }

  public getTuningPreset(): PromptTuningPreset {
    return { ...this.tuningPreset };
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

    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const timeOfDay = currentHour < 12 ? 'Morning' : currentHour < 17 ? 'Afternoon' : currentHour < 21 ? 'Evening' : 'Night';
    const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const fewShotContext = aiTrainingService.buildFewShotPromptContext(prompt);

    const systemPrompt = `You are Forge P1, an executive autonomous voice and action co-pilot built by Tanmay (Adesh Srivastava).
When asked who you are, who created you, who made you, or what you are, ALWAYS state that you are Forge P1, built by Tanmay (Adesh Srivastava). Never claim to be made by Gemini, Google, or Agora.

CURRENT TEMPORAL & DIURNAL CONTEXT:
- Date: ${formattedDate}
- Local Time: ${formattedTime} (${timeOfDay})
- Commute Direction Context: ${currentHour < 14 ? 'Morning Inbound Commute (Heading toward Work)' : 'Evening Outbound Commute (Heading toward Home)'}

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
  8. weather_radar: Scans live hyper-local temperature, precipitation probability, humidity, and travel advisory buffers.
  9. hotel_booking: Discovers executive & luxury stays, pricing per night, corporate amenities, and distance to transit centers.
  10. currency_converter: Calculates real-time FX conversions across USD, INR, EUR, GBP, AED, SGD with fee estimates.
  11. smart_checklist: Creates dynamic packing checklists tailored to destination weather, duration, and corporate travel.
  12. coach_position: Maps exact railway train rake layout, engine-to-coach positions, and optimal platform boarding gates.
  13. smart_concierge: Synthesizes an executive daily briefing, multi-modal commute routes, agenda items, and proactive follow-up actions.

FORGE P2 MULTI-TOOL CHAINED REASONING PRINCIPLES:
- For complex multi-intent requests, analyze dependencies and proactively coordinate:
  * When asked for daily summary, morning check-in, or "what should I do today?", call smart_concierge.
  * When checking a flight or train for a distant city, cross-reference destination weather or hotel accommodations.
  * When planning overseas travel, pair currency conversion with packing checklist essentials.
  * When boarding trains, pair transit status with coach position mapping for zero-confusion boarding.



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

CRITICAL WEATHER, TRAVEL & LOGISTICS COORDINATION RULES:
1. WEATHER RADAR & DEPARTURE BUFFERS:
   - When asked about weather ("How is the weather in Mumbai?", "Is it raining in Delhi?", "Weather forecast"):
     Call weather_radar with the requested city.
   - Proactive Safety: If precipitation is detected along a transit corridor, proactively advise an extra 15-20 minute departure buffer.
2. HOTEL & ACCOMMODATION:
   - When asked for places to stay ("Find a hotel in Mumbai BKC", "Book hotel near airport", "Luxury stays"):
     Call hotel_booking with destination and preference.
3. CURRENCY CONVERSION:
   - When asked about currency or exchange ("Convert 500 dollars to rupees", "What is 1000 EUR in INR?"):
     Call currency_converter with amount, from_currency, and to_currency.
4. PACKING & CHECKLIST:
   - When asked what to pack ("What should I pack for Mumbai?", "Checklist for Kashmir trip"):
     Call smart_checklist with destination and trip_type.
5. TRAIN COACH PLATFORM MAPPING:
   - When asked "Where is coach C4?", "Find my coach on Shatabdi", "Coach position for 12004":
     Call coach_position with train_query and coach_code.
6. EXECUTIVE CONCIERGE & DAILY BRIEFING:
   - When asked "Give me my daily briefing", "What should I do today?", "Morning briefing", "Executive overview", or "Concierge check-in":
     Call smart_concierge immediately!

PHONETIC ERROR RESILIENCE & TRANSIT ACRONYM REASONING:
- Real-time voice transcripts often contain phonetic noise or speech-to-text slips:
  * "Uba", "Oober", "Ubr" refer to Uber cabs -> call cab_dispatch.
  * "Blink it", "Blinkin", "Blinked" refer to Blinkit store -> call local_pricing with store="Blinkit".
  * "Insta mart" refers to Swiggy Instamart -> call local_pricing.
  * "Vande barat", "Vande bharath", "Vande bhatat" refer to Vande Bharat train -> call transit_tracker with train_query="Vande Bharat".
  * "Rajdhani exp", "Shatabdi exp", "Durgiana exp" refer to corresponding Express trains -> call transit_tracker or coach_position.
  * Acronyms like "PNR", "ETA", "FX", "T3" (Terminal 3), "BKC" (Bandra Kurla Complex) should be resolved without asking for clarification.

MULTI-TURN CONVERSATIONAL DISAMBIGUATION & ENTITY RESOLUTION:
- When the user asks a terse follow-up question or pronoun-heavy query:
  * "Book that one" / "Confirm it" -> Refer to the specific vehicle or option recommended in the immediate prior turn.
  * "What about tomorrow?" -> Maintain the current entity (train, flight, weather city) and re-query with tomorrow's temporal anchor.
  * "Check the return route" -> Reverse the origin and destination coordinates/cities from the previous transit or cab query.
  * "How much is that in dollars/euros?" -> Extract the Indian Rupee fare from the previous tool response and call currency_converter.
  * "Is it on time?" / "Any delays?" -> Check status for the train number or flight code actively held in conversation context.


${fewShotContext ? `${fewShotContext}\n\n` : ''}Keep your spoken responses executive, concise (1-2 sentences max), crisp, professional, and confident.`;




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
      ],
      generationConfig: {
        temperature: this.tuningPreset.temperature,
        topP: this.tuningPreset.topP,
        topK: this.tuningPreset.topK,
        maxOutputTokens: 1024
      }
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
      } else if (toolName === 'weather_radar') {
        fallbackSpeech = `In ${toolResult.city}, it is currently ${toolResult.temperature} and ${toolResult.condition} with ${toolResult.rainChance} chance of rain.`;
      } else if (toolName === 'hotel_booking') {
        fallbackSpeech = `Top accommodation for ${toolResult.destination} is ${toolResult.recommendedHotel} starting at ${toolResult.hotels[0]?.pricePerNight}.`;
      } else if (toolName === 'currency_converter') {
        fallbackSpeech = `${toolResult.formattedResult}. Mid-market rate is ${toolResult.exchangeRate}.`;
      } else if (toolName === 'smart_checklist') {
        fallbackSpeech = `Prepared ${toolResult.totalItems}-item ${toolResult.tripType} packing list for ${toolResult.destination}. ${toolResult.proactiveTip}`;
      } else if (toolName === 'coach_position') {
        fallbackSpeech = `${toolResult.trainName}: Coach ${toolResult.passengerCoach} is at ${toolResult.platform}. ${toolResult.walkingTip}`;
      } else if (toolName === 'smart_concierge') {
        fallbackSpeech = `${toolResult.greeting} Your commute to ${toolResult.commuteRecommendation.destination} is ${toolResult.commuteRecommendation.trafficStatus}. Weather is ${toolResult.weatherHighlight.temp} with ${toolResult.weatherHighlight.condition}.`;
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

  public getFollowUpSuggestions(toolName?: string, result?: any): string[] {
    if (toolName === 'smart_concierge') {
      return result?.suggestedActionPills || [
        'Take me to work in an Uber Premier',
        'Check Vande Bharat live train status',
        'Check live weather radar for Mumbai'
      ];
    }
    if (toolName === 'cab_dispatch') {
      return [
        'Schedule arrival meeting on Google Calendar',
        'Check train status at destination',
        'Show driver tracking PIN'
      ];
    }
    if (toolName === 'transit_tracker') {
      return [
        'Where is coach C4 on this train?',
        'Book an Uber cab to the station',
        'Schedule boarding reminder on Calendar'
      ];
    }
    if (toolName === 'flight_tracker') {
      return [
        'Check destination weather radar',
        'Find executive hotels near airport',
        'Create packing checklist'
      ];
    }
    if (toolName === 'weather_radar') {
      return [
        'Book an Uber cab with extra buffer',
        'Find executive hotels in this city',
        'Generate packing checklist for this weather'
      ];
    }
    if (toolName === 'hotel_booking') {
      return [
        'Convert 500 dollars to rupees',
        'Check weather forecast for this stay',
        'Book Uber ride to hotel'
      ];
    }
    if (toolName === 'smart_checklist') {
      return [
        'Check destination weather radar',
        'Find executive hotels',
        'Convert travel currency'
      ];
    }
    if (toolName === 'coach_position') {
      return [
        'Check Vande Bharat live train status',
        'Book an Uber Premier to Station Gate 2',
        'Schedule boarding reminder'
      ];
    }
    if (toolName === 'forge_basics') {
      return [
        'Give me my executive daily briefing',
        'Take me home in an Uber Premier',
        'Check Vande Bharat train status'
      ];
    }
    return [
      'Give me my executive daily briefing',
      'Tell me the basics of Forge',
      'Check Vande Bharat live train status'
    ];
  }
}


export const geminiService = new GeminiService();
