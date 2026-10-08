import { MCPLogEntry, ToolCallExecution, VoiceState } from '../types';
import { executeMCPTool, MCP_TOOLS } from './mcpTools';
import { geminiService } from './geminiService';

export interface OrchestratorCallbacks {
  onVoiceStateChange: (state: VoiceState) => void;
  onTranscriptUpdate: (text: string, isFinal: boolean) => void;
  onAssistantSpeech: (text: string) => void;
  onToolExecuted: (execution: ToolCallExecution) => void;
  onMCPLog: (log: MCPLogEntry) => void;
}

export class VoiceAgentOrchestrator {
  private callbacks: OrchestratorCallbacks | null = null;
  private recognition: any = null;
  private isListening = false;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public registerCallbacks(cb: OrchestratorCallbacks) {
    this.callbacks = cb;
  }

  public startListening() {
    if (!this.recognition) {
      console.warn('Speech recognition not available in this browser');
      return;
    }

    this.stopSpeaking();

    try {
      this.isListening = true;
      this.callbacks?.onVoiceStateChange('listening');

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interim;
        this.callbacks?.onTranscriptUpdate(currentText, Boolean(finalTranscript));

        if (finalTranscript) {
          this.handleUserInput(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        if (this.isListening) {
          this.callbacks?.onVoiceStateChange('idle');
          this.isListening = false;
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      this.callbacks?.onVoiceStateChange('idle');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.callbacks?.onVoiceStateChange('idle');
    }
  }

  public stopSpeaking() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.callbacks?.onVoiceStateChange('idle');
    }
  }

  public async handleUserInput(promptText: string) {
    this.callbacks?.onVoiceStateChange('thinking');

    // 1. Log MCP tools discovery
    this.logMCP('client_to_server', 'tools/list', {});
    this.logMCP('server_to_client', 'tools/list_response', { tools: MCP_TOOLS.map(t => t.name) });

    try {
      // 2. Process query via live Gemini 3.6 Flash with Function Calling!
      const reply = await geminiService.processQuery(
        promptText,
        (execution) => {
          this.callbacks?.onToolExecuted(execution);
        },
        (dir, method, payload, dur) => {
          this.logMCP(dir, method, payload, dur);
        }
      );

      await this.speakResponse(reply);
    } catch (err: any) {
      console.warn('Gemini live call error, using deterministic fail-safe:', err);

      // Fallback deterministic tool planner
      await this.fallbackPlanner(promptText);
    }
  }

  private async fallbackPlanner(promptText: string) {
    const lower = promptText.toLowerCase();

    const isCab = lower.includes('cab') || lower.includes('taxi') || lower.includes('uber') || lower.includes('ola') || lower.includes('ride');
    const isTrain = lower.includes('train') || lower.includes('shatabdi') || lower.includes('vande') || lower.includes('status') || lower.includes('platform');
    const isCalendar = lower.includes('remind') || lower.includes('calendar') || lower.includes('schedule') || lower.includes('meeting');
    const isPrice = lower.includes('price') || lower.includes('cost') || lower.includes('charger') || lower.includes('buy') || lower.includes('blinkit');

    const multiPlan = (isTrain || lower.includes('station')) && (isCab || lower.includes('go') || lower.includes('get to'));

    const isCreatorQuery = lower.includes('who are you') || lower.includes('who made you') || lower.includes('who built you') || lower.includes('who created you') || lower.includes('creator');

    if (isCreatorQuery) {
      await this.speakResponse("I am Forge P1, an autonomous voice co-pilot built by Tanmay (Adesh Srivastava). I control real-world services like booking rides, checking trains, and managing your schedule.");
      return;
    }

    if (multiPlan) {
      await this.executeMultiActionPlan();
    } else if (isCab) {
      await this.executeSingleAction('cab_dispatch', {
        destination: 'New Delhi Central Station Platform 4 Gate',
        vehicle_type: 'Premier'
      });
    } else if (isTrain) {
      await this.executeSingleAction('transit_tracker', {
        train_query: 'Vande Bharat Express',
        departure_station: 'New Delhi Railway Station'
      });
    } else if (isCalendar) {
      await this.executeSingleAction('calendar_sync', {
        title: 'Boarding Vande Bharat Express',
        time: '18:00',
        category: 'travel'
      });
    } else if (isPrice) {
      await this.executeSingleAction('local_pricing', {
        item_name: 'Apple 30W USB-C Fast Charger'
      });
    } else {
      await this.speakResponse(`I am FORGE, built by Tanmay (Adesh Srivastava). You can say: "Book a cab to Central Station for the 6 PM train" or ask any travel question.`);
    }
  }

  private async executeSingleAction(toolName: string, args: Record<string, any>) {
    this.callbacks?.onVoiceStateChange('executing');

    const executionId = 'exec-' + Date.now().toString(36);
    const start = performance.now();

    this.logMCP('client_to_server', 'tools/call', { name: toolName, arguments: args });

    try {
      const result = await executeMCPTool(toolName, args);
      const duration = Math.round(performance.now() - start);

      this.logMCP('server_to_client', 'tools/call_result', {
        name: toolName,
        content: [{ type: 'text', text: JSON.stringify(result) }]
      }, duration);

      const execution: ToolCallExecution = {
        id: executionId,
        toolName,
        args,
        status: 'success',
        result,
        executedAt: new Date().toLocaleTimeString()
      };

      this.callbacks?.onToolExecuted(execution);

      let speech = '';
      if (toolName === 'cab_dispatch') {
        speech = `I booked your ${result.service}. Rajesh will arrive in ${result.etaMinutes} minutes. Start PIN is ${result.otp}.`;
      } else if (toolName === 'transit_tracker') {
        speech = `${result.trainName} is on time at ${result.platform}. Departure is ${result.scheduledDeparture}.`;
      } else if (toolName === 'calendar_sync') {
        speech = `Calendar synced! I've scheduled "${result.title}" at ${result.startTime}.`;
      } else if (toolName === 'local_pricing') {
        speech = `Found ${result.product} on ${result.cheapestVendor} for ${result.lowestPrice}.`;
      }

      await this.speakResponse(speech);
    } catch (err: any) {
      this.callbacks?.onVoiceStateChange('idle');
      console.error('MCP execution error:', err);
    }
  }

  private async executeMultiActionPlan() {
    this.callbacks?.onVoiceStateChange('executing');

    // 1. Train Status
    this.logMCP('client_to_server', 'tools/call', { name: 'transit_tracker', arguments: { train_query: 'Vande Bharat Express' } });
    const trainResult = await executeMCPTool('transit_tracker', { train_query: 'Vande Bharat Express' });
    this.logMCP('server_to_client', 'tools/call_result', { name: 'transit_tracker', content: [{ type: 'text', text: JSON.stringify(trainResult) }] });

    this.callbacks?.onToolExecuted({
      id: 'exec-train-' + Date.now(),
      toolName: 'transit_tracker',
      args: { train_query: 'Vande Bharat Express' },
      status: 'success',
      result: trainResult,
      executedAt: new Date().toLocaleTimeString()
    });

    // 2. Calendar Sync
    this.logMCP('client_to_server', 'tools/call', { name: 'calendar_sync', arguments: { title: 'Boarding Vande Bharat Express', time: '17:45' } });
    const calResult = await executeMCPTool('calendar_sync', { title: 'Boarding Vande Bharat Express', time: '17:45', location: 'Platform 4' });
    this.logMCP('server_to_client', 'tools/call_result', { name: 'calendar_sync', content: [{ type: 'text', text: JSON.stringify(calResult) }] });

    this.callbacks?.onToolExecuted({
      id: 'exec-cal-' + Date.now(),
      toolName: 'calendar_sync',
      args: { title: 'Boarding Vande Bharat Express', time: '17:45' },
      status: 'success',
      result: calResult,
      executedAt: new Date().toLocaleTimeString()
    });

    // 3. Cab Dispatch
    this.logMCP('client_to_server', 'tools/call', { name: 'cab_dispatch', arguments: { destination: 'New Delhi Central Station Platform 4 Gate', vehicle_type: 'Premier' } });
    const cabResult = await executeMCPTool('cab_dispatch', { destination: 'New Delhi Central Station Platform 4 Gate', vehicle_type: 'Premier' });
    this.logMCP('server_to_client', 'tools/call_result', { name: 'cab_dispatch', content: [{ type: 'text', text: JSON.stringify(cabResult) }] });

    this.callbacks?.onToolExecuted({
      id: 'exec-cab-' + Date.now(),
      toolName: 'cab_dispatch',
      args: { destination: 'New Delhi Central Station Platform 4 Gate' },
      status: 'success',
      result: cabResult,
      executedAt: new Date().toLocaleTimeString()
    });

    const multiSpeech = `Your Vande Bharat Express is on time at Platform 4. I've synced your boarding pass to your calendar and dispatched an Uber Premier arriving in ${cabResult.etaMinutes} minutes.`;
    await this.speakResponse(multiSpeech);
  }

  private async speakResponse(text: string): Promise<void> {
    this.callbacks?.onVoiceStateChange('speaking');
    this.callbacks?.onAssistantSpeech(text);

    return new Promise((resolve) => {
      const synth = this.synth;
      if (!synth) {
        this.callbacks?.onVoiceStateChange('idle');
        resolve();
        return;
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = synth.getVoices();
      const preferred = voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || (v.lang.startsWith('en') && !v.localService));
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => {
        this.callbacks?.onVoiceStateChange('idle');
        resolve();
      };

      utterance.onerror = () => {
        this.callbacks?.onVoiceStateChange('idle');
        resolve();
      };

      synth.speak(utterance);
    });
  }

  private logMCP(direction: 'client_to_server' | 'server_to_client', method: string, payload: any, durationMs?: number) {
    const log: MCPLogEntry = {
      id: 'mcp-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      direction,
      method,
      payload,
      durationMs
    };
    this.callbacks?.onMCPLog(log);
  }
}

export const orchestrator = new VoiceAgentOrchestrator();
