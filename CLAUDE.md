# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

Use **npm** (not pnpm/yarn). The lockfile is `package-lock.json`.

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

**Server functions**: Use `createServerFn` from `@tanstack/react-start` for server-side logic that integrates with client components. These run only on the server and can directly access `db`. Server functions live in `src/server/`.

**Validation**: Zod v4 is used for input validation. Zod v4 implements Standard Schema, so schemas can be passed directly to `.inputValidator()` on server functions — no `@tanstack/zod-adapter` needed (that adapter is only for Zod v3).

**Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`). Use the `cn()` utility from `src/lib/utils.ts` for conditional class merging. UI components are added via shadcn: `npx shadcn@latest add <component>`.

**Path alias**: `#/*` maps to `src/*` (e.g., `import { cn } from "#/lib/utils"`).

**Linting/Formatting**: Biome with tabs for indentation and double quotes for JS/TS. `routeTree.gen.ts` and `styles.css` are excluded from Biome.

## Application

Home Budget Tracker — a household budget management app. Users record expenses across categories (Housing, Food, Transport, Health, Entertainment, Savings, Other) and view spending summaries in two modes:

- **Year view**: stacked bar chart showing monthly totals broken down by category for the selected year.
- **Month view**: donut chart + recent expenses table for the selected month.

Data is stored in SQLite (via Drizzle ORM) with two tables: `categories` (name, color, icon) and `expenses` (description, amount, currency, date, categoryId). Money is stored as `amount` (real) + `currency` (text, default `"PLN"`). URL search params (`?view=year|month&year=YYYY&month=M`) drive the current view state.

## Git

For Git commits follow the following rules:
- conventional commits format as described here: https://www.conventionalcommits.org/en/v1.0.0/
- commit messages must be in English
- commit messages should be concise and descriptive of the changes made
- use the appropriate commit type (e.g., feat, fix, docs, style, refactor, test, chore) to indicate the nature of the changes
- avoid using vague commit messages

## Documentation

- Always check the latest documentation via MCP before implementation
- Use Context7 to verify library APIs