export async function withExponentialRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 5
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        const delay = baseDelayMs * (2 ** attempt);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}
