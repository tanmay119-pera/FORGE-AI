import test from "node:test";
import assert from "node:assert/strict";
import { nextVoiceState } from "../src/utils/sim/voiceTurnSimulator.ts";
test("nextVoiceState follows listening -> thinking -> executing -> speaking -> idle", () => {
  let st = nextVoiceState("idle", "start_mic");
  st = nextVoiceState(st, "end_speech");
  st = nextVoiceState(st, "run_tool");
  st = nextVoiceState(st, "speak");
  assert.equal(st, "speaking");
  assert.equal(nextVoiceState(st, "reset"), "idle");
});
