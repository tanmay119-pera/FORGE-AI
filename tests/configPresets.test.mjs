import test from "node:test";
import assert from "node:assert/strict";
import { COPILOT_PRESETS } from "../src/utils/configPresets.ts";
test("COPILOT_PRESETS scales token budgets cleanly", () => {
  assert.ok(COPILOT_PRESETS.deepReasoning.maxContextTokens > COPILOT_PRESETS.lowLatency.maxContextTokens);
});
