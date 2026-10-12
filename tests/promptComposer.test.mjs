import test from "node:test";
import assert from "node:assert/strict";
import { composeActionPrompt } from "../src/utils/cognitive/promptComposer.ts";

test("composeActionPrompt injects intent tag and hints cleanly", () => {
  const prompt = composeActionPrompt("cab_booking", " Book ride ", ["Home=Campus"]);
  assert.ok(prompt.includes("[INTENT:cab_booking]"));
  assert.ok(prompt.includes("Home=Campus"));
});
