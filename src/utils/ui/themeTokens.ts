import type { ThemeMode } from "../../types.ts";
export function getSurfaceClasses(mode: ThemeMode): string {
  return mode === "dark" ? "bg-slate-950 text-slate-100 border-slate-800" : "bg-white text-slate-900 border-slate-200";
}
