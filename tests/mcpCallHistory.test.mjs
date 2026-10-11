import test from "node:test";
import assert from "node:assert/strict";
import { MCPCallHistory } from "../src/utils/mcp/callHistory.ts";

test("MCPCallHistory stores entries, enforces cap, and averages duration", () => {
  const h = new MCPCallHistory(2);
  h.record({ id: "1", timestamp: "t1", direction: "client_to_server", method: "tools/call", payload: {}, durationMs: 40 });
  h.record({ id: "2", timestamp: "t2", direction: "server_to_client", method: "tools/call", payload: {}, durationMs: 60 });
  h.record({ id: "3", timestamp: "t3", direction: "client_to_server", method: "ping", payload: {}, durationMs: 20 });
  assert.equal(h.all().length, 2);
  assert.equal(h.averageDurationMs(), 40);
});
