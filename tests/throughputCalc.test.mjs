import test from "node:test";
import assert from "node:assert/strict";
import { tokensPerSecond } from "../src/utils/telemetry/throughputCalc.ts";
test("tokensPerSecond converts duration to rate", () => {
  assert.equal(tokensPerSecond(50, 500), 100);
});
