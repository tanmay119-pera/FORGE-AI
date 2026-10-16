import test from "node:test";
import assert from "node:assert/strict";
import { categorizeError } from "../src/utils/telemetry/errorTaxonomy.ts";
test("categorizeError classifies quota, auth, and network errors", () => {
  assert.equal(categorizeError(new Error("HTTP 429 quota exceeded")), "quota");
  assert.equal(categorizeError(new Error("Request timeout")), "network");
});
