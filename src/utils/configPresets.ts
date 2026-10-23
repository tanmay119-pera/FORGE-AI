export interface CopilotPreset {
  name: string;
  maxContextTokens: number;
  vadThreshold: number;
  latencyBudgetMs: number;
}

export const COPILOT_PRESETS: Record<string, CopilotPreset> = {
  lowLatency: { name: "Low Latency", maxContextTokens: 1200, vadThreshold: 0.025, latencyBudgetMs: 600 },
  balanced: { name: "Balanced", maxContextTokens: 2400, vadThreshold: 0.02, latencyBudgetMs: 900 },
  deepReasoning: { name: "Deep Reasoning", maxContextTokens: 4000, vadThreshold: 0.015, latencyBudgetMs: 1500 },
};
