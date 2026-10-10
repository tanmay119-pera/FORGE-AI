import test from "node:test";
import assert from "node:assert/strict";
import { trimLeadingTrailingSilence } from "../src/utils/audio/silenceTrimmer.ts";

test("trimLeadingTrailingSilence strips padding zeros safely", () => {
  assert.deepEqual(trimLeadingTrailingSilence([0, 0, 0.2, 0.4, 0, 0], 0.01), [0.2, 0.4]);
  assert.deepEqual(trimLeadingTrailingSilence([0, 0], 0.01), []);
});
