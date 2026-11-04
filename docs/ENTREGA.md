# Handful Recipes — entrega

**Fecha límite:** 4 de noviembre de 2026, 9:00 p. m. ET (7:00 p. m. en Ciudad Juárez). No se aceptan entregas tardías.
**Formulario:** https://cerebralvalley.ai/e/meta-ai-developer-hackathon/hackathon/submit

## Pendientes antes de enviar

1. [ ] Iniciar sesión en https://handful-recipes.vercel.app y crear la receta con `eval/videos/video.mp4`. **Producción aún no tiene ninguna receta.**
2. [ ] Abrir "Open the family link" y copiar ese enlace a "Live example" abajo.
3. [ ] Abrir el enlace familiar en una ventana privada y comprobar que carga sin cuenta.
4. [ ] Crear una cuenta de demostración para el jurado, con una contraseña que no uses en otro lado. Confirmar que "Confirm email" está apagado en Supabase.
5. [ ] Ver `handful-demo-final.mp4` completo, con audio.
6. [ ] Subirlo a YouTube como "Unlisted" y abrir el enlace en una ventana privada.
7. [ ] Pegar los textos de abajo, revisar que estés listado como integrante y enviar.

## Textos para el formulario

**Project name:** Handful Recipes

**Team:** Devisi Coder — Andy Clemente (andycg)

**Track:** Indie Developer

**Theme:** Build for Your World

**One line:** Turn a video of someone cooking into a living family recipe: every step linked to its moment, every "un puñito" kept as it was said, and questions about what was left unsaid.

**Description:**

The most valuable family recipes have no measurements. "Un puñito." "Until it looks right." When that person is gone, the recipe is gone too, because it was never in words.

Handful Recipes starts from a video of someone cooking. Muse Voice Transcribe captures who said what. Muse Spark 1.3 reads the video and speech together and returns schema-validated steps, literal informal measures, and the details that were never stated. SAM 3.1 locates the hand or container on real frames of each step.

The rule of the product is that a recipe only states what the video or an answer supports. Informal measures are never converted into grams or cups. Missing details become questions: the owner can answer them, or send a link so the cook replies with a voice note, with no app or account. The answer is transcribed and placed on the right step, and an unclear answer leaves the question open.

The demo uses one short test recording of a simple bowl of cereal, and a synthetic voice for the sample answer. Results come from that single recording, not a benchmark: accuracy on a labeled set has not been measured, and SAM runs on still frames rather than full video tracking.

**Built during the hackathon:** All code was created during the event, starting October 27, 2026. See `docs/BUILD_LOG.md`.

**Repository:** https://github.com/AndyCG03/handful-recipes

**Live product:** https://handful-recipes.vercel.app

**Live example:** (pegar el enlace familiar del paso 2)

**Demo account for judges:** (correo y contraseña del paso 4)

**Demo video:** (pegar el enlace de YouTube del paso 6)

## Limitaciones conocidas

- Una sola grabación de prueba y casi sin voz, así que el caso principal (una receta platicada) no se ha validado.
- Sin métricas sobre un conjunto etiquetado.
- SAM trabaja con fotogramas fijos.
- El procesamiento en segundo plano no es una cola garantizada; ante un corte se reintenta desde la etapa guardada.
- Los archivos están en enlaces públicos difíciles de adivinar, sin control de acceso, y la app aún no permite borrarlos.
- El flujo con cuenta y en celular no se ha probado de punta a punta en producción.
- `npm audit` reporta avisos altos en dependencias como `sharp`; quedan pendientes de revisar.
- `apps/web/scripts/smoke-workflow.mjs` quedó desactualizado con el login.

## Créditos de audio

Música: "Forever in My Heart" (Michael Ramir C.), Mixkit Stock Music Free License. Efectos: Mixkit Sound Effects Free License. Voz: ElevenLabs (Emiliano).
