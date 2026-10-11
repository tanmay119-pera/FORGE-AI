import type { MCPToolDefinition } from "../../types.ts";

export interface ValidationOutcome {
  valid: boolean;
  errors: string[];
}

export function validateToolArgs(
  def: MCPToolDefinition,
  args: Record<string, unknown>
): ValidationOutcome {
  const errors: string[] = [];
  const required = def.parameters.required || [];
  for (const reqKey of required) {
    if (args[reqKey] === undefined || args[reqKey] === null || args[reqKey] === "") {
      errors.push(`Missing required parameter: ${reqKey}`);
    }
  }
  for (const [key, prop] of Object.entries(def.parameters.properties)) {
    if (args[key] === undefined) continue;
    if (prop.enum && !prop.enum.includes(String(args[key]))) {
      errors.push(`Parameter ${key} must be one of: ${prop.enum.join(", ")}`);
    }
  }
  return { valid: errors.length === 0, errors };
}
