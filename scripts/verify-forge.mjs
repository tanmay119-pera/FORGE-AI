import fs from "node:fs";
import path from "node:path";

const utilDirs = fs.readdirSync(path.join(process.cwd(), "src/utils"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

console.log(`Verified ${utilDirs.length} FORGE-AI utility subsystems:`, utilDirs.join(", "));
