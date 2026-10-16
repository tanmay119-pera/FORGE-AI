import test from "node:test";
import assert from "node:assert/strict";
import { nextFocusIndex } from "../src/utils/ui/focusTrapHelper.ts";
test("nextFocusIndex wraps forward and backward", () => {
  assert.equal(nextFocusIndex(2, 3, false), 0);
  assert.equal(nextFocusIndex(0, 3, true), 2);
});
