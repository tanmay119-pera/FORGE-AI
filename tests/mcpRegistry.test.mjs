import test from "node:test";
import assert from "node:assert/strict";
import { MCPToolRegistry } from "../src/utils/mcp/toolRegistry.ts";

test("MCPToolRegistry filters tools by category and active status", () => {
  const reg = new MCPToolRegistry();
  reg.register({ name: "book_cab", description: "Book ride", parameters: { type: "object", properties: {} } }, "travel", false);
  reg.register({ name: "legacy_map", description: "Old", parameters: { type: "object", properties: {} } }, "travel", true);
  assert.equal(reg.listByCategory("travel").length, 2);
  assert.equal(reg.listActive().length, 1);
});
