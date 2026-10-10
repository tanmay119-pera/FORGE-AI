export interface AudioProfile {
  name: string;
  sampleRateHz: number;
  channels: number;
  frameDurationMs: number;
  vadThreshold: number;
}

export const AUDIO_PROFILES: Record<string, AudioProfile> = {
  realtimeVoice: {
    name: "Realtime Copilot Voice",
    sampleRateHz: 16000,
    channels: 1,
    frameDurationMs: 20,
    vadThreshold: 0.02,
  },
  studioPlayback: {
    name: "Studio Neural TTS",
    sampleRateHz: 24000,
    channels: 1,
    frameDurationMs: 20,
    vadThreshold: 0.01,
  },
};
