import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const distDir = join(root, "dist");
const publicDir = join(root, "public");
const distPublicDir = join(distDir, "public");

await rm(distDir, { force: true, recursive: true });
await mkdir(distPublicDir, { recursive: true });
await cp(publicDir, distPublicDir, { recursive: true });

await Bun.write(join(distPublicDir, "privacy.md"), Bun.file(join(root, "src", "privacy.md")));
await Bun.write(join(distPublicDir, "assets", "mapbox-gl.css"), Bun.file(join(root, "node_modules", "mapbox-gl", "dist", "mapbox-gl.css")));

const clientBuild = await Bun.build({
  entrypoints: [join(root, "src", "client.ts")],
  format: "esm",
  minify: true,
  naming: "assets/client.js",
  outdir: distPublicDir,
  splitting: true,
  sourcemap: "external",
  target: "browser",
});

assertBuild(clientBuild, "client");

const serverBuild = await Bun.build({
  entrypoints: [join(root, "src", "server.ts")],
  external: ["*.html", "*.css", "*.jpg", "*.md", "*.png", "*.svg", "*.webmanifest", "*.xml"],
  minify: false,
  outdir: distDir,
  sourcemap: "external",
  target: "bun",
});

assertBuild(serverBuild, "server");

function assertBuild(result: Bun.BuildOutput, label: string): void {
  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }

    throw new Error(`${label} build failed`);
  }
}
