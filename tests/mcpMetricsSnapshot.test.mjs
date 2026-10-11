import test from "node:test";
import assert from "node:assert/strict";
import { countByDirection } from "../src/utils/mcp/metricsSnapshot.ts";

test("countByDirection separates client and server MCP messages", () => {
  const counts = countByDirection([
    { id: "1", timestamp: "t", direction: "client_to_server", method: "a", payload: {} },
    { id: "2", timestamp: "t", direction: "server_to_client", method: "a", payload: {} },
  ]);
  assert.deepEqual(counts, { outbound: 1, inbound: 1 });
});
