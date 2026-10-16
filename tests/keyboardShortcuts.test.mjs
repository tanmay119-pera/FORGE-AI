import test from "node:test";
import assert from "node:assert/strict";
import { matchesShortcut, formatShortcutLabel } from "../src/utils/ui/keyboardShortcuts.ts";
test("keyboard shortcut matching and labeling", () => {
  assert.equal(matchesShortcut("k", true, "K"), true);
  assert.equal(formatShortcutLabel(true, "k"), "Cmd+K");
});
