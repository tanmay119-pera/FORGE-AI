export class MCPCircuitBreaker {
  private failures = 0;
  private openedAt: number | null = null;
  private failureThreshold: number;
  private resetTimeoutMs: number;

  constructor(failureThreshold = 3, resetTimeoutMs = 15000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  canExecute(nowMs = Date.now()): boolean {
    if (this.openedAt === null) return true;
    if (nowMs - this.openedAt >= this.resetTimeoutMs) {
      this.reset();
      return true;
    }
    return false;
  }

  recordFailure(nowMs = Date.now()): void {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.openedAt = nowMs;
    }
  }

  reset(): void {
    this.failures = 0;
    this.openedAt = null;
  }
}
