import test from "node:test";
import assert from "node:assert/strict";
import { A11yAnnouncerQueue } from "../src/utils/ui/a11yAnnouncer.ts";
test("A11yAnnouncerQueue deduplicates consecutive announcements", () => {
  const q = new A11yAnnouncerQueue();
  assert.equal(q.announce("Connected"), true);
  assert.equal(q.announce("Connected"), false);
});
