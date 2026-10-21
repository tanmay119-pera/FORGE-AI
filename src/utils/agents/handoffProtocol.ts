export interface HandoffPacket { fromAgent: string; toAgent: string; task: string; hopCount: number; }
export function createHandoff(fromAgent: string, toAgent: string, task: string, prevHop = 0, maxHops = 4): HandoffPacket {
  if (prevHop + 1 > maxHops) throw new Error("Max agent handoff depth exceeded");
  return { fromAgent, toAgent, task: task.trim(), hopCount: prevHop + 1 };
}
