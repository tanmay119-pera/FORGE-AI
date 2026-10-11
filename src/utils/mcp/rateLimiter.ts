export class SlidingWindowLimiter {
  private timestamps: number[] = [];
  private limit: number;
  private windowMs: number;

  constructor(limit = 20, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  allow(nowMs = Date.now()): boolean {
    const cutoff = nowMs - this.windowMs;
    this.timestamps = this.timestamps.filter((t) => t > cutoff);
    if (this.timestamps.length >= this.limit) return false;
    this.timestamps.push(nowMs);
    return true;
  }

  remaining(nowMs = Date.now()): number {
    const cutoff = nowMs - this.windowMs;
    const active = this.timestamps.filter((t) => t > cutoff).length;
    return Math.max(0, this.limit - active);
  }
}
