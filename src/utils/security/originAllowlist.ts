const ALLOWED_HOSTS = new Set(["m.uber.com", "calendar.google.com", "irctc.co.in", "flightaware.com"]);
export function isAllowedExternalUrl(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl);
    return u.protocol === "https:" && ALLOWED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}
