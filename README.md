# as

A GraphQL-driven quote application built as a monorepo with a Docker-friendly development setup.

## What this project is

`as` is a full-stack quote app that combines:

- A GraphQL API server powered by NestJS, Apollo Server, TypeORM, and PostgreSQL
- A React + Vite frontend with Apollo Client for GraphQL data fetching
- Shared contract and utility packages across backend and frontend
- A monorepo structure managed with pnpm workspaces and Turborepo
- Docker Compose support for local development and service orchestration

## Key features

- GraphQL schema-first API for quotes, users, comments, and reactions
- Authentication and JWT support via NestJS guards and Passport
- Shared TypeScript contracts for API types across client and server
- Frontend code generation using GraphQL Codegen
- Modular package structure for reusable backend and frontend logic

## Repository structure

- `apps/api` — NestJS GraphQL backend service
- `apps/web` — Vite-based React frontend
- `packages/base` — shared base services, repositories, and GraphQL helpers
- `packages/contracts` — shared DTOs, entities, enums, and GraphQL contract types
- `packages/database` — database configuration, TypeORM setup, and migrations
- `packages/domain/cache-client` — shared cache client package

## Getting started

Install dependencies at the repository root with pnpm:

```bash
pnpm install
```

### Run locally

Start both frontend and backend in development mode:

```bash
pnpm dev
```

This uses Turborepo to start the monorepo services concurrently.

### Build for production

```bash
pnpm build
```

## Docker setup

Use Docker Compose to start the app with containerized services.

For standard compose:

```bash
docker compose up --build
```

For development compose (if configured):

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Package commands

### Backend (`apps/api`)

- `pnpm --filter @as/api run start:dev` — start NestJS in watch mode
- `pnpm --filter @as/api run build` — compile backend
- `pnpm --filter @as/api run test` — run Jest tests

### Frontend (`apps/web`)

- `pnpm --filter web run dev` — start Vite dev server
- `pnpm --filter web run build` — build production assets
- `pnpm --filter web run codegen` — generate GraphQL TypeScript hooks and types

### Database (`packages/database`)

- `pnpm migration:create` — create a new TypeORM migration
- `pnpm migration:run` — apply database migrations

## Notes

- The app shares GraphQL contract types between `apps/api` and `apps/web` via the `@as/contracts` workspace package.
- `apps/web` uses Apollo Client, React Router, and Tailwind for the frontend experience.
- `apps/api` exposes a schema-first GraphQL API built with NestJS, Apollo Server, and TypeORM.
