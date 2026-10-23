import test from "node:test";
import assert from "node:assert/strict";
import { COPILOT_EVENTS } from "../src/utils/eventNames.ts";
test("COPILOT_EVENTS defines unique string keys", () => {
  const vals = Object.values(COPILOT_EVENTS);
  assert.equal(new Set(vals).size, vals.length);
});
