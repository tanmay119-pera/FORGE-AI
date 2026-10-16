import test from "node:test";
import assert from "node:assert/strict";
import { extractInitials } from "../src/utils/ui/avatarInitials.ts";
test("extractInitials handles single and multi-word names", () => {
  assert.equal(extractInitials("Tanmay Srivastava"), "TS");
  assert.equal(extractInitials("Forge"), "F");
});
