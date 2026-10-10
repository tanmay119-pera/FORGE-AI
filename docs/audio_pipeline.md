# Audio & Voice Stream Pipeline

## Processing Stages
1. **Silence Trimming** (`trimLeadingTrailingSilence`): Drops leading/trailing ambient frames.
2. **Noise Gating** (`applyNoiseGate`): Attenuates background hum below threshold.
3. **Peak Normalization** (`normalizePeak`): Stabilizes input dynamics before PCM encoding.
4. **Voice Activity Detection** (`detectVoiceActivity`): Combines RMS energy with Zero Crossing Rate (ZCR).
