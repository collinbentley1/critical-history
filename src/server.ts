import { extname, resolve, sep } from "node:path";
import { locations } from "./locations";

const PORT = Number(Bun.env.PORT ?? 3000);
const IS_BUILT_SERVER = import.meta.dir.endsWith("/dist");
const BUILT_PUBLIC_DIR = resolve(import.meta.dir, "public");
const SOURCE_PUBLIC_DIR = resolve(import.meta.dir, "..", "public");
const PUBLIC_DIR = resolve(Bun.env.PUBLIC_DIR ?? (IS_BUILT_SERVER ? BUILT_PUBLIC_DIR : SOURCE_PUBLIC_DIR));

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("method not allowed", {
      headers: { Allow: "GET, HEAD" },
      status: 405,
    });
  }

  if (url.pathname === "/healthz" || url.pathname === "/readyz") {
    return json({ ok: true }, { "Cache-Control": "no-store" });
  }

  if (url.pathname === "/api/config") {
    return json(
      {
        mapStyle: Bun.env.MAPBOX_STYLE ?? "mapbox://styles/collinbentley1/ckd3kwqqw060a1iqgtjne8xs3?optimize=true",
        mapboxAccessToken: Bun.env.MAPBOX_ACCESS_TOKEN ?? "",
        typeformUrl: Bun.env.TYPEFORM_URL ?? "https://cdbentley.typeform.com/to/fgEAT2ps",
      },
      { "Cache-Control": "no-store" },
    );
  }

  if (url.pathname === "/api/locations") {
    return json(locations);
  }

  const response = await serveStatic(url.pathname);
  return request.method === "HEAD" ? new Response(null, { headers: response.headers, status: response.status, statusText: response.statusText }) : response;
}

if (import.meta.main) {
  const server = Bun.serve({
    fetch: handleRequest,
    hostname: "0.0.0.0",
    port: PORT,
  });

  console.info(`listening on ${server.url}`);
}

function json(body: unknown, headers: HeadersInit = {}, status = 200): Response {
  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=60",
      ...headers,
    },
    status,
  });
}

async function serveStatic(pathname: string): Promise<Response> {
  const filePath = resolveStaticPath(PUBLIC_DIR, pathname);
  if (!filePath) {
    return new Response("not found", { status: 404 });
  }

  let file = Bun.file(filePath);
  let pathForType = file.name ?? filePath;

  if (!(await file.exists()) && !IS_BUILT_SERVER && PUBLIC_DIR === SOURCE_PUBLIC_DIR) {
    const builtFilePath = resolveStaticPath(BUILT_PUBLIC_DIR, pathname);
    if (builtFilePath) {
      const builtFile = Bun.file(builtFilePath);
      if (await builtFile.exists()) {
        file = builtFile;
        pathForType = builtFile.name ?? builtFilePath;
      }
    }
  }

  if (!(await file.exists()) && shouldServeAppShell(pathname)) {
    file = Bun.file(resolve(PUBLIC_DIR, "index.html"));
    pathForType = file.name ?? resolve(PUBLIC_DIR, "index.html");
  }

  if (!(await file.exists())) {
    return new Response("not found", { status: 404 });
  }

  return new Response(file, {
    headers: {
      "Cache-Control": cacheControl(pathForType),
      "Content-Type": CONTENT_TYPES[extname(pathForType)] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function resolveStaticPath(publicDir: string, pathname: string): string | null {
  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = decodedPathname === "/" ? "index.html" : decodedPathname.replace(/^\/+/, "");
  const requestedPath = relativePath === "favicon.ico" ? "icons/favicon.ico" : relativePath;
  const resolvedPath = resolve(publicDir, requestedPath);

  if (resolvedPath !== publicDir && !resolvedPath.startsWith(`${publicDir}${sep}`)) {
    return null;
  }

  return resolvedPath;
}

function shouldServeAppShell(pathname: string): boolean {
  return !pathname.startsWith("/api/") && extname(pathname) === "";
}

function cacheControl(path: string): string {
  return path.endsWith(".css") || path.endsWith(".html") || path.endsWith(".js") ? "no-cache" : "public, max-age=300";
}
