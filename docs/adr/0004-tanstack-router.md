# ADR 0004: TanStack Router for Frontend Routing

**Date:** 2026-05-16  
**Status:** Accepted

## Context

We need a frontend router that:

- Provides fully type-safe navigation (no string-typed `useNavigate('/path')` typos)
- Supports file-based routing for conventions similar to Next.js without its constraints
- Integrates well with TanStack Query for loader-based data fetching
- Supports nested layouts (sidebar, auth guards)

## Decision

Use **TanStack Router v1** with the Vite plugin for file-based routing.

## Consequences

**Positive:**

- Every `<Link>`, `navigate()` call, and URL param is fully typed — the compiler catches broken routes at build time
- The `_app` layout convention enables sidebar/topbar to wrap authenticated routes without duplication
- The `routerContext` pattern lets the router share the `QueryClient` with route loaders
- Vite plugin auto-generates `routeTree.gen.ts` on save — no manual registration required

**Negative:**

- The generated `routeTree.gen.ts` must not be hand-edited (other than initial scaffold)
- `createFileRoute('/_app/dashboard')` path strings must match the file path exactly
- Less ecosystem documentation than React Router — some patterns require reading source code
