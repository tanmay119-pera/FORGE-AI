import test from "node:test";
import assert from "node:assert/strict";
import * as utils from "../src/utils/index.ts";
test("root utils barrel exposes core subsystem helpers", () => {
  assert.equal(typeof utils.detectVoiceActivity, "function");
  assert.equal(typeof utils.redactPii, "function");
  assert.equal(typeof utils.classifyVoiceIntent, "function");
  assert.equal(typeof utils.buildDiagnosticsSnapshot, "function");
});
