import test from "node:test";
import assert from "node:assert/strict";
import { arraysMatch } from "../src/utils/sim/diffVerifier.ts";
test("arraysMatch compares exact ordering", () => {
  assert.equal(arraysMatch([1, 2], [1, 2]), true);
  assert.equal(arraysMatch([1, 2], [2, 1]), false);
});
