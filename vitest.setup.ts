import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { vi } from "vitest";

import * as authSchemas from "./src/db/schemas/auth";
import * as tasksSchemas from "./src/db/schemas/tasks";

async function mockDb() {
  // use require to defeat dynamic require error
  // (https://github.com/drizzle-team/drizzle-orm/issues/2853#issuecomment-2668459509)
  const { createRequire } =
    await vi.importActual<typeof import("node:module")>("node:module");

  const require = createRequire(import.meta.url);

  const { pushSchema } =
    require("drizzle-kit/api") as typeof import("drizzle-kit/api");

  const client = new PGlite();

  const db = drizzle(client, { schema: { ...authSchemas, ...tasksSchemas } });

  const { apply } = await pushSchema(
    { ...authSchemas, ...tasksSchemas },
    // biome-ignore lint/suspicious/noExplicitAny: this is okay during tests
    db as any,
  );

  await apply();

  return { db, ...authSchemas, ...tasksSchemas };
}

vi.mock("@/db", mockDb);
