import { Elysia } from "elysia";

export const healthRoutes = new Elysia({
  prefix: "/health",
  tags: ["System"],
}).get("/", () => ({ ok: true }), {
  detail: {
    summary: "Health check endpoint",
  },
});
