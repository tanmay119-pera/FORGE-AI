import test from "node:test";
import assert from "node:assert/strict";
import { normalizeFlightCode, isValidPnr } from "../src/utils/parsers/flightCodeParser.ts";
test("flight code and PNR validation", () => {
  assert.equal(normalizeFlightCode("flight ai302"), "AI-302");
  assert.equal(isValidPnr("AB12CD"), true);
  assert.equal(isValidPnr("12"), false);
});
