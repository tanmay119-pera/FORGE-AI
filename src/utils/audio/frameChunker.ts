export function sliceAudioFrames(
  samples: number[],
  frameSize = 320,
  hopSize = 160
): number[][] {
  if (frameSize <= 0 || hopSize <= 0) throw new RangeError("Frame and hop sizes must be positive");
  const frames: number[][] = [];
  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    frames.push(samples.slice(offset, offset + frameSize));
  }
  return frames;
}
