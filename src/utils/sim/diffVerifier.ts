export function arraysMatch<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((v, idx) => v === b[idx]);
}
