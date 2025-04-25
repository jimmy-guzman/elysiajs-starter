import { Elysia } from "elysia";
import { describe, expect, it } from "vitest";

import { healthRoutes } from "./health";

const app = new Elysia().use(healthRoutes);

describe("GET /health", () => {
  it("should return { ok: true }", async () => {
    const res = await app.handle(new Request("http://localhost/health"));

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data).toEqual({ ok: true });
  });
});
