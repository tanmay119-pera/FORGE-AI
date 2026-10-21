export interface SessionSnapshotV1 { version: 1; savedAt: number; messages: string[]; }
export function serializeSnapshot(messages: string[], savedAt = Date.now()): string {
  const payload: SessionSnapshotV1 = { version: 1, savedAt, messages };
  return JSON.stringify(payload);
}
export function deserializeSnapshot(raw: string): SessionSnapshotV1 | null {
  try {
    const obj = JSON.parse(raw);
    return obj && obj.version === 1 && Array.isArray(obj.messages) ? obj : null;
  } catch { return null; }
}
