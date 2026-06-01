import { describe, expect, test } from "bun:test";
import { handleRequest } from "../src/server";

describe("server", () => {
  test("returns health status without caching", async () => {
    const response = await handleRequest(new Request("http://localhost/healthz"));

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

  test("serves app shell for app routes", async () => {
    const response = await handleRequest(new Request("http://localhost/privacy"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/html");
  });
});
