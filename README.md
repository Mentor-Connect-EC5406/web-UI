# MentorConnect — Frontend

The user interface for MentorConnect, a platform where university students
book career sessions with industry mentors.
**Connect. Learn. Grow.**

This repository holds the **UI layer**: pages, components, layouts and
styles. Data comes through hooks in `src/data/`, which call the
MentorConnect API (see [docs/API_HANDOFF.md](docs/API_HANDOFF.md)). Sign in
is handled by Asgardeo.

## Quick start

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the API and Asgardeo values.
Screens still waiting on backend endpoints are hidden; list them in
`VITE_FEATURES` (e.g. `VITE_FEATURES=mentorships,sessionTasks`) to work on
them locally. See "Waiting on the backend" in `docs/API_HANDOFF.md`.
Open http://localhost:5173 (the port is fixed because Asgardeo redirects back
to it) and log in with an Asgardeo account. A first login goes to onboarding,
where you choose student or mentor.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Run the tests once (Vitest) |
| `npm run test:watch` | Run tests on every change |
| `npm run typecheck` | TypeScript only |

Before sharing a change, `npm run lint`, `npm test` and `npm run build` should all pass.

## Tech stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · React Router 7 ·
TanStack Query · Radix UI primitives · lucide-react · Zustand (demo session) ·
date-fns · Vitest + Testing Library

## Folder structure

```
src/
  main.tsx              Entry point (query client + router)
  app/
    router.tsx          Builds all routes
    routes/             One route list per area; role lists also build the sidebar
    paths.ts            Every URL
    RequireRole.tsx     Role guard
  layouts/              Public, auth and signed-in shells
  pages/                One file per screen, grouped by area
  components/
    ui/                 Design-system primitives (Button, Card, Badge, Dialog…)
    common/             Shared building blocks (AsyncContent, PageHeader, EmptyState…)
    mentor/  booking/   Domain components
  data/                 Query hooks + API objects that call the backend
  config/               Business constants and reference lists
  types/                Domain types, one file per domain
  lib/  hooks/          Pure helpers and reusable hooks
  auth/                 Session store and the Asgardeo bridge
  styles/globals.css    Tailwind + design tokens
  test/setup.ts         Test setup
public/brand/           Official logo files
```

## Documentation

| File | Read it when |
|---|---|
| [DESIGN.md](DESIGN.md) | Building or changing any UI — the design system |
| [CLAUDE.md](CLAUDE.md) | Working with Claude Code / AI assistants |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understanding layers, data flow, routing and conventions |
| [docs/FEATURE_TRACKER.md](docs/FEATURE_TRACKER.md) | Checking what each screen does today |
| [docs/API_HANDOFF.md](docs/API_HANDOFF.md) | Connecting real APIs (integration team) |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Why things are the way they are; open questions |
