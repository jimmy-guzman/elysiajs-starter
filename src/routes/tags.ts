import { asc, desc, ilike } from "drizzle-orm";
import { Elysia, t } from "elysia";

import { db } from "@/db";
import { tags } from "@/db/schemas/tasks";
import { betterAuth } from "@/plugins/auth";

export const tagsRoutes = new Elysia({
  prefix: "/tags",
  tags: ["Tags"],
})
  .use(betterAuth)
  .get(
    "/",
    ({ query }) => {
      const order = query.sort === "desc" ? desc(tags.name) : asc(tags.name);

      if (query.q) {
        return db
          .select()
          .from(tags)
          .where(ilike(tags.name, `%${query.q}%`))
          .orderBy(order);
      }

      return db.select().from(tags).orderBy(order);
    },
    {
      auth: true,
      detail: {
        summary: "List all tags with optional search and sort",
      },
      query: t.Object({
        q: t.Optional(t.String()),
        sort: t.Optional(t.Enum({ asc: "asc", desc: "desc" })),
      }),
    },
  )
  .post(
    "/",
    async ({ body }) => {
      const [created] = await db
        .insert(tags)
        .values({ name: body.name })
        .returning();

      return created;
    },
    {
      auth: true,
      body: t.Object({ name: t.String({ minLength: 1 }) }),
      detail: {
        summary: "Create a new tag",
      },
    },
  );
