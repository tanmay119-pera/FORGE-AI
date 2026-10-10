import test from "node:test";
import assert from "node:assert/strict";
import { detectVoiceActivity, computeRmsEnergy } from "../src/utils/audio/vadDetector.ts";

test("computeRmsEnergy returns 0 for silence and positive RMS for signal", () => {
  assert.equal(computeRmsEnergy([0, 0, 0, 0]), 0);
  assert.ok(computeRmsEnergy([0.5, -0.5, 0.5, -0.5]) > 0.49);
});

test("detectVoiceActivity classifies silence vs speech waveform", () => {
  const silent = detectVoiceActivity([0.001, -0.001, 0.001, -0.001]);
  assert.equal(silent.isSpeech, false);
  const speech = detectVoiceActivity([0.2, 0.3, 0.25, 0.1, -0.15, -0.25, -0.2]);
  assert.equal(speech.isSpeech, true);
});
