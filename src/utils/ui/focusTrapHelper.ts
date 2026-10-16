export function nextFocusIndex(current: number, total: number, shiftKey: boolean): number {
  if (total <= 0) return -1;
  return shiftKey ? (current - 1 + total) % total : (current + 1) % total;
}
