import test from "node:test";
import assert from "node:assert/strict";
import { formatEtaDuration } from "../src/utils/parsers/durationFormatter.ts";
test("formatEtaDuration switches cleanly from mins to hours", () => {
  assert.equal(formatEtaDuration(18), "18 min");
  assert.equal(formatEtaDuration(95), "1h 35m");
});
