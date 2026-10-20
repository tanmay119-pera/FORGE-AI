# Security Architecture
All telemetry logs pass through `redactPii()`, and external links must pass `isAllowedExternalUrl()`.
