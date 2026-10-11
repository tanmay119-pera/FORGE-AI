# Exponential Backoff & Resilience Policy

Transient tool timeouts use `withExponentialRetry(op, 3, 250)` paired with circuit breaking to prevent cascading stalls across voice turns.
