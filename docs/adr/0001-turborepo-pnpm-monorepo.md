# ADR 0001: Turborepo + pnpm Workspaces for Monorepo

**Date:** 2026-05-16  
**Status:** Accepted

## Context

The project spans multiple apps (API, web, workers) and shared packages. We need a monorepo setup that:

- Enables code sharing between apps without publishing to npm
- Provides fast, incremental builds with caching
- Works well with TypeScript path aliases and type checking
- Scales to additional apps/packages without restructuring

## Decision

Use **Turborepo** as the build orchestration layer and **pnpm workspaces** as the package manager.

## Consequences

**Positive:**

- Turborepo's remote caching eliminates redundant CI builds (cache hits across PRs)
- pnpm's strict dependency isolation prevents phantom dependency bugs
- `turbo.json` pipeline makes cross-package build ordering explicit and correct
- pnpm is significantly faster than npm for multi-package installs

**Negative:**

- Team needs familiarity with pnpm's `workspace:*` protocol for internal deps
- Turborepo remote cache requires a cache provider (Vercel or self-hosted) — not configured yet
