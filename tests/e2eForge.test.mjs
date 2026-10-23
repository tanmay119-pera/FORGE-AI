import test from "node:test";
import assert from "node:assert/strict";
import { classifyVoiceIntent } from "../src/utils/cognitive/intentRouter.ts";
import { resolveToolAlias } from "../src/utils/mcp/toolAliasResolver.ts";
import { MCPToolRegistry } from "../src/utils/mcp/toolRegistry.ts";
import { redactPii } from "../src/utils/security/piiRedactor.ts";
import { LatencyHistogram } from "../src/utils/telemetry/latencyHistogram.ts";
import { buildDiagnosticsSnapshot } from "../src/utils/copilotDiagnostics.ts";

test("full FORGE-AI utility pipeline processes utterance securely end to end", () => {
  const reg = new MCPToolRegistry();
  reg.register({ name: "book_cab", description: "Ride", parameters: { type: "object", properties: {} } }, "transit");

  const scrubbed = redactPii("Book cab for alice@uni.edu to Airport");
  assert.ok(!scrubbed.includes("alice@uni.edu"));
  assert.equal(classifyVoiceIntent(scrubbed), "cab_booking");
  assert.equal(resolveToolAlias("cab"), "book_cab");

  const hist = new LatencyHistogram();
  hist.record(82);
  const snap = buildDiagnosticsSnapshot(reg, hist);
  assert.equal(snap.activeTools, 1);
  assert.equal(snap.latency.p50, 82);
});
