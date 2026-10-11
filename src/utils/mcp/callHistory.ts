import type { MCPLogEntry } from "../../types.ts";

export class MCPCallHistory {
  private entries: MCPLogEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries = 100) {
    this.maxEntries = maxEntries;
  }

  record(entry: MCPLogEntry): void {
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  filterByMethod(method: string): MCPLogEntry[] {
    return this.entries.filter((e) => e.method === method);
  }

  averageDurationMs(): number {
    const timed = this.entries.filter((e) => typeof e.durationMs === "number");
    if (timed.length === 0) return 0;
    const total = timed.reduce((sum, e) => sum + (e.durationMs || 0), 0);
    return Number((total / timed.length).toFixed(2));
  }

  all(): MCPLogEntry[] {
    return [...this.entries];
  }
}
