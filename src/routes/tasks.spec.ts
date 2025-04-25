import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db";
import { user } from "@/db/schemas/auth";
import { projects, tasks } from "@/db/schemas/tasks";
import { tasksRoutes } from "./tasks";

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

const app = new Elysia().use(tasksRoutes);

describe("GET /tasks", () => {
  beforeEach(async () => {
    await db.delete(tasks);
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
    const res = await app.handle(new Request("http://localhost/tasks"));

    const data = await res.json();

    expect(data).toStrictEqual([]);
  });

  it("should create a new task", async () => {
    const [project] = await db
      .insert(projects)
      .values({
        name: "test-project",
        ownerId: "user_123",
      })
      .returning({ id: projects.id });

    const res = await app.handle(
      new Request("http://localhost/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "test-task",
          projectId: project?.id,
        }),
      }),
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data).toMatchObject({ title: "test-task", projectId: project?.id });
  });
});
