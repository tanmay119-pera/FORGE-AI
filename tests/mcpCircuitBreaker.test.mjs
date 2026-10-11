import test from "node:test";
import assert from "node:assert/strict";
import { MCPCircuitBreaker } from "../src/utils/mcp/circuitBreaker.ts";

test("MCPCircuitBreaker opens after threshold failures and resets after cooldown", () => {
  const cb = new MCPCircuitBreaker(2, 500);
  cb.recordFailure(100);
  assert.equal(cb.canExecute(150), true);
  cb.recordFailure(200);
  assert.equal(cb.canExecute(300), false);
  assert.equal(cb.canExecute(800), true);
});
