# FORGE-AI Subsystem Architecture

- `src/utils/audio`: Real-time VAD, ZCR, noise gate, PCM resampling, and ring buffering.
- `src/utils/mcp`: Tool registry, schema guard, rate limiting, and circuit breakers.
- `src/utils/cognitive`: Intent routing, episodic memory, context window trimming.
- `src/utils/parsers`: Voice slot extractors and safe deep links.
- `src/utils/telemetry`, `security`, `agents`, `sim`, `ui`: Observability, PII protection, agent handoffs, and replay tests.
