export class SessionMetricsTracker {
  turns = 0;
  toolCalls = 0;
  errors = 0;
  recordTurn(hadToolCall = false, hadError = false): void {
    this.turns++;
    if (hadToolCall) this.toolCalls++;
    if (hadError) this.errors++;
  }
  successRate(): number { return this.turns === 0 ? 1 : Number(((this.turns - this.errors) / this.turns).toFixed(4)); }
}
