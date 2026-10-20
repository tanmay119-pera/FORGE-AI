export function stripUnsafeHtml(raw: string): string {
  return raw.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/on\w+\s*=\s*"[^"]*"/gi, "");
}
