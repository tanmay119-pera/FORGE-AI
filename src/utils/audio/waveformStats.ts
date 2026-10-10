import { computeRmsEnergy } from "./vadDetector.ts";

export interface WaveformMetrics {
  sampleCount: number;
  peakAmplitude: number;
  rmsAmplitude: number;
  clippingSamples: number;
}

export function analyzeWaveform(samples: number[], clipThreshold = 0.99): WaveformMetrics {
  let peakAmplitude = 0;
  let clippingSamples = 0;
  for (const s of samples) {
    const abs = Math.abs(s);
    if (abs > peakAmplitude) peakAmplitude = abs;
    if (abs >= clipThreshold) clippingSamples++;
  }
  return {
    sampleCount: samples.length,
    peakAmplitude: Number(peakAmplitude.toFixed(4)),
    rmsAmplitude: Number(computeRmsEnergy(samples).toFixed(4)),
    clippingSamples,
  };
}
