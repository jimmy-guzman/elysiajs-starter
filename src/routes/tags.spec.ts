import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db";
import { tags } from "@/db/schemas/tasks";

import { tagsRoutes } from "./tags";

vi.mock("@/plugins/auth", async () => {
  const { Elysia } = await import("elysia");

  return {
    betterAuth: new Elysia().macro({
      auth: {
        resolve() {
          return {
            session: { id: "session_abc" },
            user: { id: "user_123" },
          };
        },
      },
    }),
  };
});

const app = new Elysia().use(tagsRoutes);

describe("GET /tags", () => {
  beforeEach(async () => {
    await db.delete(tags);
  });

  it("should return an empty array initially", async () => {
    const res = await app.handle(new Request("http://localhost/tags"));

    const data = await res.json();

    expect(data).toStrictEqual([]);
  });

  it("should return tags including the newly created one", async () => {
    await db.insert(tags).values({ name: "sample-tag" });

    const res = await app.handle(new Request("http://localhost/tags"));

    const data = await res.json();

    expect(data).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ name: "sample-tag" })]),
    );
  });

  it("should support sorting tags", async () => {
    await db.insert(tags).values([{ name: "b-tag" }, { name: "a-tag" }]);

    const res = await app.handle(new Request("http://localhost/tags?sort=asc"));

    const data = await res.json();

    expect(data).toStrictEqual([
      expect.objectContaining({ name: "a-tag" }),
      expect.objectContaining({ name: "b-tag" }),
    ]);
  });

  it("should support search filtering", async () => {
    await db
      .insert(tags)
      .values([
        { name: "frontend" },
        { name: "backend" },
        { name: "fullstack" },
      ]);

    const res = await app.handle(new Request("http://localhost/tags?q=end"));

    const data = await res.json();

    expect(data).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "frontend" }),
        expect.objectContaining({ name: "backend" }),
        expect.not.objectContaining({ name: "fullstack" }),
      ]),
    );
  });

  it("should create a new tag", async () => {
    const res = await app.handle(
      new Request("http://localhost/tags", {
        body: JSON.stringify({ name: "test-tag" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data).toMatchObject({
      name: "test-tag",
    });
  });
});
