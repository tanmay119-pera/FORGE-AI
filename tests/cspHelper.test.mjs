import test from "node:test";
import assert from "node:assert/strict";
import { safeHref } from "../src/utils/security/cspHelper.ts";
test("safeHref only allows HTTPS links", () => {
  assert.equal(safeHref("https://example.com"), "https://example.com");
  assert.equal(safeHref("data:text/html"), "#blocked");
});
