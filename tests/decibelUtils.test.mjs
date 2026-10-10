import test from "node:test";
import assert from "node:assert/strict";
import { linearToDb, dbToLinear } from "../src/utils/audio/decibelUtils.ts";

test("decibel conversions round-trip accurately", () => {
  assert.equal(linearToDb(1), 0);
  assert.ok(Math.abs(linearToDb(0.5) + 6.02) < 0.05);
  assert.ok(Math.abs(dbToLinear(-6.0206) - 0.5) < 0.001);
});
