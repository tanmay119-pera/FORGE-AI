import test from "node:test";
import assert from "node:assert/strict";
import { maskSecretToken } from "../src/utils/security/tokenMasker.ts";
test("maskSecretToken preserves only trailing characters", () => {
  assert.equal(maskSecretToken("sk-1234567890abcd", 4), "************abcd");
});
