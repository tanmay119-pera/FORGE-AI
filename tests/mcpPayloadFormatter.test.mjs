import test from "node:test";
import assert from "node:assert/strict";
import { summarizePayload } from "../src/utils/mcp/payloadFormatter.ts";

test("summarizePayload truncates long payloads safely", () => {
  const s = summarizePayload({ data: "a".repeat(200) }, 30);
  assert.equal(s.length, 30);
  assert.ok(s.endsWith("..."));
});
