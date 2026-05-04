

## Project: Tutor Marketplace

A Next.js **16.2.4** app (App Router) built with React 19, TypeScript, Tailwind CSS v4, Clerk auth, Prisma 7 + Neon DB, shadcn/ui, and TanStack Query.

---

## Stack & Versions

| Package | Version |
|---|---|
| `next` | 16.2.4 |
| `react` / `react-dom` | 19.2.4 |
| `@clerk/nextjs` | ^7.3.0 |
| `@prisma/client` | ^7.8.0 |
| `tailwindcss` | ^4 (PostCSS plugin) |
| `shadcn` | ^4.6.0 |
| `@tanstack/react-query` | ^5 |
| `lucide-react` | ^1.14.0 |

---

## Critical Rules

### 1. Read the bundled docs first
The docs live at `node_modules/next/dist/docs/`. Key entry points:

```
node_modules/next/dist/docs/
├── 01-app/
│   ├── 01-getting-started/   ← layouts, routing, data fetching basics
│   ├── 02-guides/            ← auth, forms, caching, instant-navigation …
│   └── 03-api-reference/     ← directives, components, file conventions, functions
├── 02-pages/                 ← (not used in this project)
└── index.md
```

### 2. App Router only
This project uses the **App Router exclusively** (`src/app/`). Do **not** create anything under `pages/`.

Current routes:
- `src/app/page.tsx` — Home
- `src/app/layout.tsx` — Root layout (wraps Clerk + React Query providers)
- `src/app/teach/` — Teach flow
- `src/app/listing/` — Listing pages
- `src/app/account/` — Account / profile pages

### 3. Server vs Client components
- Files are **Server Components by default**.
- Add `"use client"` only when you need browser APIs, event handlers, or React hooks.
- Read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` before touching component boundaries.

### 4. Tailwind CSS v4
- Config lives in `postcss.config.mjs` via `@tailwindcss/postcss`.
- **No `tailwind.config.js`** — v4 reads tokens directly from CSS.
- Global styles are in `src/app/globals.css`.
- Do **not** import `tailwind.config.js` or use `resolveConfig`.

### 5. Clerk Auth (v7)
- Middleware is at `src/middleware.ts`.
- Use `useAuth()` / `useUser()` for client-side checks.
- Use `auth()` (server-side) from `@clerk/nextjs/server` in Server Components / Route Handlers.
- `<Show when={...}>` is a Clerk helper — do not confuse it with a custom component.

### 6. Prisma 7 + Neon
- Schema at `prisma/schema.prisma`.
- Uses Neon serverless adapter — always import `PrismaClient` from the project's db utility, never instantiate it directly in components.
- Run `npx prisma generate` after schema changes.
- Run `npx prisma db push` to sync schema to Neon (do **not** use `migrate dev` in production).

### 7. Components & File structure
```
src/
├── app/           ← Next.js App Router pages & layouts
├── components/    ← Shared UI components (Header, Footer, UserDropdown …)
│   └── ui/        ← shadcn-generated primitives (Button, Avatar, Badge …)
├── hooks/         ← Custom React hooks
└── lib/           ← Utilities, db client, helpers
```

- Always create new components in `src/components/` as separate `.tsx` files.
- shadcn primitives live in `src/components/ui/` — never edit them manually; re-run `shadcn add <component>` to update.

### 8. Instant navigation gotcha
If fixing **slow client-side navigations**, `<Suspense>` alone is **not** enough.  
Read `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` — you must also export `unstable_instant` from the route.

### 9. Data fetching
- Prefer **Server Components** + direct async data fetching.
- Use **TanStack Query** (`useQuery` / `useMutation`) only in Client Components that need reactivity or optimistic updates.
- Read `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md` and `07-mutating-data.md` before adding any fetch/mutation logic.

### 10. Dev server
```bash
npm run dev      # starts Next.js dev server
npm run build    # production build (only run to verify correctness)
npm run lint     # ESLint (Next.js 16 ships ESLint 9 flat config)
```
