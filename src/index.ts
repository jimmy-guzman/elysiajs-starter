import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import env from "./lib/env";
import { betterAuth } from "./plugins/auth";
import { openAPI } from "./plugins/open-api";
import { healthRoutes } from "./routes/health";
import { projectsRoutes } from "./routes/projects";
import { tagsRoutes } from "./routes/tags";
import { tasksRoutes } from "./routes/tasks";

const app = new Elysia()
  .use(
    cors({
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      origin: `http://localhost:${env.PORT}`,
    }),
  )
  .use(openAPI)
  .use(betterAuth)
  .use(projectsRoutes)
  .use(tasksRoutes)
  .use(tagsRoutes)
  .use(healthRoutes)
  .listen(env.PORT);

// oxlint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.url}`);
