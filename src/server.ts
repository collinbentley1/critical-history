import { realpath, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { locations } from "./locations";

const PORT = Number(Bun.env.PORT ?? 3000);
const IS_BUILT_SERVER = import.meta.dir.endsWith("/dist");
const BUILT_PUBLIC_DIR = resolve(import.meta.dir, "public");
const SOURCE_PUBLIC_DIR = resolve(import.meta.dir, "..", "public");
const PUBLIC_DIR = resolve(Bun.env.PUBLIC_DIR ?? (IS_BUILT_SERVER ? BUILT_PUBLIC_DIR : SOURCE_PUBLIC_DIR));
const DEFAULT_MAP_STYLE = "mapbox://styles/collinbentley1/ckd3kwqqw060a1iqgtjne8xs3?optimize=true";
const DEFAULT_TYPEFORM_URL = "https://cdbentley.typeform.com/to/fgEAT2ps";

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'none'; child-src blob:; connect-src 'self' https://api.mapbox.com https://events.mapbox.com; font-src 'self' data:; form-action 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self'; style-src 'self'; worker-src 'self' blob:",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

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
  try {
    const response = withSecurityHeaders(await routeRequest(request));
    return request.method === "HEAD"
      ? new Response(null, { headers: response.headers, status: response.status, statusText: response.statusText })
      : response;
  } catch (error) {
    console.error("request failed", error instanceof Error ? error.name : "unknown error");
    return withSecurityHeaders(new Response("internal server error", { status: 500 }));
  }
}

async function routeRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("method not allowed", {
      headers: { Allow: "GET, HEAD" },
      status: 405,
    });
  }

  if (url.pathname === "/livez") {
    const deployment = Bun.env.PLATFORM_DEPLOY_NONCE;
    return json(deployment ? { ok: true, deployment } : { ok: true }, { "Cache-Control": "no-store" });
  }

  if (url.pathname === "/api/config") {
    return json(
      {
        mapStyle: DEFAULT_MAP_STYLE,
        mapboxAccessToken: readPublicMapboxToken(Bun.env.MAPBOX_PUBLIC_TOKEN),
        typeformUrl: DEFAULT_TYPEFORM_URL,
      },
      { "Cache-Control": "no-store" },
    );
  }

  if (url.pathname === "/api/locations") {
    return json(locations);
  }

  const response = await serveStatic(url.pathname);
  return response;
}

if (import.meta.main) {
  const server = Bun.serve({
    development: false,
    error(error) {
      console.error("server error", error instanceof Error ? error.name : "unknown error");
      return withSecurityHeaders(new Response("internal server error", { status: 500 }));
    },
    fetch: handleRequest,
    hostname: "0.0.0.0",
    maxRequestBodySize: 1_024,
    port: PORT,
  });

  console.info(`listening on ${server.url}`);
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
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

  let fileResult = await resolveExistingFile(PUBLIC_DIR, filePath);

  if (!fileResult && !IS_BUILT_SERVER && PUBLIC_DIR === SOURCE_PUBLIC_DIR) {
    const builtFilePath = resolveStaticPath(BUILT_PUBLIC_DIR, pathname);
    if (builtFilePath) {
      fileResult = await resolveExistingFile(BUILT_PUBLIC_DIR, builtFilePath);
    }
  }

  if (!fileResult && shouldServeAppShell(pathname)) {
    fileResult = await resolveExistingFile(PUBLIC_DIR, resolve(PUBLIC_DIR, "index.html"));
  }

  if (!fileResult) {
    return new Response("not found", { status: 404 });
  }

  return new Response(fileResult.file, {
    headers: {
      "Cache-Control": cacheControl(fileResult.path),
      "Content-Type": CONTENT_TYPES[extname(fileResult.path)] ?? "application/octet-stream",
    },
  });
}

async function resolveExistingFile(publicDir: string, filePath: string): Promise<{ file: ReturnType<typeof Bun.file>; path: string } | undefined> {
  try {
    const [canonicalRoot, canonicalPath] = await Promise.all([realpath(publicDir), realpath(filePath)]);
    if (
      (canonicalPath !== canonicalRoot && !canonicalPath.startsWith(`${canonicalRoot}${sep}`)) ||
      !(await stat(canonicalPath)).isFile()
    ) {
      return undefined;
    }

    return { file: Bun.file(canonicalPath), path: canonicalPath };
  } catch {
    return undefined;
  }
}

function resolveStaticPath(publicDir: string, pathname: string): string | null {
  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decodedPathname.length > 2_048 || /[\u0000-\u001F\u007F]/.test(decodedPathname)) {
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

function readPublicMapboxToken(value: string | undefined): string {
  const token = value?.trim() ?? "";
  if (!token) {
    return "";
  }

  if (!/^pk\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
    throw new Error("MAPBOX_PUBLIC_TOKEN must be a public pk token.");
  }

  return token;
}
