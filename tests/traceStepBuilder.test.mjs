import test from "node:test";
import assert from "node:assert/strict";
import { CognitiveTraceBuilder } from "../src/utils/cognitive/traceStepBuilder.ts";

test("CognitiveTraceBuilder emits ordered explainability trace steps", () => {
  const b = new CognitiveTraceBuilder();
  b.addStep("perceive", "Parsed transcript", 8);
  b.addStep("plan", "Selected MCP tool", 12);
  const steps = b.build();
  assert.equal(steps.length, 2);
  assert.equal(steps[1].id, "step_2");
});
