export function splitIntoStreamChunks(text: string, chunkSize = 12): string[] {
  if (!text) return [];
  const out: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) out.push(text.slice(i, i + chunkSize));
  return out;
}
