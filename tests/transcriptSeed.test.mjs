import test from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_UTTERANCES } from "../src/utils/sim/transcriptSeed.ts";
test("SAMPLE_UTTERANCES contains non-empty queries", () => {
  assert.ok(SAMPLE_UTTERANCES.length >= 4);
});
