import test from "node:test";
import assert from "node:assert/strict";
import { computeOverallHealth } from "../src/utils/telemetry/healthMonitor.ts";
test("computeOverallHealth aggregates subsystem states", () => {
  assert.equal(computeOverallHealth([{ name: "asr", ok: true, latencyMs: 10 }]), "healthy");
  assert.equal(computeOverallHealth([{ name: "asr", ok: true, latencyMs: 10 }, { name: "tts", ok: false, latencyMs: 0 }]), "degraded");
});
