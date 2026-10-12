export function summarizeTurnLength(turns: { content: string }[]): { count: number; totalChars: number } {
  return {
    count: turns.length,
    totalChars: turns.reduce((acc, t) => acc + t.content.length, 0),
  };
}
