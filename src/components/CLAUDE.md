# Components

Guidelines for writing components in this directory.

## File & naming conventions

- One component per file; filename matches the exported component name (PascalCase).
- Use a default export for the main component in each file.
- Named helper functions/types used only within the file stay in the same file — do not split into separate files prematurely.

```tsx
// Footer.tsx
export default function Footer() { ... }
```

## Props

- Define props as an inline `type` above the component, not an `interface`, and not inlined into the signature.
- Do not add a `children` prop unless the component actually renders children.
- Avoid optional props with no real default — prefer explicit values or separate components.

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
};

export default function Button({ label, onClick, variant = "primary" }: ButtonProps) { ... }
```

## Styling

- Use Tailwind utility classes exclusively — no inline `style` objects, no CSS modules.
- Use `cn()` from `#/lib/utils` whenever classes are conditional or merged.
- Use CSS custom properties (e.g. `var(--sea-ink)`, `var(--chip-bg)`) for theme-aware colors — do not hardcode hex/rgb values.
- Responsive variants follow the mobile-first pattern (`sm:`, `md:`, ...).

```tsx
import { cn } from "#/lib/utils";

<div className={cn("rounded-full px-4 py-2", isActive && "bg-[var(--chip-bg)]")} />
```

## SSR safety

This project uses TanStack Start (SSR). Browser APIs (`window`, `localStorage`, `document`) are not available during server rendering.

- Guard any browser API access with `if (typeof window === "undefined") return ...`.
- Initialise browser-dependent state inside `useEffect`, not at module or component top level.

```tsx
// Good
useEffect(() => {
  const stored = window.localStorage.getItem("theme");
  ...
}, []);
```

## Hooks & state

- Keep state as local as possible. Only lift state when two siblings genuinely need it.
- Prefer derived values over redundant state — compute from existing state/props rather than syncing a second `useState`.
- Extract a custom hook only when the same stateful logic is reused in two or more components.

## Accessibility

- Every interactive element without visible text must have an `aria-label` (or `aria-labelledby`).
- Use semantic HTML: `<button>` for actions, `<a>` for navigation, `<header>`, `<nav>`, `<main>`, `<footer>` for layout landmarks.
- Buttons must always carry `type="button"` (or `"submit"`) to prevent accidental form submission.
- Provide `:focus-visible` styles — use `focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]` as the standard pattern.

## shadcn components

Shadcn UI components live in `src/components/ui/`. Add new ones with:

```bash
pnpm dlx shadcn@latest add <component>
```

- Do not modify files inside `ui/` directly — treat them as vendored.
- Compose shadcn primitives inside feature components rather than sprinkling raw shadcn imports across routes.

## Server functions

Components in this directory are client components. Data fetching and mutations belong in server functions (`createServerFn`) defined alongside the route or in a dedicated `src/server/` module — not inside component files.

- Pass server data to components via props or TanStack Query (`useQuery`).
- Do not import `db` or any Node-only modules inside component files.

## What belongs here vs elsewhere

| Thing | Where |
|---|---|
| Reusable UI (buttons, cards, modals) | `src/components/` |
| shadcn primitives | `src/components/ui/` |
| Route-specific page sections | inline in `src/routes/` |
| Server functions / DB access | `src/server/` or colocated with the route |
| Shared utilities | `src/lib/` |
