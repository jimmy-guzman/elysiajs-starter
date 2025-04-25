import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { openapiDocumentation } from "./config/openapi";
import env from "./lib/env";
import { betterAuth } from "./plugins/auth";
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
  .use(
    swagger({
      path: "/docs",
      documentation: openapiDocumentation,
      scalarConfig: {
        theme: "saturn",
        // https://github.com/elysiajs/elysia-swagger/issues/194#issuecomment-2747490495
        customCss: "",
      },
    }),
  )
  .use(betterAuth)
  .use(projectsRoutes)
  .use(tasksRoutes)
  .use(tagsRoutes)
  .use(healthRoutes)
  .listen(env.PORT);

console.log(`🦊 Elysia is running at ${app.server?.url}`);
