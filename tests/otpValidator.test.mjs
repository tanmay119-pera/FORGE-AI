import test from "node:test";
import assert from "node:assert/strict";
import { isValidRideOtp } from "../src/utils/parsers/otpValidator.ts";
test("isValidRideOtp validates 4-6 digits", () => {
  assert.equal(isValidRideOtp("4829"), true);
  assert.equal(isValidRideOtp("abc"), false);
});
