import test from "node:test";
import assert from "node:assert/strict";
import { classifyVoiceIntent } from "../src/utils/cognitive/intentRouter.ts";
import { EpisodicMemoryStore } from "../src/utils/cognitive/memoryStore.ts";
import { composeActionPrompt } from "../src/utils/cognitive/promptComposer.ts";

test("cognitive intent -> memory -> prompt pipeline formats grounded prompts", () => {
  const mem = new EpisodicMemoryStore();
  mem.remember("preferred_airline", "Air India");
  const intent = classifyVoiceIntent("Check flight AI-302 status");
  const prompt = composeActionPrompt(intent, "Check flight AI-302", [`Airline=${mem.recall("preferred_airline")}`]);
  assert.ok(prompt.includes("[INTENT:flight_status]"));
  assert.ok(prompt.includes("Air India"));
});
