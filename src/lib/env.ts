import { type Static, t } from "elysia";
import { envSchema } from "env-schema";

const schema = t.Object({
  PORT: t.Number({ default: 3000 }),
  DATABASE_URL: t.String(),
  GITHUB_CLIENT_ID: t.Optional(t.String()),
  GITHUB_CLIENT_SECRET: t.Optional(t.String()),
  BETTER_AUTH_SECRET: t.String(),
  BETTER_AUTH_URL: t.String(),
  RESEND_API_KEY: t.String(),
  RESEND_FROM_EMAIL: t.String(),
});

type Schema = Static<typeof schema>;

const env = envSchema<Schema>({ schema });

export default env;
