import type { MCPLogEntry } from "../../types.ts";

export function countByDirection(logs: MCPLogEntry[]): { outbound: number; inbound: number } {
  let outbound = 0;
  let inbound = 0;
  for (const l of logs) {
    if (l.direction === "client_to_server") outbound++;
    else inbound++;
  }
  return { outbound, inbound };
}
