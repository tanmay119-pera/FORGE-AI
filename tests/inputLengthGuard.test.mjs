import test from "node:test";
import assert from "node:assert/strict";
import { enforceMaxTranscriptChars } from "../src/utils/security/inputLengthGuard.ts";
test("enforceMaxTranscriptChars truncates oversized utterances", () => {
  assert.equal(enforceMaxTranscriptChars("hello", 10).ok, true);
  assert.equal(enforceMaxTranscriptChars("abcdef", 3).truncated, "abc");
});
