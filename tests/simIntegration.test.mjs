import test from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_UTTERANCES } from "../src/utils/sim/transcriptSeed.ts";
import { splitIntoStreamChunks } from "../src/utils/sim/streamChunker.ts";
import { replayVoiceLifecycle } from "../src/utils/sim/replayRunner.ts";
test("offline turn simulator replays utterance streaming lifecycle", () => {
  const state = replayVoiceLifecycle(["start_mic", "end_speech", "run_tool", "speak"]);
  assert.equal(state, "speaking");
  assert.ok(splitIntoStreamChunks(SAMPLE_UTTERANCES[0], 10).length > 1);
});
