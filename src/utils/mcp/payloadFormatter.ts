export function summarizePayload(payload: unknown, maxLen = 120): string {
  try {
    const raw = JSON.stringify(payload);
    if (!raw) return "empty";
    return raw.length > maxLen ? `${raw.slice(0, maxLen - 3)}...` : raw;
  } catch {
    return "[Unserializable payload]";
  }
}
