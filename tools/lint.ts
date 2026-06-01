import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { locations, validateLocationSet } from "../src/locations";

const root = join(import.meta.dir, "..");
const failures: string[] = [];

await requireContains("Dockerfile", "dhi.io/bun", "Dockerfile must use Docker Hardened Bun images.");
await requireContains("Dockerfile", "bun upgrade --canary", "Dockerfile must upgrade Bun to the latest canary.");
await requireContains("public/index.html", 'rel="icon"', "The document must link a favicon.");
await rejectContains("public/index.html", "https://", "The document should not load third-party scripts or styles.");
await rejectContains("public/assets/styles.css", "@import", "Styles should not import third-party design libraries.");
await rejectContains("src/client.ts", "react", "The frontend should stay framework-free.");
await rejectContains("src/client.ts", "innerHTML", "Markdown rendering should use DOM nodes instead of HTML injection.");

for (const locationError of validateLocationSet(locations)) {
  failures.push(`src/locations: ${locationError}`);
}

await import("./verify-socket-config.ts");

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

async function requireContains(path: string, needle: string, message: string): Promise<void> {
  const text = await readFile(join(root, path), "utf8");
  if (!text.includes(needle)) {
    failures.push(`${path}: ${message}`);
  }
}

async function rejectContains(path: string, needle: string, message: string): Promise<void> {
  const text = await readFile(join(root, path), "utf8");
  if (text.includes(needle)) {
    failures.push(`${path}: ${message}`);
  }
}
