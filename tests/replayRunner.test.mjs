import test from "node:test";
import assert from "node:assert/strict";
import { replayVoiceLifecycle } from "../src/utils/sim/replayRunner.ts";
test("replayVoiceLifecycle replays full turn sequence deterministically", () => {
  assert.equal(replayVoiceLifecycle(["start_mic", "end_speech", "speak"]), "speaking");
});
