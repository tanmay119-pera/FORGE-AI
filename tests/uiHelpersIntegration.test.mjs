import test from "node:test";
import assert from "node:assert/strict";
import { ToastQueue } from "../src/utils/ui/toastQueue.ts";
import { A11yAnnouncerQueue } from "../src/utils/ui/a11yAnnouncer.ts";
test("toast events mirror into ARIA live announcer", () => {
  const toasts = new ToastQueue();
  const a11y = new A11yAnnouncerQueue();
  toasts.push({ id: "t1", text: "Cab confirmed", kind: "success" });
  assert.equal(a11y.announce(toasts.list()[0].text), true);
});
