import { and, eq, isNull } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "@/db";
import { tasks, taskTags } from "@/db/schemas/tasks";
import { betterAuth } from "@/plugins/auth";

const statusSchema = t.Union([
  t.Literal("todo"),
  t.Literal("in_progress"),
  t.Literal("done"),
]);

export const tasksRoutes = new Elysia({ prefix: "/tasks", tags: ["Tasks"] })
  .use(betterAuth)
  .get(
    "/",
    ({ query, user }) => {
      const where = and(
        eq(tasks.ownerId, user.id),
        query.projectId ? eq(tasks.projectId, query.projectId) : undefined,
        query.parentId === null
          ? isNull(tasks.parentId)
          : query.parentId
            ? eq(tasks.parentId, query.parentId)
            : undefined,
        query.status ? eq(tasks.status, query.status) : undefined,
      );

      return db.select().from(tasks).where(where);
    },
    {
      auth: true,
      detail: {
        summary: "List all tasks for the current user",
      },
      query: t.Object({
        parentId: t.Optional(t.Union([t.String(), t.Null()])),
        projectId: t.Optional(t.String()),
        status: t.Optional(statusSchema),
      }),
    },
  )

  .post(
    "/",
    async ({ body, user }) => {
      const [created] = await db
        .insert(tasks)
        .values({
          ...body,
          dueAt: body.dueAt ? new Date(body.dueAt) : null,
          ownerId: user.id,
        })
        .returning();
      return created;
    },
    {
      auth: true,
      body: t.Object({
        dueAt: t.Optional(t.String()),
        parentId: t.Optional(t.String()),
        priority: t.Optional(t.Number()),
        projectId: t.String(),
        status: t.Optional(statusSchema),
        title: t.String({ minLength: 1 }),
      }),
      detail: {
        summary: "Create a new task",
      },
    },
  )

  .get(
    "/:id",
    async ({ params, user, set }) => {
      const [task] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, params.id));

      if (!task || task.ownerId !== user.id) {
        set.status = 404;

        return { error: "not_found" };
      }

      return task;
    },
    {
      auth: true,
      detail: {
        summary: "Get a single task by ID",
      },
    },
  )

  .put(
    "/:id",
    async ({ params, body, user, set }) => {
      const [existing] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, params.id));

      if (!existing || existing.ownerId !== user.id) {
        set.status = 404;

        return { error: "not_found" };
      }

      const [updated] = await db
        .update(tasks)
        .set({
          ...body,
          dueAt: body.dueAt ? new Date(body.dueAt) : null,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, params.id))
        .returning();

      return updated;
    },
    {
      auth: true,
      body: t.Partial(
        t.Object({
          completed: t.Boolean(),
          dueAt: t.String(),
          priority: t.Number(),
          status: statusSchema,
          title: t.String(),
        }),
      ),
      detail: {
        summary: "Update a task by ID",
      },
    },
  )

  .delete(
    "/:id",
    async ({ params, user, set }) => {
      const [existing] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, params.id));

      if (!existing || existing.ownerId !== user.id) {
        set.status = 404;

        return { error: "not_found" };
      }

      await db.delete(tasks).where(eq(tasks.id, params.id));

      return { success: true };
    },
    {
      auth: true,
      detail: {
        summary: "Delete a task by ID",
      },
    },
  )

  .post(
    "/:id/tags",
    async ({ params, body, user, set }) => {
      const [task] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, params.id));

      if (!task || task.ownerId !== user.id) {
        set.status = 404;

        return { error: "not_found" };
      }

      const values = body.tagIds.map((tagId) => ({ tagId, taskId: params.id }));

      await db.insert(taskTags).values(values).onConflictDoNothing();

      return { success: true };
    },
    {
      auth: true,
      body: t.Object({ tagIds: t.Array(t.String()) }),
      detail: {
        summary: "Attach tags to a task",
      },
    },
  )

  .delete(
    "/:id/tags/:tagId",
    async ({ params, user, set }) => {
      const [task] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, params.id));

      if (!task || task.ownerId !== user.id) {
        set.status = 404;

        return { error: "not_found" };
      }

      await db
        .delete(taskTags)
        .where(
          and(eq(taskTags.taskId, params.id), eq(taskTags.tagId, params.tagId)),
        );

      return { success: true };
    },
    {
      auth: true,
      detail: {
        summary: "Detach a tag from a task",
      },
    },
  )

  .get(
    "/:id/subtasks",
    async ({ params, user, set }) => {
      const [parent] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, params.id));

      if (!parent || parent.ownerId !== user.id) {
        set.status = 404;

        return { error: "not_found" };
      }

      return db.select().from(tasks).where(eq(tasks.parentId, params.id));
    },
    {
      auth: true,
      detail: {
        summary: "Get direct subtasks for a task",
      },
    },
  );
