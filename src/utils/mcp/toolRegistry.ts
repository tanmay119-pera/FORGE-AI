import type { MCPToolDefinition } from "../../types.ts";

export interface RegisteredTool {
  definition: MCPToolDefinition;
  category: string;
  deprecated?: boolean;
}

export class MCPToolRegistry {
  private tools = new Map<string, RegisteredTool>();

  register(definition: MCPToolDefinition, category = "general", deprecated = false): void {
    this.tools.set(definition.name, { definition, category, deprecated });
  }

  get(name: string): RegisteredTool | undefined {
    return this.tools.get(name);
  }

  listByCategory(category: string): RegisteredTool[] {
    return [...this.tools.values()].filter((t) => t.category === category);
  }

  listActive(): RegisteredTool[] {
    return [...this.tools.values()].filter((t) => !t.deprecated);
  }
}
