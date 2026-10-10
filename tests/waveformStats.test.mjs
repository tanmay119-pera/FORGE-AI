import test from "node:test";
import assert from "node:assert/strict";
import { analyzeWaveform } from "../src/utils/audio/waveformStats.ts";

test("analyzeWaveform reports peak, rms, and clipping count", () => {
  const m = analyzeWaveform([0.1, -0.5, 1.0, 0.2], 0.99);
  assert.equal(m.sampleCount, 4);
  assert.equal(m.peakAmplitude, 1);
  assert.equal(m.clippingSamples, 1);
});
