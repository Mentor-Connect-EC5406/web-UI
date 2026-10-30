# MentorConnect — Frontend

The user interface for MentorConnect, a platform where university students
book career sessions with industry mentors.
**Connect. Learn. Grow.**

This repository holds the **UI layer**: pages, components, layouts and
styles. Pages get their data from hooks in `src/data/`, which a mock server
answers today. The API integration team replaces those mock calls with real
ones without touching the pages.

---

## Contents

1. [Requirements](#requirements)
2. [Getting started](#getting-started)
3. [Scripts](#scripts)
4. [Git workflow](#git-workflow)
5. [Pull requests](#pull-requests)
6. [Continuous integration](#continuous-integration)
7. [GitHub repository settings](#github-repository-settings)
8. [Coding conventions](#coding-conventions)
9. [Folder structure](#folder-structure)
10. [Tech stack](#tech-stack)
11. [Troubleshooting](#troubleshooting)

---

## Requirements

| Tool | Version | Check with |
|---|---|---|
| Node.js | **20.19+** or **22.12+** (Vite 8 needs one of these) | `node -v` |
| npm | 10+ (comes with Node) | `npm -v` |
| Git | any recent version | `git --version` |

Recommended VS Code extensions: ESLint and Tailwind CSS IntelliSense.

---

## Getting started

```bash
git clone https://github.com/Mentor-Connect-EC5406/web-UI.git
cd web-UI
git checkout dev
npm ci
npm run dev
```

Open http://localhost:5173 (Vite picks the next free port if 5173 is taken).

Work from **`dev`**. `main` only receives reviewed releases.

### Using the demo

There is no real sign in yet. On the **Log in** page:

- **Log in** signs you in as the demo student.
- In development, the **Student** and **Mentor** preview buttons switch role.
- **Sign up** walks through onboarding and lets you pick student or mentor.
- Admin pages exist (`/admin`), but no button signs in as admin yet.

Things to know while developing:

- Every mock request waits about 0.6 s, so loading states are visible.
- Add `?mockError` to any URL to see the error state with a retry button.
- Changes (bookings, profile edits, messages) last until you reload the page.
- The demo session is kept in `localStorage`. Use **Sign out** to reset it.

### Environment variables

None are needed yet. When real API and Asgardeo settings arrive, put them in
`.env.local` (already ignored by git) and never commit secrets.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type check and build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |
| `npm test` | Run the tests once (Vitest) |
| `npm run test:watch` | Re-run tests on every change |

Before opening a pull request, run the same checks CI runs:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

---

## Git workflow

### Branches

```
main   ← releases only, merged from dev after mentor review
 ↑
dev    ← integration branch, every feature lands here first
 ↑
feat/…, fix/…, chore/…, docs/…   ← one short-lived branch per change
```

| Branch | Purpose | Who merges into it |
|---|---|---|
| `main` | Stable, reviewed code | Release pull request from `dev`, approved by the mentor |
| `dev` | Latest working code | Feature pull requests, after CI passes |
| `feat/*` and others | One change each | You, by pushing commits |

Never commit straight to `main` or `dev`.

### Branch names

`<type>/<short-description>` in lowercase with dashes:

- `feat/saved-mentors-page`
- `fix/booking-slot-timezone`
- `chore/update-dependencies`
- `docs/readme-git-rules`

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):
`<type>: <what changed, in the present tense>`

| Type | Use it for |
|---|---|
| `feat` | A new screen or behaviour |
| `fix` | A bug fix |
| `refactor` | Code change with no behaviour change |
| `style` | Formatting only |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `chore` | Config, tooling, dependencies |

Examples: `feat: add saved mentors page`, `fix: keep slot on hold after booking`.

### Day to day

```bash
# 1. start from the latest dev
git checkout dev
git pull

# 2. create your branch
git checkout -b feat/my-change

# 3. work, then stage and commit
git status
git add src
git commit -m "feat: describe the change"

# 4. push and open a pull request into dev
git push -u origin feat/my-change
```

If `dev` moves on while you work, bring your branch up to date:

```bash
git checkout dev
git pull
git checkout feat/my-change
git merge dev
```

Or click **Update branch** on the pull request page.

After your pull request is merged:

```bash
git checkout dev
git pull
git branch -d feat/my-change
```

---

## Pull requests

- **Target `dev`**, never `main`. Check the base branch before you click Create.
- Keep each pull request to one feature or fix so it is easy to review.
- Describe what changed and how to test it. Add screenshots for UI changes,
  at desktop and phone width.
- CI must pass (green tick on **CI / ci**).
- The branch must be up to date with `dev`. If GitHub says *"This branch is
  out-of-date"*, click **Update branch** and wait for CI again.
- Do not tick **"Merge without waiting for requirements to be met"**. That
  skips the team's safety rules.
- Resolve conflicts on your branch, not on `dev`.

Reviewer checklist:

- [ ] Lint, tests and build pass
- [ ] Loading, error (`?mockError`) and empty states are handled
- [ ] Works at phone width (about 390 px) without sideways scrolling
- [ ] Uses design tokens, no hex colours in components
- [ ] New helpers or components with behaviour have tests

### Releasing to `main`

When `dev` is ready for review, open a pull request **from `dev` into
`main`** titled `release: <what is included>`. The mentor reviews and merges it.

---

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`
and `dev`, on Node 20:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`
6. `npm audit --audit-level=high` (fails on high or critical vulnerabilities)

If CI fails, open the failed run on the pull request, read which step
failed, and run that same command locally.

**Dependabot** (`.github/dependabot.yml`) checks npm packages weekly and
opens up to 5 update pull requests. Review them like any other pull request:
CI must pass before merging.

---

## GitHub repository settings

For repository admins. Configure these once in **Settings** on GitHub.

### 1. Default branch

**Settings → General → Default branch** → set to **`dev`**.
New pull requests and Dependabot then target `dev` automatically, which
prevents accidental merges into `main`.

### 2. Branch protection rulesets

**Settings → Rules → Rulesets → New ruleset → New branch ruleset.**
Create one ruleset for `main` and one for `dev` (Target branches →
Add target → Include by pattern):

| Rule | `main` | `dev` |
|---|---|---|
| Enforcement status | Active | Active |
| Restrict deletions | ✅ | ✅ |
| Block force pushes | ✅ | ✅ |
| Require a pull request before merging | ✅ | ✅ |
| Required approvals | 1 (the mentor) | 0 or 1 |
| Dismiss stale approvals when new commits are pushed | ✅ | optional |
| Require conversation resolution before merging | ✅ | ✅ |
| Require status checks to pass → add **`ci`** | ✅ | ✅ |
| Require branches to be up to date before merging | ✅ | ✅ |
| Bypass list | empty (or admins only, for emergencies) | empty |

The status check only appears in the picker after CI has run at least once
on a pull request.

### 3. Merge options

**Settings → General → Pull Requests**:

- Allow **squash merging** (one clean commit per feature on `dev`).
- Allow **merge commits** (used for release pull requests `dev → main`, so
  history is kept).
- Turn on **Always suggest updating pull request branches**.
- Turn on **Automatically delete head branches** so merged feature branches
  are cleaned up.

### 4. Security

**Settings → Code security**: turn on **Dependabot alerts** and
**Dependabot security updates**.

---

## Coding conventions

The short version. Follow these so your code matches the rest of the app.

**Data**

- Pages get data only through hooks in `src/data/` (`useMentors`,
  `useStudentProfile`, …). Never import `src/mocks/` from a page or component.
- New data: add a function to that domain's `xxxApi` object in
  `src/data/<domain>.ts` (mocked through `mockServer.ts`), a `useQuery` or
  `useMutation` hook in the same file, and a cache key in `data/keys.ts`.
- No real HTTP or auth SDK code here; the integration team adds it.

**UI**

- Use the design tokens from `src/styles/globals.css` as Tailwind classes:
  `bg-brand`, `text-ink`, `text-ink-secondary`, `bg-surface`, `border-line`,
  `bg-success-soft`, … **Never write hex colours in components.**
- Light theme only: white and grey surfaces, yellow as the brand accent.
- Show status with text or icons, not colour alone.
- Wrap every query in `AsyncContent` (loading → error with retry → content),
  use `ListSkeleton` for lists, and handle the empty case with `EmptyState`.
- Show progress while a change is saving (`<Button loading>`) and success
  only after it finishes. Put destructive actions behind `ConfirmDialog`.

**Code**

- Reuse what is in `components/` before creating something new.
- Components are presentational: data comes in through props.
- No magic values: business rules go in `src/config/constants.ts`, lists in
  `src/config/options.ts`, URLs in `src/app/paths.ts`.
- Import with `@/`. Component files are PascalCase.
- Comments use `//`, are short, and explain *why*, not *what*.

**Adding a page**

1. Create the screen in `src/pages/<area>/` (default export).
2. Add a route entry in `src/app/routes/<area>.tsx`; add `nav` to show it in
   the sidebar.
3. Add its URL to `src/app/paths.ts` if anything links to it.

**Tests**

- Add a test next to every new helper or component with behaviour
  (`Something.test.tsx`). Mock API calls are tested with fake timers; see
  `src/data/mentors.test.ts`.

---

## Folder structure

```
src/
  main.tsx              Entry point (query client + router)
  app/
    router.tsx          Builds all routes
    routes/             One route list per area, also builds the sidebar
    paths.ts            Every URL
    RequireRole.tsx     Role guard
  layouts/              Public, auth and signed-in page shells
  pages/                One file per screen
    public/ auth/ student/ mentor/ admin/ system/
    shared/             Screens used by more than one role (messages)
  components/
    ui/                 Design-system primitives (Button, Card, Dialog, Switch…)
    common/             Shared building blocks (AsyncContent, EmptyState, TagInput…)
    profile/ booking/ mentor/ messages/ goals/ landing/ auth/
                        Components for one domain
  data/                 API objects + query hooks, the API team's swap point
  mocks/                Seed data for the mock server
  config/               Business constants and reference lists
  types/                Domain types, one file per domain
  lib/                  Pure helpers with no React
  hooks/                Reusable React hooks
  auth/                 Demo session (replaced by real auth later)
  styles/globals.css    Tailwind setup and design tokens
  test/setup.ts         Test setup
public/brand/           Official logo files
.github/                CI workflow and Dependabot config
```

---

## Tech stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · React Router 7 ·
TanStack Query 5 · Radix UI primitives · lucide-react · Zustand (demo
session) · date-fns · Vitest + Testing Library

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm ci` fails or Vite will not start | Check `node -v` is 20.19+ or 22.12+ |
| Port 5173 is busy | Vite uses the next port; read the URL in the terminal |
| Stuck signed in as the wrong role | Click **Sign out**, or clear site data in the browser |
| `git add docs` says the path is ignored | It is in `.gitignore`; stage `src` and other tracked files only |
| Pull request says *out-of-date* | Click **Update branch**, wait for CI, then merge |
| CI fails on `npm audit` | Run `npm audit` locally, update the package or wait for the Dependabot pull request |
| Merge conflict | Merge `dev` into your branch, fix the marked files, commit, push |
