import test from "node:test";
import assert from "node:assert/strict";
import { computeBackoffDelay } from "../src/utils/retryBackoffConfig.ts";
test("computeBackoffDelay respects upper ceiling cap", () => {
  assert.equal(computeBackoffDelay(0, 100, 500), 100);
  assert.equal(computeBackoffDelay(10, 100, 500), 500);
});
