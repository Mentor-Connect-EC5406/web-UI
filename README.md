# MentorConnect — Frontend

The user interface for MentorConnect, a platform where university students
book career sessions with industry mentors.
**Connect. Learn. Grow.**

This repository holds the **UI layer**: pages, components, layouts and
styles. Data comes through hooks in `src/data/`, answered by a mock server
today. The API integration team swaps in real calls there (see
[docs/API_HANDOFF.md](docs/API_HANDOFF.md)).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 (Vite picks the next free port if 5173 is taken).
Use **Sign in** and pick a demo role (student, mentor or admin) to see each area.

- Every mock request takes ~0.6 s, so you can see loading states.
- Add `?mockError` to any URL to preview error states.
- Changes you make (bookings, cancellations…) last until you reload the page.

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
  data/                 Query hooks + API objects — the API team's swap point
  mocks/                Seed data for the mock server
  config/               Business constants and reference lists
  types/                Domain types, one file per domain
  lib/  hooks/          Pure helpers and reusable hooks
  auth/                 Demo session (replaced by real auth later)
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
# Professional Frontend API Integration Architecture

A robust, scalable, and production-ready frontend API integration architecture built with TypeScript, Axios, TanStack React Query, Zod, and Vitest.

---

## 🚀 Key Features & Modules

1. **Base API Client & Interceptors:** Centralized Axios configuration with automated Bearer token attachment and global error handling.
2. **Token Management:** Secure utility functions for storing, retrieving, and clearing JWT tokens from `localStorage`.
3. **User Profile & Analytics:** Dedicated services for fetching/updating user profiles and dashboard statistics.
4. **Server-side Pagination & Filtering:** Generic service handlers for data tables supporting search, sorting, and pagination.
5. **Complete CRUD Operations:** Modular generic functions for Create (`POST`), Read (`GET`), Update (`PUT`/`PATCH`), and Delete (`DELETE`) requests.
6. **Advanced Error Handling & Loading States:** Global HTTP status code interception and custom React hooks (`useApiLoading`).
7. **Toast Notifications:** Clean alert wrappers for success and error feedback using `react-hot-toast`.
8. **State Management & Caching:** Configured TanStack React Query client for efficient server state caching and background refetching.
9. **Form Validation:** Client-side validation schemas using Zod and React Hook Form.
10. **File Uploads:** Multipart form-data API integration for handling image and document uploads.
11. **Testing & Mocking:** Unit tests written with Vitest and API mocking configured using Mock Service Worker (MSW).

---

## 🛠️ Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/chalindu888/your-repo-name.git
cd your-repo-name
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Duplicate `.env.example` and rename it to `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`
Update `VITE_API_BASE_URL` in your `.env` file to point to your backend server.

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

---

## 🧪 Running Tests
To execute unit tests for API services:
\`\`\`bash
npm run test
\`\`\`

---

## 📌 Git Workflow & Conventional Commits
All features and modifications follow the **Conventional Commits** specification (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).