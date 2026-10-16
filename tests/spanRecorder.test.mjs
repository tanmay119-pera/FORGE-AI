import test from "node:test";
import assert from "node:assert/strict";
import { spanDuration, totalTraceTime } from "../src/utils/telemetry/spanRecorder.ts";
test("span calculations sum durations cleanly", () => {
  const s = [{ name: "asr", startMs: 0, endMs: 20 }, { name: "llm", startMs: 20, endMs: 100 }];
  assert.equal(spanDuration(s[0]), 20);
  assert.equal(totalTraceTime(s), 100);
});
