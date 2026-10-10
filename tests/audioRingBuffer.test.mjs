import test from "node:test";
import assert from "node:assert/strict";
import { AudioRingBuffer } from "../src/utils/audio/ringBuffer.ts";

test("AudioRingBuffer retains newest samples up to capacity", () => {
  const rb = new AudioRingBuffer(3);
  rb.push([1, 2, 3, 4]);
  assert.deepEqual(rb.snapshot(), [2, 3, 4]);
});
