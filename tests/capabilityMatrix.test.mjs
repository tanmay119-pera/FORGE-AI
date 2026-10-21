import test from "node:test";
import assert from "node:assert/strict";
import { hasAllCapabilities } from "../src/utils/agents/capabilityMatrix.ts";
test("hasAllCapabilities validates required subset", () => {
  assert.equal(hasAllCapabilities(["cab", "flight", "hotel"], ["cab", "flight"]), true);
  assert.equal(hasAllCapabilities(["cab"], ["cab", "flight"]), false);
});
