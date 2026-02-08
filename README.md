# ElysiaJS Starter

> 🚀 A production-ready API starter with Elysia, Bun, OXC, Drizzle ORM, Neon, and built-in auth, email support, environment validation, and testing.

## 🐣 Features

- 🍞 [bun][bun] for a blazing‑fast runtime & package manager.
- ⚡️ [Elysia][elysia] for an ultra‑light, type‑safe HTTP framework.
- 🏷️ [TypeScript][typescript] for end‑to‑end type safety.
- 🔐 [Better Auth][better-auth] for drop‑in session management.
- 📬 [Resend][resend] for sending transactional emails with ease.
- 🗄️ [Drizzle ORM][drizzle] for type‑safe SQL queries and schema management.
- 🛢️ [Neon][neon] for scalable, serverless Postgres with branching and edge support.
- 📦 [env-schema][env-schema] for runtime-safe environment variable validation.
- 🧪 [vitest][vitest] for fast unit testing.
- 🩺 [OXC][oxc] for linting + formatting in one tool.
- 🩺 [lefthook][lefthook] for lightning‑fast Git hooks.

## 🛠️ Installation

You can either [use this template](https://github.com/jimmy-guzman/ts-rest-api-starter/generate) or use [tiged](https://github.com/tiged/tiged):

```bash
bunx tiged jimmy-guzman/ts-rest-api-starter my-api
cd my-api
```

## 🏁 Getting Started

### 1. Install Bun

First install [bun](https://bun.sh/docs/installation):

```bash
curl -fsSL https://bun.sh/install | bash
```

Or if you already have `bun` installed, upgrade to the latest stable version:

```bash
bun upgrade --stable
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Neon Database

Install the Neon CLI:

```bash
bun add -g neonctl
```

Or with homebrew:

```bash
brew install neonctl
```

Login to your Neon account:

```bash
neonctl auth
```

Create a new project:

```bash
neonctl projects create --name "my-elysia-api"
```

Get your connection string:

```bash
neonctl connection-string --project-id YOUR_PROJECT_ID
```

### 4. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env.example` file contains:

```dotenv
# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Auth
BETTER_AUTH_SECRET=your-secret-key-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

#### Required Environment Variables

**DATABASE_URL**: Your Neon database connection string

- Format: `postgresql://username:password@host/database?sslmode=require`
- Get this from your Neon project dashboard

**BETTER_AUTH_SECRET**: A secure random string for session encryption

```bash
openssl rand -base64 33
```

**GitHub OAuth**:

- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Create a GitHub OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)
- Set callback URL to: `http://localhost:3000/api/auth/callback/github`

**Resend Email**:

- `RESEND_API_KEY`: Get from [Resend Dashboard](https://resend.com/api-keys)
- `RESEND_FROM_EMAIL`: Verified sending domain email

### 5. Database Setup

Run database migrations:

```bash
bun run db:migrate
```

Seed the database (optional):

```bash
bun run db:seed
```

### 6. Start Development Server

```bash
bun run dev
```

Your application will be available at:

- **API Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

## 🧞 Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `bun run dev`           | Start development server with hot reload |
| `bun run test`          | Run all tests                            |
| `bun run test:coverage` | Run tests with coverage report           |
| `bun run test:ui`       | Run tests with UI interface              |
| `bun run db:generate`   | Generate Drizzle schema                  |
| `bun run db:migrate`    | Run database migrations                  |
| `bun run db:push`       | Push schema changes to database          |
| `bun run db:studio`     | Open Drizzle Studio                      |
| `bun run lint`          | Lint code with OXC                       |
| `bun run lint:fix`      | Lint and fix code with OXC               |
| `bun run fmt`           | Format code with OXC                     |
| `bun run fmt:fix`       | Format and fix code with OXC             |
| `bun run typecheck`     | Check TypeScript types                   |

## 📁 Project Structure

```sh
├── src/
│   ├── config/            #
│   ├── db/                # Database schemas and connection
│   ├── lib/               # Shared utilities (auth, email, env)
│   ├── routes/            # API endpoints with tests
│   ├── plugins/           # Elysia plugins
│   └── index.ts           # Application entry point
├── docs/                  # Project documentation
├── drizzle.config.ts      # Database configuration
├── .oxcfmtrc.json         # Format config
├── .oxclintrc.json        # Linting config
├── .lefthook.json         # Git hooks
└── package.json
```

---

<!-- references start -->

[bun]: https://bun.sh
[elysia]: https://elysiajs.com
[typescript]: https://www.typescriptlang.org
[better-auth]: https://www.better-auth.com
[resend]: https://resend.com
[drizzle]: https://orm.drizzle.team
[neon]: https://neon.tech
[env-schema]: https://github.com/fastify/env-schema
[vitest]: https://vitest.dev
[oxc]: https://oxc.rs
[lefthook]: https://github.com/evilmartians/lefthook

<!-- references end -->
