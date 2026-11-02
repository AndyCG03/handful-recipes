# Handful Recipes

**Some recipes were never written.** Record someone you love while they cook. Handful Recipes turns the video into a living recipe: every step linked to its moment in the video, every "un puñito" kept as it was said and shown (never converted into invented grams), and questions about what was left unsaid, which the cook can answer with a voice note.

- **Live product:** https://handful-recipes.vercel.app
- **Hackathon:** Meta Global AI Developer Hackathon 2026 · Indie Developer Track · *Build for Your World*
- **Team:** Devisi Coder — Andy Clemente (andycg)

## How Meta models are used

| Model | Job in the product |
|---|---|
| Muse Voice Transcribe | Speech by turn and speaker, in the video and in voice answers |
| Muse Spark 1.3 | Reads video + transcript into steps, literal measures and open questions (schema-validated JSON); merges answers into the right step |
| SAM 3.1 | Locates the hand or container on real frames of the step |

Today SAM runs on still frames of each step, not as full video tracking.

## Built during the hackathon

Everything in this repository was created during the event, starting October 27, 2026. Day-by-day record: [docs/BUILD_LOG.md](docs/BUILD_LOG.md). No prior code base was used.

- Upload flow, browser audio extraction and frame sampling
- Background pipeline with checkpoints and retry
- Review page, owner answers by text or voice, shareable question link for the cook, read-only family page
- Accounts (Supabase Auth), per-user recipes, daily limit, protected uploads
- "Cuenco de barro" visual identity

## Known limits

Accuracy has not been measured on a labeled set yet. Background processing is not a durable queue. Media files use unguessable public URLs, not access-controlled storage.

## Structure

| Folder | Contents |
|---|---|
| `apps/web` | The app (Next.js on Vercel). Setup and architecture: [apps/web/README.md](apps/web/README.md) |
| `supabase` | Database schema |
| `services/worker` | Model validation script |
| `demo` | Demo video source (Remotion) |
| `docs` | Plan, architecture, identity, build log |

## License

MIT, see [LICENSE](LICENSE).
