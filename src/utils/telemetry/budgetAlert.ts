export function exceedsLatencyBudget(actualMs: number, budgetMs = 800): boolean { return actualMs > budgetMs; }
