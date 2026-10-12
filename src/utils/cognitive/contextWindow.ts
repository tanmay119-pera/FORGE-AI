import { estimateTokenCount } from "./tokenEstimator.ts";

export interface ConversationTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

export function trimContextWindow(
  turns: ConversationTurn[],
  maxTokens = 2000
): ConversationTurn[] {
  const systemTurns = turns.filter((t) => t.role === "system");
  const dialogTurns = turns.filter((t) => t.role !== "system");
  let budget = maxTokens - systemTurns.reduce((s, t) => s + estimateTokenCount(t.content), 0);
  const keptReversed: ConversationTurn[] = [];
  for (let idx = dialogTurns.length - 1; idx >= 0; idx--) {
    const cost = estimateTokenCount(dialogTurns[idx].content);
    if (budget - cost < 0 && keptReversed.length > 0) break;
    budget -= cost;
    keptReversed.push(dialogTurns[idx]);
  }
  return [...systemTurns, ...keptReversed.reverse()];
}
