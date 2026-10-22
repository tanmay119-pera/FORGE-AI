import test from "node:test";
import assert from "node:assert/strict";
import { clampedJitterMs } from "../src/utils/sim/networkJitterSim.ts";
test("clampedJitterMs keeps latency within expected +/-20% bounds", () => {
  assert.equal(clampedJitterMs(100, 1, 0.2), 120);
  assert.equal(clampedJitterMs(100, 0, 0.2), 80);
});
