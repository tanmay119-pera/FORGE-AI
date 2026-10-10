export function resampleLinear(
  input: number[],
  fromRate: number,
  toRate: number
): number[] {
  if (fromRate <= 0 || toRate <= 0) {
    throw new RangeError("Sample rates must be positive");
  }
  if (input.length === 0 || fromRate === toRate) return [...input];
  const ratio = fromRate / toRate;
  const outLength = Math.max(1, Math.round(input.length / ratio));
  const output = new Array<number>(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIdx = i * ratio;
    const low = Math.floor(srcIdx);
    const high = Math.min(low + 1, input.length - 1);
    const frac = srcIdx - low;
    output[i] = input[low] * (1 - frac) + input[high] * frac;
  }
  return output;
}

export function floatToInt16Pcm(samples: number[]): Int16Array {
  const out = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    out[i] = clamped < 0 ? Math.round(clamped * 32768) : Math.round(clamped * 32767);
  }
  return out;
}
