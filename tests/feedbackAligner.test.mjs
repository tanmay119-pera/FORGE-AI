import test from "node:test";
import assert from "node:assert/strict";
import { FeedbackAligner } from "../src/utils/agents/feedbackAligner.ts";
test("FeedbackAligner calculates approval ratio accurately", () => {
  const fa = new FeedbackAligner();
  fa.record("up"); fa.record("up"); fa.record("down");
  assert.ok(Math.abs(fa.approvalRatio() - 0.6667) < 0.001);
});
