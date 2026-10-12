import test from "node:test";
import assert from "node:assert/strict";
import { trimContextWindow } from "../src/utils/cognitive/contextWindow.ts";

test("trimContextWindow preserves system turn and newest dialog messages", () => {
  const turns = [
    { role: "system", content: "You are Forge AI." },
    { role: "user", content: "Old question word ".repeat(30) },
    { role: "user", content: "Recent question" },
  ];
  const trimmed = trimContextWindow(turns, 20);
  assert.equal(trimmed[0].role, "system");
  assert.equal(trimmed[trimmed.length - 1].content, "Recent question");
});
