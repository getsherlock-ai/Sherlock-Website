# Sherlock Landing

Marketing site and product entry point for Sherlock — a GitHub App that turns bug reports into verified pull requests. Includes GitHub sign-in through Supabase Auth, a protected onboarding flow that starts GitHub App installation via the Sherlock backend, and a minimal protected dashboard.

## Run

Use Node.js 22 or later (required by Wrangler).

```sh
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
npm run build                # production build (server-capable — see Hosting)
npm start                    # serve the production build
```

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser-safe | Supabase project URL (same project as the backend) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser-safe | Supabase publishable key |
| `SHERLOCK_API_URL` | **server-only** | Sherlock backend origin (HTTPS in production) |

Never add a Supabase service-role key to this repository.

## Structure

- `app/` — Next.js App Router pages: home, product, security, pricing, docs, contact, plus `auth/`, `onboarding/`, `dashboard/`, `investigations/`, and `logout/`
- `app/home.module.css` and `components/InvestigationSketch.jsx` — single-screen landing page and vector illustration
- `components/layout/WorkspaceShell.tsx` — shared sidebar and content layout for dashboard and investigations
- `components/layout/ConnectionShell.tsx` — shared layout for GitHub onboarding and sign-in states
- `components/layout/workspace.module.css` — workspace navigation, connection cards, and responsive layouts
- `components/auth/GitHubSignInButton.jsx` — the single canonical GitHub sign-in entry point (header, mobile nav, landing CTAs)
- `lib/supabase/` — browser, server and middleware Supabase clients (auth only)
- `lib/backend/` — server-only client for the Sherlock backend API
- `app/globals.css` — shared charcoal surfaces, cream text, amber brand accents, and semantic status colors
- `features/repositories/components/repository.module.css` — repository lists, investigation panels, and repository picker styles
- `RepositoryIssuesSkeleton.tsx` and `InvestigationSkeleton.tsx` — shared route and client loading states aligned with the corresponding workspaces

## Auth flow

Sign-in uses Supabase Auth with the GitHub provider. The frontend callback at `/auth/callback` exchanges the one-time code for a cookie session; `/onboarding` and `/dashboard` are server-protected and talk to the Sherlock backend (`GET /api/me`, `GET /api/installations`, `POST /api/installations/start`) with the user's Supabase access token, server-side only. GitHub App installation starts from a backend-generated URL, and the installation callback is handled by the backend — never by this frontend.

`/onboarding` is the connection step for signed-in users without an active GitHub App installation. Users who already have an active installation are redirected to `/dashboard`. Keep this route separate from sign-in: a GitHub login alone does not grant repository access.

## External configuration (outside this repo)

### Supabase Auth

- Enable the GitHub provider in the Supabase project (the same project the backend uses).
- Point the GitHub OAuth App's callback at the Supabase project's Auth callback URL.
- Add the frontend callback URLs to Supabase's redirect allow list:
  - Local: `http://localhost:3000/auth/callback`
  - Production (verify against the actual deployment): `https://getsherlock.dev/auth/callback`
  - Preview deployments, if used, must have their origins explicitly allowlisted too.

### Sherlock backend

- Set `SHERLOCK_API_URL` to the backend origin.
- The backend must verify Supabase JWTs and implement the protected product
  endpoints for installations, repositories, repository issues, issue
  investigation lookup, investigation detail, and exact diffs.
- The backend owns the GitHub App setup/installation callback.

### Deployment order

The finalized dashboard backend must be live before this frontend:

1. Apply and reconcile the Sherlock-V2 dashboard migrations using its rollout
   runbook. Do not apply migrations from this repository.
2. Deploy the backend API/bot and worker together from the same backend commit,
   then verify repository, investigation, diff, and private-media reads.
3. Deploy this frontend with `SHERLOCK_API_URL` pointing to that backend.

The frontend and backend do not need an atomic deployment, but deploying the
frontend first leaves the protected dashboard without its required APIs.

### Hosting

The app now requires a server-capable Next.js runtime (Route Handlers, Server Components, Middleware, cookies, redirects, Server Actions). A static-only host serving an exported `out/` directory is no longer sufficient.

Run `npm run build:cloudflare` to verify the full Cloudflare Worker build without
uploading or deploying it. Cloudflare Builds can use this as its build command.
Keep `package-lock.json` committed so `npm ci` uses the verified dependency versions.

OpenNext Cloudflare 1.20.13 fixes the incorrect Next.js 15 support cutoff that
blocked builds after October 21, 2026. This project stays on the patched Next.js
15.5 release; no unsupported-version override is needed. See the
[OpenNext release notes](https://github.com/opennextjs/opennextjs-cloudflare/releases/tag/@opennextjs%2Fcloudflare@1.20.13).

## Notes

- The contact page opens a pre-addressed email to `team@sherlock.dev`; replace
  it with a server-backed form if structured lead capture is needed later.
- Fonts (Space Grotesk, JetBrains Mono) are fetched at build time by `next/font`.
