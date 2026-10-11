import test from "node:test";
import assert from "node:assert/strict";
import { SlidingWindowLimiter } from "../src/utils/mcp/rateLimiter.ts";

test("SlidingWindowLimiter enforces window limits and expires old requests", () => {
  const lim = new SlidingWindowLimiter(2, 1000);
  assert.equal(lim.allow(100), true);
  assert.equal(lim.allow(200), true);
  assert.equal(lim.allow(300), false);
  assert.equal(lim.allow(1200), true);
});
