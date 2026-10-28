# Handful Recipes

Convierte un video de un familiar cocinando en una **receta viva**: pasos ligados a su clip, medidas informales mostradas (nunca inventadas) y preguntas sobre lo que no se dijo, que esa persona responde por nota de voz.

Meta Global AI Developer Hackathon 2026 · Equipo Devisi Coder · Indie Developer Track · Build for Your World.

## Modelos de Meta
- Muse Voice Transcribe: voz y diarización
- Muse Spark 1.3: pasos, huecos, preguntas e integración de respuestas
- SAM 3.1: el "puñito", segmentado y seguido en el video

## Estructura
| Carpeta | Qué contiene |
|---|---|
| `apps/web` | PWA Next.js: captura, revisión, preguntas, respuesta, receta viva |
| `services/worker` | Pipeline Python: ingest → transcribe → steps → handful clips → gaps → answers |
| `supabase` | Esquema Postgres y buckets de Storage |
| `eval` | Videos de prueba autorizados, etiquetas, scripts y resultados |
| `demo` | Guion y video de 3 minutos (Remotion) |
| `docs` | Plan, arquitectura, identidad visual y contexto |

## Construido durante el hackathon
Todo el código de este repositorio se creó a partir del 27 de octubre de 2026. Detalle diario en `docs/BUILD_LOG.md`.

## Licencia
MIT
