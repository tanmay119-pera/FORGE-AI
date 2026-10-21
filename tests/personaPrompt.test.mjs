import test from "node:test";
import assert from "node:assert/strict";
import { buildPersonaSystemPrompt } from "../src/utils/agents/personaPrompt.ts";
test("buildPersonaSystemPrompt numbers agent rules cleanly", () => {
  const out = buildPersonaSystemPrompt("Concierge", ["Be brief", "Cite tools"]);
  assert.ok(out.includes("1. Be brief"));
});
