import test from "node:test";
import assert from "node:assert/strict";
import { resampleLinear, floatToInt16Pcm } from "../src/utils/audio/pcmResampler.ts";

test("resampleLinear scales sample count proportionally", () => {
  const res = resampleLinear([0, 0.5, 1, 0.5], 16000, 8000);
  assert.equal(res.length, 2);
});

test("floatToInt16Pcm clamps extremes cleanly", () => {
  const pcm = floatToInt16Pcm([-1.5, 0, 1.5]);
  assert.equal(pcm[0], -32768);
  assert.equal(pcm[1], 0);
  assert.equal(pcm[2], 32767);
});
