# MCP Tool Governance & Execution Layer

## Safety Controls
- **Schema Validation** (`validateToolArgs`): Rejects malformed arguments prior to dispatch.
- **Sliding Window Limiting** (`SlidingWindowLimiter`): Protects rate-limited APIs.
- **Circuit Breaking** (`MCPCircuitBreaker`): Fails fast during upstream service outages.
