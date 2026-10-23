import test from "node:test";
import assert from "node:assert/strict";
import { formatTimestampIso, clampNumber } from "../src/utils/formatters.ts";
test("shared formatters clamp and format cleanly", () => {
  assert.equal(clampNumber(150, 0, 100), 100);
  assert.equal(formatTimestampIso(0), "1970-01-01T00:00:00.000Z");
});
