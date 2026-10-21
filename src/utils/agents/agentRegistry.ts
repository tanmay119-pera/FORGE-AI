export interface AgentProfile { id: string; role: string; capabilities: string[]; }
export class AgentRegistry {
  private agents = new Map<string, AgentProfile>();
  register(profile: AgentProfile): void { this.agents.set(profile.id, profile); }
  findByCapability(cap: string): AgentProfile[] {
    return [...this.agents.values()].filter((a) => a.capabilities.includes(cap));
  }
  list(): AgentProfile[] { return [...this.agents.values()]; }
}
