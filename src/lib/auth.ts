import { betterAuth, type Path } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, openAPI } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schemas/auth";

import { sendEmail } from "./email";
import env from "./env";

export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          html: `
            <div style="text-align: center; font-family: sans-serif;">
              <h1>Welcome to Elysia Starter</h1>
              <p>Click below to sign in:</p>
              <a href="${url}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: black; color: white; text-decoration: none; border-radius: 8px;">Sign in</a>
              <p style="margin-top: 24px; font-size: 12px; color: gray;">If you didn’t request this, you can ignore it.</p>
            </div>
          `,
          subject: "Your magic Elysia Starter link ✨",
          to: email,
        });
      },
    }),
    openAPI({ path: "/docs" }),
  ],
  socialProviders: {
    ...(env.GITHUB_CLIENT_ID &&
      env.GITHUB_CLIENT_SECRET && {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        },
      }),
  },
  telemetry: {
    enabled: false,
  },
});

export const authOpenAPI = {
  components: await auth.api.generateOpenAPISchema().then(({ components }) => ({
    ...components,
    securitySchemes: {
      apiKeyCookie: {
        ...components.securitySchemes.apiKeyCookie,
        type: "apiKey" as const,
      },
      bearerAuth: {
        ...components.securitySchemes.bearerAuth,
        type: "http" as const,
      },
    },
  })),
  // oxlint-disable-next-line typescript/no-explicit-any -- needed for now
  getPaths: async (prefix = "/auth"): Promise<any> => {
    const { paths } = await auth.api.generateOpenAPISchema();
    const reference: typeof paths = Object.create(null);

    for (const path of Object.keys(paths)) {
      const key = prefix + path;

      if (paths[path]) {
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = reference[key][method as keyof Path];

          if (operation) {
            operation.tags = ["Auth"];
          }
        }
      }
    }

    return reference;
  },
} as const;
