import test from "node:test";
import assert from "node:assert/strict";
import { formatFare, parseFareAmount } from "../src/utils/parsers/currencyFormatter.ts";
test("currency helpers format and parse cleanly", () => {
  assert.equal(formatFare(420, "INR"), "Rs. 420.00");
  assert.equal(parseFareAmount("Rs. 1,250.50"), 1250.5);
});
