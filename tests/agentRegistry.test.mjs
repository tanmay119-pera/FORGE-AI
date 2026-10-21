import test from "node:test";
import assert from "node:assert/strict";
import { AgentRegistry } from "../src/utils/agents/agentRegistry.ts";
test("AgentRegistry matches specialists by capability", () => {
  const r = new AgentRegistry();
  r.register({ id: "transit", role: "Mobility Agent", capabilities: ["cab", "train"] });
  assert.equal(r.findByCapability("cab").length, 1);
});
