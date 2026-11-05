# MentorConnect — Frontend

The web app for MentorConnect, a platform where university students book
career sessions with industry mentors.
**Connect. Learn. Grow.**

| | |
|---|---|
| Live app | https://mentorconnect.mentorconnect.workers.dev |
| Backend API | https://mentorconnect-api.mentorconnect.workers.dev |
| Sign in | Asgardeo (organisation `teamcylix`) |
| Backend repos | https://github.com/orgs/Mentor-Connect-EC5406/repositories |

## Project status

The frontend runs against the live backend. All mock data and demo logins
have been removed. Every screen reads and writes the real database through
`src/data/`.

These flows work end to end:

- **Sign in:** the landing page Login and Get started buttons go straight to Asgardeo.
- **Onboarding:** a first login lands on onboarding, where the user picks student or mentor and fills in their details.
- **Mentor flow:**
  - edit profile (photo, skills, rate)
  - upload a verification document
  - add or remove 60-minute slots
  - accept or decline bookings
- **Admin flow:** `teamcylix25@gmail.com` lands on `/admin` to approve mentor documents. Only approved mentors appear in search.
- **Student flow:**
  - edit profile
  - find mentors (search, filters, sort)
  - book a free slot
  - message the mentor
  - mark a session completed
  - leave a review

[docs/FEATURE_TRACKER.md](docs/FEATURE_TRACKER.md) lists what every screen does
today.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173. Port 5173 is fixed because Asgardeo redirects
back to it, so the dev server fails instead of picking another port.

### Environment

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Backend URL. Use `http://localhost:8787` for a local backend |
| `VITE_ASGARDEO_BASE_URL` | `https://api.asgardeo.io/t/teamcylix` |
| `VITE_ASGARDEO_CLIENT_ID` | The MentorConnect single page app client id |

`.env.local` is for local runs and is not committed. `.env.production` holds
the public values that the Cloudflare build uses.

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

Before opening a PR, `npm run lint`, `npm test` and `npm run build` must
all pass. CI (`.github/workflows/ci.yml`) runs the same checks plus
`npm audit`.

## Deployment

The app is a static site served by a Cloudflare Worker named `mentorconnect`
([wrangler.jsonc](wrangler.jsonc)).

- **Builds:** Cloudflare Workers Builds runs `npm run build` on every push.
- **Production:** builds from the `dev` branch.
- **Previews:** each pull request gets a preview URL.
- **Routing:** unknown paths serve `index.html`, so React Router handles deep links.
- **Node version:** set by `.node-version`.

A new frontend URL needs two other changes before sign-in works there:

1. **Asgardeo:** add the URL to Authorized redirect URLs and Allowed origins.
2. **Backend team:** add the URL to the API and R2 CORS lists.

### Branches

- Create feature branches from `dev` and open PRs into `dev`.
- Never commit or push to `main` directly.

## Tech stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · React Router 7 ·
TanStack Query · Zustand (session) · Asgardeo auth-react · Radix UI ·
lucide-react · date-fns · Vitest + Testing Library · Cloudflare Workers

## Folder structure

```
src/
  main.tsx              Entry point (Asgardeo provider, query client, router)
  app/
    router.tsx          Builds all routes
    routes/             One route list per area; role lists also build the sidebar
    paths.ts            Every URL
    RequireRole.tsx     Role guard
  auth/                 Session store, Asgardeo bridge, useAuthRedirect
  layouts/              Public, auth and signed-in shells
  pages/                One file per screen: public, auth, student, mentor, admin, shared
  components/
    ui/                 Design-system primitives (Button, Card, Badge, Dialog…)
    common/             Shared building blocks (AsyncContent, PageHeader, EmptyState…)
    booking/ mentor/ profile/ messages/ goals/ landing/   Domain components
  data/                 API objects + TanStack Query hooks (http.ts sends the token)
  config/               env, business constants, reference lists
  types/                Domain types, one file per domain
  lib/  hooks/          Pure helpers and reusable hooks
  styles/globals.css    Tailwind + design tokens
  test/                 Test setup and shared fixtures
public/brand/           Official logo files
```

## Working with the API

- **Data flow:** screens use hooks from `src/data/<domain>.ts`, and the hooks call `http.ts`.
- **Requests:** `http.ts` adds the base URL and the Asgardeo access token, and turns `{message, fieldErrors}` responses into readable errors.
- **Money:** the API uses cents; the UI shows whole amounts.
- **Uploads** (photos and documents) take three steps:
  1. Ask for an upload URL.
  2. PUT the file to R2.
  3. Save the returned key.
- **Mentor ids:** mentor profile ids and user ids are different. Chat uses user ids.

[docs/API_HANDOFF.md](docs/API_HANDOFF.md) has the full endpoint map.

## Documentation

| File | Read it when |
|---|---|
| [docs/DESIGN.md](docs/DESIGN.md) | Building or changing any UI (the design system) |
| [CLAUDE.md](CLAUDE.md) | Working with Claude Code or other AI assistants |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Understanding layers, data flow, routing and conventions |
| [docs/FEATURE_TRACKER.md](docs/FEATURE_TRACKER.md) | Checking what each screen does today |
| [docs/API_HANDOFF.md](docs/API_HANDOFF.md) | Checking which endpoint each screen calls |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Why things are the way they are; open questions |
