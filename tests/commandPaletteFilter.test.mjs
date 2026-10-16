import test from "node:test";
import assert from "node:assert/strict";
import { fuzzyMatch } from "../src/utils/ui/commandPaletteFilter.ts";
test("fuzzyMatch finds non-contiguous character sequences", () => {
  assert.equal(fuzzyMatch("bkcb", "Book Cab"), true);
  assert.equal(fuzzyMatch("xyz", "Book Cab"), false);
});
