import test from "node:test";
import assert from "node:assert/strict";
import { withExponentialRetry } from "../src/utils/mcp/retryPolicy.ts";

test("withExponentialRetry retries transient errors until success", async () => {
  let n = 0;
  const val = await withExponentialRetry(async () => {
    n++;
    if (n < 3) throw new Error("temporary failure");
    return "done";
  }, 3, 2);
  assert.equal(val, "done");
  assert.equal(n, 3);
});
