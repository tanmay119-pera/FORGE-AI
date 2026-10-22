import test from "node:test";
import assert from "node:assert/strict";
import { splitIntoStreamChunks } from "../src/utils/sim/streamChunker.ts";
test("splitIntoStreamChunks reconstructs original string cleanly", () => {
  const parts = splitIntoStreamChunks("Streaming response test", 8);
  assert.equal(parts.join(""), "Streaming response test");
});
