import test from "node:test";
import assert from "node:assert/strict";
import { applyNoiseGate, normalizePeak } from "../src/utils/audio/noiseGate.ts";

test("applyNoiseGate attenuates sub-threshold floor frames", () => {
  const gated = applyNoiseGate([0.005, 0.2], 0.02, 0.1);
  assert.ok(Math.abs(gated[0] - 0.0005) < 1e-6);
  assert.equal(gated[1], 0.2);
});

test("normalizePeak scales signal to target amplitude", () => {
  const norm = normalizePeak([-0.25, 0.5], 0.9);
  assert.equal(norm[1], 0.9);
});
