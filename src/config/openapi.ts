import pkg from "../../package.json";

export const openapiDocumentation = {
  info: {
    description:
      "Official API reference for a REST API starter built with Elysia, featuring [Better Auth](/auth/docs) for authentication.",
    title: "Elysia REST API Starter Reference",
    version: pkg.version,
  },
  tags: [
    {
      description:
        "Authenticate users and manage sessions. View the full [Auth API Reference](/auth/docs).",
      name: "Auth",
    },
    {
      description:
        "Manage your projects, including creation, updates, deletion, and tagging.",
      name: "Projects",
    },
    {
      description:
        "Organize and track your tasks, including subtasks, tagging, and status updates.",
      name: "Tasks",
    },
    {
      description: "Reusable labels for organizing projects and tasks.",
      name: "Tags",
    },
    {
      description: "System utilities and status endpoints.",
      name: "System",
    },
  ],
};
