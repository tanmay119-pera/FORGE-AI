import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng';
import { AgoraConfig } from '../types';

export class AgoraVoiceService {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private isConnected = false;
  private volumeInterval: number | null = null;

  public onVolumeChange?: (volume: number) => void;
  public onAgentSpeaking?: (isSpeaking: boolean) => void;
  public onError?: (error: Error) => void;
  public onStateChange?: (state: 'disconnected' | 'connecting' | 'connected') => void;

  constructor() {
    // Disable noisy Agora SDK logs in production demo
    AgoraRTC.setLogLevel(3);
  }

  public async connect(config: AgoraConfig): Promise<boolean> {
    try {
      this.onStateChange?.('connecting');

      // Create Agora RTC client
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Setup remote user events (e.g. conversational voice agent audio)
      this.client.on('user-published', async (user, mediaType) => {
        await this.client?.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          const remoteAudio = user.audioTrack as IRemoteAudioTrack;
          remoteAudio.play();
          this.onAgentSpeaking?.(true);
        }
      });

      this.client.on('user-unpublished', (_user, mediaType) => {
        if (mediaType === 'audio') {
          this.onAgentSpeaking?.(false);
        }
      });

      // Join channel with provided App ID & credentials
      const appId = config.appId.trim();
      const channel = config.channel.trim() || 'agora-voice-copilot';
      const token = config.token?.trim() || null;
      const uid = config.uid || Math.floor(1000 + Math.random() * 9000);

      if (appId) {
        await this.client.join(appId, channel, token, uid);
      }

      // Create local microphone audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'speech_standard',
        AEC: true, // Acoustic Echo Cancellation
        ANS: true  // Automatic Noise Suppression
      });

      if (appId && this.client) {
        await this.client.publish([this.localAudioTrack]);
      }

      this.isConnected = true;
      this.onStateChange?.('connected');

      // Monitor audio volume level
      this.startVolumeMonitoring();

      return true;
    } catch (err: any) {
      console.warn('Agora connection warning:', err);
      this.onStateChange?.('disconnected');
      this.onError?.(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }

  private startVolumeMonitoring() {
    if (this.volumeInterval) clearInterval(this.volumeInterval);

    this.volumeInterval = window.setInterval(() => {
      if (this.localAudioTrack) {
        // Returns float between 0 and 1
        const vol = this.localAudioTrack.getVolumeLevel();
        this.onVolumeChange?.(vol);
      }
    }, 50);
  }

  public async disconnect(): Promise<void> {
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }

    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }

    if (this.client) {
      await this.client.leave();
      this.client = null;
    }

    this.isConnected = false;
    this.onStateChange?.('disconnected');
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const agoraVoiceService = new AgoraVoiceService();
