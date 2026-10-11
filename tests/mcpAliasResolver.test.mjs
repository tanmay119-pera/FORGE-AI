import test from "node:test";
import assert from "node:assert/strict";
import { resolveToolAlias } from "../src/utils/mcp/toolAliasResolver.ts";

test("resolveToolAlias maps common spoken phrases to canonical MCP tool names", () => {
  assert.equal(resolveToolAlias("Uber"), "book_cab");
  assert.equal(resolveToolAlias("meeting"), "schedule_calendar_event");
});
