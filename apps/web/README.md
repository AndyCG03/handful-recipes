# apps/web — Handful Recipes

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · zod · Vercel Blob. Deployed on Vercel (root directory `apps/web`).

## Run locally

```bash
cd apps/web
npm install
cp .env.example .env.local   # then set MODEL_API_KEY
npm run dev                  # http://localhost:3000
```

Without `BLOB_READ_WRITE_TOKEN`, files and recipe data are stored in `apps/web/.data/` (git-ignored).
`npm run dev` starts Node with `--use-system-ca` so the Windows certificate store is trusted.

Checks: `npm run typecheck` · `npm run lint` · `npm run build`.

## Architecture

### Update — 2026-10-28

The default flow now uploads a WAV and up to 24 real frame samples, creates a recipe, and calls `POST /api/recipes/:id/background`. The route persists a job, responds 202, and runs the remaining pipeline through Next `after()`. The owner page polls progress and can be left/reopened after upload. Stage checkpoints support manual retry after failure; this is not a durable/distributed queue and remains subject to the Vercel function duration (route requests 300 seconds).

Owners can answer questions by text or voice directly on the review page via `POST /api/recipes/:id/answers`. WhatsApp remains an optional way to invite the cook. Ambiguous answers remain pending. SAM currently runs on representative still samples, not full video mask tracking.

The older request-by-request browser orchestration below remains as a compatibility path, not the new default. Full state/configuration review: `../../docs/REVISION_FLUJO_20261028.md`.

Integration test (outdated since login was added; it still uses edit keys): `node scripts/smoke-workflow.mjs` starts a separate Next instance and a local Meta stub. It uses synthetic transport fixtures, no real inference or credits. It preserves existing records and leaves its synthetic test recipes in local `.data`. Run without another Next dev/build process sharing `.next`.

```
Browser                                   Server (route handlers)                 Meta Model API
-------                                   -----------------------                 --------------
pick video → extract 16 kHz WAV (WebAudio)
upload video + WAV ─────────────────────► Vercel Blob (client upload)
POST /api/recipes ──────────────────────► create recipe (edit key hashed)
POST /process {transcribe} ─────────────► read WAV ────────────────────────────► Voice Transcribe (DIARIZATION)
POST /process {analyze} ────────────────► upload video to Files ───────────────► Spark 1.3 (video + transcript, JSON schema)
capture frames of "handful" steps
POST /process {handful, frames} ────────► upload frames ───────────────────────► SAM 3.1 (boxes for hand / container)
/ask/[token]: record voice note → WAV ──► POST /api/ask/[token] ───────────────► Voice Transcribe + Spark (merge answer)
```

Each stage is one short request (`maxDuration` 300 s), so it fits serverless limits and can be resumed.

| Path | What |
|---|---|
| `src/lib/domain.ts` | Domain model and validation (zod). Product rule: never convert informal measures to numbers |
| `src/lib/server/meta.ts` | Typed Meta Model API client (server-only) |
| `src/lib/server/pipeline.ts` | Pipeline stages and answer merge |
| `src/lib/server/prompts.ts` | Prompts + JSON schemas for Spark |
| `src/lib/server/storage.ts` | Storage driver: local disk or Vercel Blob (immutable JSON versions to avoid CDN staleness) |
| `src/lib/server/recipes.ts` | Repository, owner check (sha256 + timing-safe compare), provenance (`runs`) |
| `src/lib/client/*` | Browser media (WAV, frames), typed API client, pipeline orchestration |
| `src/app/new` | Record / upload a recipe |
| `src/app/recipes/[id]` | Owner review + questions to send by WhatsApp |
| `src/app/ask/[token]` | The cook answers by voice (Spanish UI, no install) |
| `src/app/r/[id]` | Family link: read-only living recipe |

## Security model

- Creators sign in with Supabase Auth (email + password); recipes belong to their user id and each account can create 10 per day.
- Uploads require a session, except a cook's WAV answer, which requires a valid ask token.
- The cook's page uses a separate random **ask token**; it can only answer questions that were sent.
- Public views strip `editKeyHash`, `askToken` and model run logs.
- Media is stored in public Blob URLs with random suffixes (unguessable, not access-controlled).
