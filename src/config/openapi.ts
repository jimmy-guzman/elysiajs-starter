import pkg from "../../package.json";

export const openapiDocumentation = {
  info: {
    title: "Elysia REST API Starter Reference",
    description:
      "Official API reference for a minimalist, tag-driven REST API starter built with Elysia, featuring [Better Auth](/auth/docs) for authentication.",
    version: pkg.version,
  },
  tags: [
    {
      name: "Auth",
      description:
        "Authenticate users and manage sessions. View the full [Auth API Reference](/auth/docs).",
    },
    {
      name: "Projects",
      description:
        "Manage your projects, including creation, updates, deletion, and tagging.",
    },
    {
      name: "Tasks",
      description:
        "Organize and track your tasks, including subtasks, tagging, and status updates.",
    },
    {
      name: "Tags",
      description: "Reusable labels for organizing projects and tasks.",
    },
    {
      name: "System",
      description: "System utilities and status endpoints.",
    },
  ],
};
