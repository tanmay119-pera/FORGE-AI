import test from "node:test";
import assert from "node:assert/strict";
import { measureSyncOps } from "../src/utils/sim/benchmarkHarness.ts";
test("measureSyncOps records non-zero timing stats", () => {
  const res = measureSyncOps(() => { Math.sqrt(12345); }, 500);
  assert.equal(res.iterations, 500);
  assert.ok(res.totalMs > 0);
});
