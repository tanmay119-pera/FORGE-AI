export function redactPii(text: string): string {
  return text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[REDACTED_EMAIL]")
    .replace(/\b\+?\d[\d\s-]{8,14}\d\b/g, "[REDACTED_PHONE]");
}
