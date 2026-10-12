import test from "node:test";
import assert from "node:assert/strict";
import { EpisodicMemoryStore } from "../src/utils/cognitive/memoryStore.ts";

test("EpisodicMemoryStore remembers facts until TTL expiration", () => {
  const mem = new EpisodicMemoryStore();
  mem.remember("home_city", "Bengaluru", 500, 100);
  assert.equal(mem.recall("home_city", 400), "Bengaluru");
  assert.equal(mem.recall("home_city", 700), null);
});
