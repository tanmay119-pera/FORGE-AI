import test from "node:test";
import assert from "node:assert/strict";
import { stripUnsafeHtml } from "../src/utils/security/outputSanitizer.ts";
test("stripUnsafeHtml removes script blocks", () => {
  assert.equal(stripUnsafeHtml("Hello<script>alert(1)</script>"), "Hello");
});
