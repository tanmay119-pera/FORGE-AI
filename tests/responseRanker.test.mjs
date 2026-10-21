import test from "node:test";
import assert from "node:assert/strict";
import { scoreCandidateResponse } from "../src/utils/agents/responseRanker.ts";
test("scoreCandidateResponse favors concise grounded actions", () => {
  assert.equal(scoreCandidateResponse("Your cab is booked for 10:15 AM.", true), 1);
});
