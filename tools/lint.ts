import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { locations, validateLocationSet } from "../src/locations";

const root = join(import.meta.dir, "..");
const failures: string[] = [];

await requireContains("Dockerfile", "dhi.io/bun", "Dockerfile must use Docker Hardened Bun images.");
await requireContains(
  "Dockerfile",
  "FROM oven/bun:1.4.0-alpine@sha256:",
  "Dockerfile must pin Bun 1.4.0 by digest.",
);
await requireContains("public/index.html", 'rel="icon"', "The document must link a favicon.");
await rejectPattern(
  "public/index.html",
  /<(?:script[^>]*\ssrc|link[^>]*\shref)="https?:\/\//,
  "The document should not load third-party scripts or styles.",
);
await rejectContains("public/assets/styles.css", "@import", "Styles should not import third-party design libraries.");
await rejectContains("src/client.ts", "react", "The frontend should stay framework-free.");
await rejectContains("src/client.ts", "innerHTML", "Markdown rendering should use DOM nodes instead of HTML injection.");
await rejectContains("src/server.ts", "MAPBOX_ACCESS_TOKEN", "The app must never expose a secret-capable Mapbox token variable.");
await requireContains("src/server.ts", "MAPBOX_PUBLIC_TOKEN", "The app must use a validated public Mapbox token variable.");
await requireContains(
  "src/server.ts",
  "Bun.env.PLATFORM_DEPLOY_NONCE",
  "Preview health must echo the platform deployment nonce.",
);
await rejectContains("src/server.ts", "Bun.env.MAPBOX_STYLE", "The approved Mapbox style must not drift through runtime configuration.");
await rejectContains("src/server.ts", "Bun.env.TYPEFORM_URL", "The approved Typeform URL must not drift through runtime configuration.");
await requireContains("src/server.ts", "Content-Security-Policy", "Every response must carry a Content Security Policy.");
await rejectPattern("src/server.ts", /\bset-cookie\b/i, "The server must not issue cookies.");
await rejectPattern(
  "src/client.ts",
  /\b(?:document\s*\.\s*cookie|cookieStore\s*\.\s*(?:set|delete))\b/i,
  "The client must not create or delete browser cookies.",
);
for (const path of ["src/server.ts", "src/client.ts"]) {
  await rejectPattern(
    path,
    /\bdomain\s*=\s*\.?ycriticalhistory\.org\b/i,
    "Application code must not create a parent-domain cookie.",
  );
}
await rejectContains("tools/build.ts", "sourcemap", "Production builds must not publish source maps or embedded sources.");

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

async function rejectPattern(path: string, pattern: RegExp, message: string): Promise<void> {
  const text = await readFile(join(root, path), "utf8");
  if (pattern.test(text)) {
    failures.push(`${path}: ${message}`);
  }
}
