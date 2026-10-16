export interface ParsedRideRoute { pickup?: string; destination?: string; }
export function parseRideRoute(text: string): ParsedRideRoute {
  const fromMatch = text.match(/from\s+([A-Za-z0-9\s]+?)(?=\s+to\b|$)/i);
  const toMatch = text.match(/to\s+([A-Za-z0-9\s]+?)(?=\s+in\b|$)/i);
  return { pickup: fromMatch?.[1].trim(), destination: toMatch?.[1].trim() };
}
