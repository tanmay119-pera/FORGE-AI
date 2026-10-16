import test from "node:test";
import assert from "node:assert/strict";
import { buildUberDeepLink } from "../src/utils/parsers/deepLinkBuilder.ts";
test("buildUberDeepLink encodes pickup and dropoff addresses", () => {
  const url = buildUberDeepLink("Campus Gate", "Airport T3");
  assert.ok(url.startsWith("https://m.uber.com/ul/?"));
  assert.ok(url.includes("Airport+T3") || url.includes("Airport%20T3"));
});
