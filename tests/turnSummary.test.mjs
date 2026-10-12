import test from "node:test";
import assert from "node:assert/strict";
import { summarizeTurnLength } from "../src/utils/cognitive/turnSummary.ts";

test("summarizeTurnLength aggregates counts and characters", () => {
  assert.deepEqual(summarizeTurnLength([{ content: "hi" }, { content: "abc" }]), { count: 2, totalChars: 5 });
});
