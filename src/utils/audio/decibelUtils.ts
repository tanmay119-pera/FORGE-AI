export function linearToDb(amplitude: number, floorDb = -96): number {
  const abs = Math.abs(amplitude);
  if (abs <= 0) return floorDb;
  return Math.max(floorDb, Number((20 * Math.log10(abs)).toFixed(2)));
}

export function dbToLinear(db: number): number {
  return Number(Math.pow(10, db / 20).toFixed(6));
}
