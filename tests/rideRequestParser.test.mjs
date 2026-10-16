import test from "node:test";
import assert from "node:assert/strict";
import { parseRideRoute } from "../src/utils/parsers/rideRequestParser.ts";
test("parseRideRoute extracts pickup and dropoff", () => {
  const r = parseRideRoute("Book cab from Tech Park to Airport in 10 mins");
  assert.equal(r.pickup, "Tech Park");
  assert.equal(r.destination, "Airport");
});
