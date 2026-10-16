import test from "node:test";
import assert from "node:assert/strict";
import { ToastQueue } from "../src/utils/ui/toastQueue.ts";
test("ToastQueue bounds active items and supports dismiss", () => {
  const tq = new ToastQueue(2);
  tq.push({ id: "1", text: "A", kind: "info" });
  tq.push({ id: "2", text: "B", kind: "info" });
  tq.push({ id: "3", text: "C", kind: "success" });
  assert.equal(tq.list().length, 2);
  tq.dismiss("2");
  assert.equal(tq.list()[0].id, "3");
});
