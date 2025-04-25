import {
  type AnyPgColumn,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  parentId: uuid("parent_id").references((): AnyPgColumn => tasks.id, {
    onDelete: "cascade",
  }),
  ownerId: text("owner_id").references(() => user.id),
  title: text("title").notNull(),
  status: text("status")
    .$type<"todo" | "in_progress" | "done">()
    .default("todo"),
  priority: integer("priority").default(0),
  dueAt: timestamp("due_at"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectTags = pgTable(
  "project_tags",
  {
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.tagId] })],
);

export const taskTags = pgTable(
  "task_tags",
  {
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.tagId] })],
);
