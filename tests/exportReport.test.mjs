import test from "node:test";
import assert from "node:assert/strict";
import { formatTelemetryMarkdown } from "../src/utils/telemetry/exportReport.ts";
test("formatTelemetryMarkdown builds clean Markdown table", () => {
  const md = formatTelemetryMarkdown({ count: 10, p50: 45, p95: 120 });
  assert.ok(md.includes("| p95 | 120 ms |"));
});
