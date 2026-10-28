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

## Security model (MVP, no accounts)

- The creator gets an **edit key** stored only in their browser (localStorage); the server stores its sha256.
- The cook's page uses a separate random **ask token**; it can only answer questions that were sent.
- Public views strip `editKeyHash`, `askToken` and model run logs.
- Media is stored in public Blob URLs with random suffixes (unguessable, not access-controlled).
