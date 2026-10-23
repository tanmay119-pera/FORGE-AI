import test from "node:test";
import assert from "node:assert/strict";
import { statusColorToken } from "../src/utils/statusBadges.ts";
test("statusColorToken resolves emerald, amber, and slate states", () => {
  assert.equal(statusColorToken("On Time"), "emerald");
  assert.equal(statusColorToken("Delayed"), "amber");
});
