import test from "node:test";
import assert from "node:assert/strict";
import { MCPToolRegistry } from "../src/utils/mcp/toolRegistry.ts";
import { validateToolArgs } from "../src/utils/mcp/schemaValidator.ts";
import { SlidingWindowLimiter } from "../src/utils/mcp/rateLimiter.ts";

test("MCP registry, validator, and limiter work cohesively", () => {
  const reg = new MCPToolRegistry();
  reg.register({
    name: "book_cab",
    description: "Book ride",
    parameters: { type: "object", properties: { pickup: { type: "string", description: "Start" } }, required: ["pickup"] }
  }, "mobility");
  const lim = new SlidingWindowLimiter(5, 10000);
  const tool = reg.get("book_cab");
  assert.ok(tool);
  assert.equal(lim.allow(100), true);
  assert.equal(validateToolArgs(tool.definition, { pickup: "Campus Gate" }).valid, true);
});
