import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, openAPI } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schemas/auth";
import env from "./env";

export const auth = betterAuth(() => {
  const isGitHubEnabled = env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET;

  return {
    basePath: "/auth",
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      ...(isGitHubEnabled && {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        },
      }),
    },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, token, url }, request) => {
          // send email to user
        },
      }),
      openAPI({ path: "/docs" }),
    ],
  };
});
