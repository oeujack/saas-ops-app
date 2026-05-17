# SaaS Ops

**SaaS Management Platform** — discover, centralize, optimize, and renew corporate software subscriptions.

## Prerequisites

- Node.js 22+
- pnpm 9+
- Docker + Docker Compose

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd saas-ops
pnpm install
```

### 2. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

The defaults in `.env.example` match the Docker Compose services — no changes needed for local dev.

### 3. Start infrastructure

```bash
docker compose up -d
```

This starts:

- **PostgreSQL 16** on `localhost:5432`
- **Redis 7** on `localhost:6379`
- **Meilisearch** on `localhost:7700`

Wait for containers to be healthy:

```bash
docker compose ps
```

### 4. Run database migrations

```bash
pnpm --filter @saas-ops/api db:migrate
```

### 5. Start development servers

```bash
pnpm dev
```

This starts:

- **API** at http://localhost:3001
- **Web** at http://localhost:3000

### 6. Verify health

```bash
curl http://localhost:3001/api/health | jq
```

Expected response:

```json
{
  "status": "ok",
  "info": {
    "postgres": { "status": "up" },
    "redis": { "status": "up" },
    "memory_heap": { "status": "up" }
  }
}
```

Swagger docs: http://localhost:3001/api/docs

## Project Structure

```
saas-ops/
├── apps/
│   ├── api/          # NestJS backend (port 3001)
│   ├── web/          # React 19 + TanStack Router (port 3000)
│   └── workers/      # BullMQ background workers (Sprint 3)
├── packages/
│   ├── shared-config/ # Base tsconfig, ESLint config
│   ├── shared-types/  # Shared Zod schemas and TypeScript types
│   ├── ui/           # Shared shadcn/ui component wrappers
│   └── domain-events/ # Domain event contracts
├── infra/
│   └── docker/        # Init SQL for Postgres
├── docs/
│   └── adr/           # Architecture Decision Records
└── docker-compose.yml
```

## Available Commands

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start all apps in watch mode   |
| `pnpm build`      | Build all apps and packages    |
| `pnpm lint`       | Lint all workspaces            |
| `pnpm type-check` | Run TypeScript type checking   |
| `pnpm test`       | Run all tests                  |
| `pnpm format`     | Format all files with Prettier |

### API-specific

| Command                                   | Description                            |
| ----------------------------------------- | -------------------------------------- |
| `pnpm --filter @saas-ops/api db:generate` | Generate migration from schema changes |
| `pnpm --filter @saas-ops/api db:migrate`  | Apply pending migrations               |
| `pnpm --filter @saas-ops/api db:studio`   | Open Drizzle Studio                    |

## Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| API Framework  | NestJS 11 + Fastify             |
| Database       | PostgreSQL 16 + Drizzle ORM     |
| Cache / Queues | Redis + BullMQ                  |
| Search         | Meilisearch                     |
| Frontend       | React 19 + Vite 6               |
| Routing        | TanStack Router v1 (file-based) |
| UI             | shadcn/ui + Tailwind CSS v4     |
| Server State   | TanStack Query v5               |
| Client State   | Zustand v5                      |
| Validation     | Zod (backend + frontend)        |
| Monorepo       | Turborepo + pnpm workspaces     |

## Architecture Decisions

See [`docs/adr/`](docs/adr/) for all Architecture Decision Records.

## Development Workflow

- Branches: `feat/`, `fix/`, `chore/`, `refactor/` prefixes
- Commits: Conventional Commits (`feat: add X`, `fix: resolve Y`)
- PRs: max ~400 lines changed, single concern
- CI: lint → type-check → test → build runs on every PR
