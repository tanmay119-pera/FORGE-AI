import test from "node:test";
import assert from "node:assert/strict";
import { serializeSnapshot, deserializeSnapshot } from "../src/utils/agents/sessionSnapshot.ts";
test("session snapshots round-trip with schema validation", () => {
  const raw = serializeSnapshot(["hi", "hello"], 12345);
  const parsed = deserializeSnapshot(raw);
  assert.deepEqual(parsed?.messages, ["hi", "hello"]);
});
