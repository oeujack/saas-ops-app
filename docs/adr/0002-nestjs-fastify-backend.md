# ADR 0002: NestJS with Fastify Adapter for Backend

**Date:** 2026-05-16  
**Status:** Accepted

## Context

We need a backend framework that:

- Supports TypeScript natively with decorators for DI and metadata
- Enables modular DDD-style bounded contexts
- Performs well under concurrent load (multi-tenant SaaS)
- Has first-class OpenAPI/Swagger support

## Decision

Use **NestJS 11** with the **Fastify adapter** instead of Express.

## Consequences

**Positive:**

- Fastify is 2–3× faster than Express for high-throughput JSON APIs
- NestJS modules map naturally to bounded contexts — each domain is a self-contained module
- `@nestjs/swagger` generates OpenAPI spec from decorators, keeping docs in sync with code
- `@nestjs/terminus` provides production-ready health checks out of the box

**Negative:**

- Some Express middleware is incompatible with Fastify and must be replaced with Fastify equivalents
- Decorator-based metadata requires `emitDecoratorMetadata: true` in tsconfig
