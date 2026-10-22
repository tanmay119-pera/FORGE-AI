import test from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_ROUTE, SAMPLE_FLIGHT } from "../src/utils/sim/mockFixtures.ts";
test("mock fixtures provide valid travel objects", () => {
  assert.equal(SAMPLE_ROUTE.trafficLevel, "Moderate");
  assert.equal(SAMPLE_FLIGHT.terminal, "T3");
});
