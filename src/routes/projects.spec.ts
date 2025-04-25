import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db";
import { user } from "@/db/schemas/auth";
import { projects } from "@/db/schemas/tasks";
import { projectsRoutes } from "./projects";

vi.mock("@/plugins/auth", () => {
  const { Elysia } = require("elysia");

  return {
    betterAuth: new Elysia().macro({
      auth: {
        resolve() {
          return {
            user: { id: "user_123" },
            session: { id: "session_abc" },
          };
        },
      },
    }),
  };
});

const app = new Elysia().use(projectsRoutes);

describe("GET /projects", () => {
  beforeEach(async () => {
    await db.delete(projects);
    await db.delete(user);

    await db.insert(user).values({
      id: "user_123",
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it("should return an empty array initially", async () => {
    const res = await app.handle(new Request("http://localhost/projects"));
    const data = await res.json();

    expect(data).toStrictEqual([]);
  });

  it("should return projects including the newly created one", async () => {
    await db.insert(projects).values({
      name: "sample-project",
      ownerId: "user_123",
    });

    const res = await app.handle(new Request("http://localhost/projects"));
    const data = await res.json();

    expect(data).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "sample-project" }),
      ]),
    );
  });

  it("should create a new project", async () => {
    const res = await app.handle(
      new Request("http://localhost/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "test-project" }),
      }),
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data).toMatchObject({
      name: "test-project",
      ownerId: "user_123",
    });
  });
});
