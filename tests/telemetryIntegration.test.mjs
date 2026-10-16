import test from "node:test";
import assert from "node:assert/strict";
import { LatencyHistogram } from "../src/utils/telemetry/latencyHistogram.ts";
import { formatTelemetryMarkdown } from "../src/utils/telemetry/exportReport.ts";
test("histogram summary feeds Markdown exporter", () => {
  const h = new LatencyHistogram();
  h.record(50); h.record(100);
  const md = formatTelemetryMarkdown(h.summary());
  assert.ok(md.includes("| Turns | 2 |"));
});
