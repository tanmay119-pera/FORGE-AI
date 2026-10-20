import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedExternalUrl } from "../src/utils/security/originAllowlist.ts";
test("isAllowedExternalUrl blocks javascript: and unknown hosts", () => {
  assert.equal(isAllowedExternalUrl("https://m.uber.com/ul/?a=1"), true);
  assert.equal(isAllowedExternalUrl("javascript:alert(1)"), false);
});
