import swagger from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { openapiDocumentation } from "@/config/openapi";
import { authOpenAPI } from "@/lib/auth";

export const openAPI = new Elysia({ name: "open-api" })
  .use(
    swagger({
      documentation: {
        ...openapiDocumentation,
        // @ts-expect-error TODO: fix
        components: await authOpenAPI.components,
        paths: await authOpenAPI.getPaths(),
      },
      exclude: {
        paths: ["/"],
      },
      path: "/docs",
      scalarConfig: {
        theme: "saturn",
        // https://github.com/elysiajs/elysia-swagger/issues/194#issuecomment-2747490495
        customCss: "",
      },
    }),
  )
  .get("/", ({ redirect }) => redirect("/docs", 308));
