import test from "node:test";
import assert from "node:assert/strict";
import { TurnScheduler } from "../src/utils/agents/turnScheduler.ts";
test("TurnScheduler dequeues higher-priority barge-in turns first", () => {
  const s = new TurnScheduler();
  s.enqueue({ id: "1", text: "low", priority: 1 });
  s.enqueue({ id: "2", text: "stop", priority: 10 });
  assert.equal(s.next()?.id, "2");
});
