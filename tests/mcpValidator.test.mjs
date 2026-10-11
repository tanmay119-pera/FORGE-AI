import test from "node:test";
import assert from "node:assert/strict";
import { validateToolArgs } from "../src/utils/mcp/schemaValidator.ts";

test("validateToolArgs validates required fields and enum constraints", () => {
  const def = {
    name: "flight_check",
    description: "Check flight",
    parameters: {
      type: "object",
      properties: { tier: { type: "string", description: "Tier", enum: ["eco", "biz"] } },
      required: ["tier"],
    },
  };
  assert.equal(validateToolArgs(def, { tier: "eco" }).valid, true);
  assert.equal(validateToolArgs(def, {}).valid, false);
  assert.equal(validateToolArgs(def, { tier: "vip" }).valid, false);
});
