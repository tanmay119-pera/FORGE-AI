export function buildPersonaSystemPrompt(role: string, constraints: string[]): string {
  return `Role: ${role}\nRules:\n${constraints.map((c, idx) => `${idx + 1}. ${c}`).join("\n")}`;
}
