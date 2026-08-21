import { describe, expect, test } from "bun:test";
import { handleRequest } from "../src/server";

describe("server", () => {
  test("returns health status without caching", async () => {
    const response = await handleRequest(new Request("http://localhost/livez"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: true });
  });

  test("returns runtime config without a token by default", async () => {
    const response = await handleRequest(new Request("http://localhost/api/config"));
    const body = (await response.json()) as { mapboxAccessToken: string; mapStyle: string; typeformUrl: string };

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.mapboxAccessToken).toBe("");
    expect(body.mapStyle).toContain("mapbox://styles/");
    expect(body.typeformUrl).toContain("typeform.com");
  });

  test("serves only public Mapbox tokens with fixed approved URLs", async () => {
    const previousToken = Bun.env.MAPBOX_PUBLIC_TOKEN;
    const publicToken = `${["p", "k"].join("")}.${"a".repeat(24)}.${"b".repeat(24)}`;

    try {
      Bun.env.MAPBOX_PUBLIC_TOKEN = publicToken;
      const configured = await handleRequest(new Request("http://localhost/api/config"));
      expect(configured.status).toBe(200);
      expect((await configured.json()).mapboxAccessToken).toBe(publicToken);

      Bun.env.MAPBOX_PUBLIC_TOKEN = `${["s", "k"].join("")}.${"a".repeat(24)}.${"b".repeat(24)}`;
      const secretToken = await handleRequest(new Request("http://localhost/api/config"));
      expect(secretToken.status).toBe(500);
      expect(await secretToken.text()).toBe("internal server error");
    } finally {
      restoreEnv("MAPBOX_PUBLIC_TOKEN", previousToken);
    }
  });

  test("returns sorted location content", async () => {
    const response = await handleRequest(new Request("http://localhost/api/locations"));
    const body = (await response.json()) as Array<{ id: number; title: string }>;

    expect(response.status).toBe(200);
    expect(body).toHaveLength(9);
    expect(body[0]?.id).toBe(0);
    expect(body[0]?.title).toBe("Stiles");
  });

  test("blocks path traversal attempts", async () => {
    const response = await handleRequest(new Request("http://localhost/%2e%2e/package.json"));

    expect(response.status).toBe(404);
  });

  test("rejects control characters and unsupported methods without throwing", async () => {
    const controlPath = await handleRequest(new Request("http://localhost/%00"));
    const unsupportedMethod = await handleRequest(new Request("http://localhost/", { method: "POST" }));

    expect(controlPath.status).toBe(404);
    expect(controlPath.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(unsupportedMethod.status).toBe(405);
    expect(unsupportedMethod.headers.get("Allow")).toBe("GET, HEAD");
    expect(await unsupportedMethod.text()).toBe("method not allowed");
  });

  test("serves app shell for app routes", async () => {
    const response = await handleRequest(new Request("http://localhost/privacy"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/html");
  });

  test("sets strict-transport-security on every response", async () => {
    const paths = ["/livez", "/api/config", "/api/locations", "/", "/privacy", "/does-not-exist.png"];

    for (const path of paths) {
      const response = await handleRequest(new Request(`http://localhost${path}`));
      expect(response.headers.get("Strict-Transport-Security")).toBe("max-age=31536000; includeSubDomains");
      expect(response.headers.get("Content-Security-Policy")).toContain("connect-src 'self' https://api.mapbox.com");
      expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    }
  });

  test("strips response bodies from API HEAD requests", async () => {
    const response = await handleRequest(new Request("http://localhost/api/locations", { method: "HEAD" }));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
    expect(response.headers.get("Content-Type")).toContain("application/json");
  });
});

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete Bun.env[key];
  } else {
    Bun.env[key] = value;
  }
}
