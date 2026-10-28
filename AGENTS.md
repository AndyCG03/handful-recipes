# Handful Recipes — reglas del proyecto

- Plan y fechas: `docs/PLAN_PROYECTO.md`. Contexto del evento: `CONTEXTO_HACKATHON_META.md`.
- Regla de producto: la receta solo afirma lo que el video o una respuesta respaldan. Nunca convertir medidas informales a números.
- Audio → Voice Transcribe (no Spark). Salidas de Spark siempre en JSON validado con esquema.
- Guardar procedencia (modelo, versión, entrada, timestamp) de cada salida de modelo.
- Identidad: "Cuenco de barro" (`docs/handful-recipes/`). Tokens en `apps/web/src/app/tokens.css`.
- Secretos solo en `.env`. Repo público: no subir videos familiares sin consentimiento.
- Registrar lo construido cada día en `docs/BUILD_LOG.md` (requisito del hackathon).
