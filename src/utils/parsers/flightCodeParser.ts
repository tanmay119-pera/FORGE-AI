export function normalizeFlightCode(raw: string): string | null {
  const m = raw.toUpperCase().match(/\b([A-Z0-9]{2})[-\s]?(\d{2,4})\b/);
  return m ? `${m[1]}-${m[2]}` : null;
}
export function isValidPnr(pnr: string): boolean {
  return /^[A-Z0-9]{6}$/i.test(pnr.trim());
}
