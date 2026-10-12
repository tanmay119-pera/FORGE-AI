import test from "node:test";
import assert from "node:assert/strict";
import { calibrateConfidence } from "../src/utils/cognitive/confidenceCalibration.ts";

test("calibrateConfidence bounds output within [0, 1]", () => {
  assert.equal(calibrateConfidence(0.95, 3), 1);
  assert.equal(calibrateConfidence(-0.5, 0), 0);
});
