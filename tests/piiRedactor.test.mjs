import test from "node:test";
import assert from "node:assert/strict";
import { redactPii } from "../src/utils/security/piiRedactor.ts";
test("redactPii masks email addresses and phone numbers", () => {
  const out = redactPii("Contact alice@example.com or +91 9876543210");
  assert.ok(out.includes("[REDACTED_EMAIL]"));
  assert.ok(out.includes("[REDACTED_PHONE]"));
});
