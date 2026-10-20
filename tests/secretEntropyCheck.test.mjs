import test from "node:test";
import assert from "node:assert/strict";
import { looksLikeApiKey } from "../src/utils/security/secretEntropyCheck.ts";
test("looksLikeApiKey spots common key prefixes", () => {
  assert.equal(looksLikeApiKey("key is sk-AbCdEf123456789012"), true);
  assert.equal(looksLikeApiKey("regular sentence"), false);
});
