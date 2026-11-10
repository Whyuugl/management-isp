# Frontend Architecture

## Folder structure

```
resources/
  js/
    actions/          # Wayfinder generated helpers (auto‑generated)
    config/          # Navigation config
    lib/             # Utility helpers (cn, etc.)
    types/           # TypeScript types for auth and shared props
    components/
      ui/            # Small reusable primitives (Button, Input, …)
      common/        # Page‑level building blocks (PageHeader, StatCard, …)
      table/         # DataTable, Pagination
      layout/        # AuthenticatedLayout, Sidebar, Topbar
    pages/           # Inertia page components
    routes/          # Wayfinder generated route helpers
    wayfinder/       # Auto‑generated type definitions for routes
    app.tsx          # Inertia bootstrap (now includes resolve, optional strictMode)
```

## Layout responsibilities

- `AuthenticatedLayout` composes `Sidebar` and `Topbar`, manages mobile sidebar state, and provides a consistent content padding.
- `Sidebar` renders navigation based on the current user's role (`navigationForRole`). It is hidden behind a backdrop on mobile.
- `Topbar` contains a hamburger for mobile menu, a placeholder breadcrumb area, and a user dropdown with profile, settings, and logout links.
- All pages should wrap content inside `AuthenticatedLayout` and use `PageHeader` for titles and actions.

## Component responsibilities

- UI primitives (`Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`, `Dropdown`) are **presentational only**; they never fetch data.
- `StatCard` shows a numeric KPI with optional trend indicator.
- `DataTable` expects column definitions and row data; it handles empty state.
- `Pagination` displays page navigation; it does not manage data fetching.
- `ConfirmDialog` couples `Modal` with a standard layout for destructive actions.

## Inertia integration

- `createInertiaApp` auto‑generates a resolver via the `@inertiajs/vite` plugin. No manual `resolve` needed because Vite plugin handles lazy loading of `resources/js/pages/**/*.tsx`.
- Shared page props (auth, sidebarOpen) are provided from the server; they are typed in `resources/js/types/global.d.ts`.
- Use the generated `usePage` hook to access shared props inside components (`Sidebar`, `Topbar`).
- All navigation uses the Wayfinder route helpers (`home`, etc.). In this foundation we use literal `href` strings for simplicity; replace with `home.url()` once server routes are defined.

## Data flow

- Server renders an Inertia response (`Inertia::render('Dashboard', $props)`).
- Shared props (`auth`, `sidebarOpen`) are merged automatically on each visit.
- Frontend components read those props from the page object via `usePage`.
- UI components emit events (`onClick`, `onChange`) that the page components handle and optionally make Inertia visits (`router.visit`).

## Future extensions

- Add role‑based route helpers via Wayfinder (`import { users } from '@/routes'`).
- Introduce React Query or TanStack store for complex data fetching.
- Expand `navigationForRole` to fetch role from backend instead of trusting the client side.
- Add dark mode toggle in `Topbar` and extend Tailwind theme.

---

All files above follow existing coding standards: functional components, TypeScript, `cn()` for class merging, strict typing, and no unnecessary dependencies.
