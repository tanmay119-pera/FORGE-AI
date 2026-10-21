import test from "node:test";
import assert from "node:assert/strict";
import { createHandoff } from "../src/utils/agents/handoffProtocol.ts";
test("createHandoff increments hopCount and prevents infinite loops", () => {
  const pkt = createHandoff("router", "transit", "Book cab", 0, 3);
  assert.equal(pkt.hopCount, 1);
  assert.throws(() => createHandoff("a", "b", "loop", 3, 3));
});
