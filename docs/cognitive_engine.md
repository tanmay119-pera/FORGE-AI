# Cognitive Memory & Routing Architecture

## Pipeline Flow
1. Transcript passes through `classifyVoiceIntent` to identify domain intent.
2. Relevant facts are retrieved from `EpisodicMemoryStore`.
3. `trimContextWindow` guarantees system constraints stay pinned within token bounds.
4. `CognitiveTraceBuilder` captures per-stage latencies for `CognitiveTraceDrawer`.
