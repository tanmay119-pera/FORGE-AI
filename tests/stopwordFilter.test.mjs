import test from "node:test";
import assert from "node:assert/strict";
import { extractKeywords } from "../src/utils/cognitive/stopwordFilter.ts";

test("extractKeywords removes filler stopwords cleanly", () => {
  assert.deepEqual(extractKeywords("Book a cab to the station"), ["book", "cab", "station"]);
});
