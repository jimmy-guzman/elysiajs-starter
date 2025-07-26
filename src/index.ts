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
      origin: `http://localhost:${env.PORT}`,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(openAPI)
  .use(betterAuth)
  .use(projectsRoutes)
  .use(tasksRoutes)
  .use(tagsRoutes)
  .use(healthRoutes)
  .listen(env.PORT);

console.log(`🦊 Elysia is running at ${app.server?.url}`);
