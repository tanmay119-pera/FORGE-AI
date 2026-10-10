import test from "node:test";
import assert from "node:assert/strict";
import { sliceAudioFrames } from "../src/utils/audio/frameChunker.ts";

test("sliceAudioFrames yields overlapping frames cleanly", () => {
  const frames = sliceAudioFrames([1, 2, 3, 4, 5, 6], 4, 2);
  assert.deepEqual(frames, [[1, 2, 3, 4], [3, 4, 5, 6]]);
});
