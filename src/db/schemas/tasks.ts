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
  createdAt: timestamp("created_at").defaultNow(),
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
});

export const projects = pgTable("projects", {
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: text("owner_id").references(() => user.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  dueAt: timestamp("due_at"),
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id").references(() => user.id),
  parentId: uuid("parent_id").references((): AnyPgColumn => tasks.id, {
    onDelete: "cascade",
  }),
  priority: integer("priority").default(0),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  status: text("status")
    .$type<"todo" | "in_progress" | "done">()
    .default("todo"),
  title: text("title").notNull(),
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
    tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }),
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.tagId] })],
);
