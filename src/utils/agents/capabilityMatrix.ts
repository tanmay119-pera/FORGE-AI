export function hasAllCapabilities(agentCaps: string[], required: string[]): boolean {
  const set = new Set(agentCaps);
  return required.every((r) => set.has(r));
}
