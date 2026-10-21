import test from "node:test";
import assert from "node:assert/strict";
import { AgentRegistry } from "../src/utils/agents/agentRegistry.ts";
import { createHandoff } from "../src/utils/agents/handoffProtocol.ts";
test("router discovers specialist agent and issues valid handoff", () => {
  const reg = new AgentRegistry();
  reg.register({ id: "flight_agent", role: "Flight Specialist", capabilities: ["flight"] });
  const target = reg.findByCapability("flight")[0];
  const handoff = createHandoff("orchestrator", target.id, "Check AI-302");
  assert.equal(handoff.toAgent, "flight_agent");
});
