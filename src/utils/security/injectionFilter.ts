const TRIGGERS = [/ignore previous instructions/i, /reveal system prompt/i, /bypass safety/i, /developer mode override/i];
export function scanPromptInjection(input: string): { flagged: boolean; matches: number } {
  let matches = 0;
  for (const rx of TRIGGERS) if (rx.test(input)) matches++;
  return { flagged: matches > 0, matches };
}
