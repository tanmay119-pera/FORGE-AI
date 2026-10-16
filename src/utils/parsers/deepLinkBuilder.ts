export function buildUberDeepLink(pickup: string, dropoff: string): string {
  const params = new URLSearchParams({ action: "setPickup", "pickup[formatted_address]": pickup, "dropoff[formatted_address]": dropoff });
  return `https://m.uber.com/ul/?${params.toString()}`;
}
