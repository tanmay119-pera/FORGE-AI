import test from "node:test";
import assert from "node:assert/strict";
import { estimateTokenCount } from "../src/utils/cognitive/tokenEstimator.ts";

test("estimateTokenCount estimates empty and populated utterances", () => {
  assert.equal(estimateTokenCount("   "), 0);
  assert.ok(estimateTokenCount("Book a cab to the airport immediately") >= 7);
});
