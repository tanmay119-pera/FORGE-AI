import test from "node:test";
import assert from "node:assert/strict";
import { parseRelativeMinutes } from "../src/utils/parsers/dateTimeParser.ts";
test("parseRelativeMinutes parses minutes and hours", () => {
  assert.equal(parseRelativeMinutes("Call cab in 15 mins"), 15);
  assert.equal(parseRelativeMinutes("Sync in 2 hours"), 120);
  assert.equal(parseRelativeMinutes("Now"), null);
});
