import test from "node:test";
import assert from "node:assert/strict";
import { trimLeadingTrailingSilence } from "../src/utils/audio/silenceTrimmer.ts";
import { normalizePeak } from "../src/utils/audio/noiseGate.ts";
import { analyzeWaveform } from "../src/utils/audio/waveformStats.ts";
import { detectVoiceActivity } from "../src/utils/audio/vadDetector.ts";

test("audio preprocessing pipeline trims, normalizes, and flags speech", () => {
  const raw = [0, 0, 0.1, 0.2, 0.25, 0.2, -0.15, -0.2, -0.15, 0];
  const trimmed = trimLeadingTrailingSilence(raw, 0.01);
  const normalized = normalizePeak(trimmed, 0.8);
  const stats = analyzeWaveform(normalized);
  const vad = detectVoiceActivity(normalized);
  assert.equal(stats.sampleCount, 7);
  assert.equal(stats.peakAmplitude, 0.8);
  assert.equal(vad.isSpeech, true);
});
