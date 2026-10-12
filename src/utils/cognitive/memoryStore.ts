export interface EpisodicFact {
  key: string;
  value: string;
  expiresAtMs: number;
}

export class EpisodicMemoryStore {
  private store = new Map<string, EpisodicFact>();

  remember(key: string, value: string, ttlMs = 3600000, nowMs = Date.now()): void {
    this.store.set(key, { key, value, expiresAtMs: nowMs + ttlMs });
  }

  recall(key: string, nowMs = Date.now()): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (nowMs > entry.expiresAtMs) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  activeKeys(nowMs = Date.now()): string[] {
    const keys: string[] = [];
    for (const [k, v] of this.store.entries()) {
      if (nowMs <= v.expiresAtMs) keys.push(k);
    }
    return keys;
  }
}
