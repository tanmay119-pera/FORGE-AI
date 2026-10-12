const STOPWORDS = new Set(["the", "is", "at", "which", "on", "a", "an", "and", "or", "to"]);

export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}
