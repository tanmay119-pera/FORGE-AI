import test from "node:test";
import assert from "node:assert/strict";
import { extractTrainNumber, formatCoachSeat } from "../src/utils/parsers/trainCodeParser.ts";
test("extractTrainNumber parses 5-digit code", () => {
  assert.equal(extractTrainNumber("Status of train 12951"), "12951");
  assert.equal(formatCoachSeat(" b4 ", 32), "B4-32");
});
