# ADR 0003: Drizzle ORM for Database Access

**Date:** 2026-05-16  
**Status:** Accepted

## Context

We need a database access layer for PostgreSQL that:

- Provides complete TypeScript type safety (including query results)
- Supports complex queries without losing type information
- Has a migration system compatible with production deployments
- Performs close to raw `pg` without runtime overhead

## Decision

Use **Drizzle ORM** with `drizzle-kit` for migrations.

## Consequences

**Positive:**

- Drizzle schema definitions are plain TypeScript — no code generation at build time
- Query results are fully typed: the compiler catches column name typos and type mismatches
- `drizzle-kit studio` provides a visual DB browser during development
- Switching to raw `pg` for specific hot paths is trivial since Drizzle runs on top of `node-postgres`

**Negative:**

- Drizzle is less mature than Prisma/TypeORM — some advanced PostgreSQL features require raw SQL
- `exactOptionalPropertyTypes` in tsconfig exposes some rough edges in Drizzle's type generation (workarounds exist)
- No automatic RLS integration — setting `SET LOCAL app.current_org_id` per request must be handled in middleware
