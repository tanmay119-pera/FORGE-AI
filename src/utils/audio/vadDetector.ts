export interface VadResult {
  isSpeech: boolean;
  energyRms: number;
  zeroCrossingRate: number;
}

export function computeRmsEnergy(samples: Float32Array | number[]): number {
  if (samples.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < samples.length; i++) {
    sumSq += samples[i] * samples[i];
  }
  return Math.sqrt(sumSq / samples.length);
}

export function computeZeroCrossingRate(samples: Float32Array | number[]): number {
  if (samples.length < 2) return 0;
  let crossings = 0;
  for (let i = 1; i < samples.length; i++) {
    if ((samples[i - 1] >= 0 && samples[i] < 0) || (samples[i - 1] < 0 && samples[i] >= 0)) {
      crossings++;
    }
  }
  return crossings / (samples.length - 1);
}

export function detectVoiceActivity(
  samples: Float32Array | number[],
  energyThreshold = 0.02,
  maxZcr = 0.45
): VadResult {
  const energyRms = computeRmsEnergy(samples);
  const zeroCrossingRate = computeZeroCrossingRate(samples);
  const isSpeech = energyRms >= energyThreshold && zeroCrossingRate <= maxZcr;
  return { isSpeech, energyRms, zeroCrossingRate };
}
