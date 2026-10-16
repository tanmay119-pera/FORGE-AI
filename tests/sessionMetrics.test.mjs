import test from "node:test";
import assert from "node:assert/strict";
import { SessionMetricsTracker } from "../src/utils/telemetry/sessionMetrics.ts";
test("SessionMetricsTracker computes success rate", () => {
  const t = new SessionMetricsTracker();
  t.recordTurn(true, false);
  t.recordTurn(false, true);
  assert.equal(t.successRate(), 0.5);
});
