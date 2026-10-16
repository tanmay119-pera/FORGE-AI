import test from "node:test";
import assert from "node:assert/strict";
import { getSurfaceClasses } from "../src/utils/ui/themeTokens.ts";
test("getSurfaceClasses resolves dark and light palettes", () => {
  assert.ok(getSurfaceClasses("dark").includes("bg-slate-950"));
  assert.ok(getSurfaceClasses("light").includes("bg-white"));
});
