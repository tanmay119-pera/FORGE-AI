export const DEFAULT_ELEVENLABS_VOICE_ID = 'MwUMLXurEzSN7bIfIdXF';
export const DEFAULT_ELEVENLABS_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ELEVENLABS_API_KEY) || 'sk_ac29c3fefeff533dbc93eba51560800b5f705b0f71804240';

export class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;
  private currentAudio: HTMLAudioElement | null = null;
  private isCommunityVoiceBlocked: boolean = false;

  constructor() {
    this.apiKey = (typeof window !== 'undefined' && localStorage.getItem('forge_elevenlabs_key')) || DEFAULT_ELEVENLABS_KEY;
    this.voiceId = (typeof window !== 'undefined' && localStorage.getItem('forge_elevenlabs_voice_id')) || DEFAULT_ELEVENLABS_VOICE_ID;
  }

  public setApiKey(key: string) {
    this.apiKey = key.trim();
    this.isCommunityVoiceBlocked = false; // Reset to allow re-testing
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_elevenlabs_key', this.apiKey);
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setVoiceId(id: string) {
    this.voiceId = id.trim() || DEFAULT_ELEVENLABS_VOICE_ID;
    this.isCommunityVoiceBlocked = false; // Reset when voice changed
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_elevenlabs_voice_id', this.voiceId);
    }
  }

  public getVoiceId(): string {
    return this.voiceId || DEFAULT_ELEVENLABS_VOICE_ID;
  }

  public stopSpeaking() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  public isPlaying(): boolean {
    return Boolean(this.currentAudio && !this.currentAudio.paused);
  }

  public async speak(text: string): Promise<boolean> {
    const key = this.apiKey || DEFAULT_ELEVENLABS_KEY;
    if (!key) {
      return false; // Fall back to browser Web Speech API
    }

    try {
      this.stopSpeaking();

      let targetVoice = this.voiceId || DEFAULT_ELEVENLABS_VOICE_ID;
      if (this.isCommunityVoiceBlocked) {
        targetVoice = 'pNInz6obpgDQGcFmaJgB';
      }

      // 1. Send speech generation request
      let response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': key
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        })
      });

      // 2. If ElevenLabs blocks community library voices on free tier (HTTP 402/403/payment_required),
      // seamlessly use ElevenLabs official executive voice (Adam - pNInz6obpgDQGcFmaJgB) and cache state!
      if (!response.ok && (response.status === 402 || response.status === 403) && targetVoice !== 'pNInz6obpgDQGcFmaJgB') {
        console.info(`Voice ${targetVoice} requires paid ElevenLabs plan. Switching to official ElevenLabs executive voice.`);
        this.isCommunityVoiceBlocked = true;
        response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': key
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8
            }
          })
        });
      }

      if (!response.ok) {
        console.warn(`ElevenLabs TTS status ${response.status}. Falling back to browser speech synthesis.`);
        return false;
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      return new Promise<boolean>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve(true);
        };
        audio.onerror = (e) => {
          console.warn('ElevenLabs audio playback error:', e);
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve(false);
        };
        audio.play().catch((err) => {
          console.warn('Audio play error:', err);
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve(false);
        });
      });
    } catch (err) {
      console.warn('ElevenLabs network error:', err);
      return false;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
