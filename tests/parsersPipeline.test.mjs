import test from "node:test";
import assert from "node:assert/strict";
import { parseRideRoute } from "../src/utils/parsers/rideRequestParser.ts";
import { buildUberDeepLink } from "../src/utils/parsers/deepLinkBuilder.ts";
test("route parser feeds Uber deep link cleanly", () => {
  const r = parseRideRoute("from Office to Station");
  const url = buildUberDeepLink(r.pickup || "", r.destination || "");
  assert.ok(url.includes("Office") && url.includes("Station"));
});
