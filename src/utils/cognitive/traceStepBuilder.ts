export interface CognitiveStep {
  id: string;
  phase: "perceive" | "plan" | "tool" | "synthesize";
  detail: string;
  durationMs: number;
}

export class CognitiveTraceBuilder {
  private steps: CognitiveStep[] = [];

  addStep(phase: CognitiveStep["phase"], detail: string, durationMs = 0): void {
    this.steps.push({ id: `step_${this.steps.length + 1}`, phase, detail, durationMs });
  }

  build(): CognitiveStep[] {
    return [...this.steps];
  }
}
