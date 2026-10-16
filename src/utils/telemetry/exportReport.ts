export function formatTelemetryMarkdown(summary: { count: number; p50: number; p95: number }): string {
  return `| Metric | Value |\n|---|---|\n| Turns | ${summary.count} |\n| p50 | ${summary.p50} ms |\n| p95 | ${summary.p95} ms |`;
}
