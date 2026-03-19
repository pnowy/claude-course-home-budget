# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run test         # Run tests (Vitest)
npm run lint         # Biome lint
npm run format       # Biome format (writes)
npm run check        # Biome lint + format (writes)

npm run db:generate  # Generate Drizzle migrations from schema
npm run db:migrate   # Apply migrations
npm run db:push      # Push schema directly (no migration file)
npm run db:studio    # Open Drizzle Studio
```

Run a single test file: `npx vitest run tests/utils.test.ts`

## Environment

Requires a `.env.local` file with:
```
DATABASE_URL="dev.db"
```

The `db` singleton (`src/db/index.ts`) throws at startup if `DATABASE_URL` is missing.

## Architecture

**Framework**: TanStack Start (SSR) with TanStack Router (file-based routing) and TanStack Query.

**Routing**: Routes live in `src/routes/`. Adding a file there auto-generates `src/routeTree.gen.ts` — do not edit that file manually. The layout root is `src/routes/__root.tsx`, which wraps every route with `Header`, `Footer`, and the `TanStackQueryProvider`. Theme initialization (dark/light via localStorage) is injected as an inline `<script>` in `__root.tsx` to avoid flash.

**Database**: SQLite via `better-sqlite3` + Drizzle ORM. Schema is defined in `src/db/schema.ts`; the `db` instance is exported from `src/db/index.ts`. Run `db:generate` then `db:migrate` after schema changes.

**Server functions**: Use `createServerFn` from `@tanstack/react-start` for server-side logic that integrates with client components. These run only on the server and can directly access `db`.

**Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`). Use the `cn()` utility from `src/lib/utils.ts` for conditional class merging. UI components are added via shadcn: `pnpm dlx shadcn@latest add <component>`.

**Path alias**: `#/*` maps to `src/*` (e.g., `import { cn } from "#/lib/utils"`).

**Linting/Formatting**: Biome with tabs for indentation and double quotes for JS/TS. `routeTree.gen.ts` and `styles.css` are excluded from Biome.

## Git

For Git commits follow the following rules:
- conventional commits format as described here: https://www.conventionalcommits.org/en/v1.0.0/
- commit messages must be in English
- commit messages should be concise and descriptive of the changes made
- use the appropriate commit type (e.g., feat, fix, docs, style, refactor, test, chore) to indicate the nature of the changes
- avoid using vague commit messages