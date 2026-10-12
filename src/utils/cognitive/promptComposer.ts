export function composeActionPrompt(intent: string, userQuery: string, hints: string[] = []): string {
  const hintBlock = hints.length > 0 ? `Context Hints: ${hints.join(" | ")}` : "Context Hints: None";
  return `[INTENT:${intent}]\n${hintBlock}\nUser Utterance: ${userQuery.trim()}`;
}
