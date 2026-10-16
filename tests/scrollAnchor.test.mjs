import test from "node:test";
import assert from "node:assert/strict";
import { shouldAutoScroll } from "../src/utils/ui/scrollAnchor.ts";
test("shouldAutoScroll activates near bottom only", () => {
  assert.equal(shouldAutoScroll(1000, 580, 400, 80), true);
  assert.equal(shouldAutoScroll(1000, 100, 400, 80), false);
});
