import test from "node:test";
import assert from "node:assert/strict";
import { LatencyHistogram } from "../src/utils/telemetry/latencyHistogram.ts";
test("LatencyHistogram computes p50 and p95 accurately", () => {
  const h = new LatencyHistogram();
  [10, 20, 30, 40, 100].forEach((x) => h.record(x));
  const s = h.summary();
  assert.equal(s.p50, 30);
  assert.equal(s.p95, 100);
});
