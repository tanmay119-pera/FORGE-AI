import test from "node:test";
import assert from "node:assert/strict";
import { exceedsLatencyBudget } from "../src/utils/telemetry/budgetAlert.ts";
test("exceedsLatencyBudget catches SLO breaches", () => {
  assert.equal(exceedsLatencyBudget(950, 800), true);
  assert.equal(exceedsLatencyBudget(400, 800), false);
});
