export class LatencyHistogram {
  private samples: number[] = [];
  record(ms: number): void { if (ms >= 0) this.samples.push(ms); }
  percentile(p: number): number {
    if (this.samples.length === 0) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
    return Number(sorted[Math.max(0, idx)].toFixed(2));
  }
  summary() { return { count: this.samples.length, p50: this.percentile(50), p95: this.percentile(95), p99: this.percentile(99) }; }
}
