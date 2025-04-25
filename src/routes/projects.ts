import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "@/db";
import { projects, projectTags } from "@/db/schemas/tasks";
import { betterAuth } from "@/plugins/auth";

export const projectsRoutes = new Elysia({
  prefix: "/projects",
  tags: ["Projects"],
})
  .use(betterAuth)
  .get(
    "/",
    async ({ user }) => {
      return db.select().from(projects).where(eq(projects.ownerId, user.id));
    },
    {
      auth: true,
      detail: {
        summary: "List all projects for the current user",
      },
    },
  )

  .post(
    "/",
    async ({ body, user }) => {
      const [created] = await db
        .insert(projects)
        .values({
          name: body.name,
          description: body.description,
          ownerId: user.id,
        })
        .returning();

      return created;
    },
    {
      auth: true,
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
      detail: {
        summary: "Create a new project",
      },
    },
  )

  .get(
    "/:id",
    async ({ params, user, set }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, params.id));

      if (!project || project.ownerId !== user.id) {
        set.status = 404;
        return { error: "not_found" };
      }

      return project;
    },
    {
      auth: true,
      detail: {
        summary: "Get a single project by ID",
      },
    },
  )

  .put(
    "/:id",
    async ({ params, body, user, set }) => {
      const [existing] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, params.id));
      if (!existing || existing.ownerId !== user.id) {
        set.status = 404;
        return { error: "not_found" };
      }

      const [updated] = await db
        .update(projects)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, params.id))
        .returning();

      return updated;
    },
    {
      auth: true,
      body: t.Partial(
        t.Object({
          name: t.String({ minLength: 1 }),
          description: t.String(),
        }),
      ),
      detail: {
        summary: "Update a project by ID",
      },
    },
  )

  .delete(
    "/:id",
    async ({ params, user, set }) => {
      const [existing] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, params.id));
      if (!existing || existing.ownerId !== user.id) {
        set.status = 404;
        return { error: "not_found" };
      }

      await db.delete(projects).where(eq(projects.id, params.id));
      return { success: true };
    },
    {
      auth: true,
      detail: {
        summary: "Delete a project by ID",
      },
    },
  )

  .post(
    "/:id/tags",
    async ({ params, body, user, set }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, params.id));
      if (!project || project.ownerId !== user.id) {
        set.status = 404;
        return { error: "not_found" };
      }
      const values = body.tagIds.map((tagId) => ({
        projectId: params.id,
        tagId,
      }));
      await db.insert(projectTags).values(values).onConflictDoNothing();
      return { success: true };
    },
    {
      auth: true,
      body: t.Object({ tagIds: t.Array(t.String()) }),
      detail: {
        summary: "Attach tags to a project",
      },
    },
  )

  .delete(
    "/:id/tags/:tagId",
    async ({ params, user, set }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, params.id));
      if (!project || project.ownerId !== user.id) {
        set.status = 404;
        return { error: "not_found" };
      }
      await db
        .delete(projectTags)
        .where(
          and(
            eq(projectTags.projectId, params.id),
            eq(projectTags.tagId, params.tagId),
          ),
        );
      return { success: true };
    },
    {
      auth: true,
      detail: {
        summary: "Detach a tag from a project",
      },
    },
  );
