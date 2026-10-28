# Handful Recipes — Plan del proyecto

Fecha: 27 de octubre de 2026 · Equipo: Devisi Coder (Andy Clemente / andycg) · Track: Indie Developer · Temática: **A. Build for Your World**

**Entrega:** 4 de noviembre de 2026, 21:00 ET (19:00 Ciudad Juárez). **Meta interna: 15:00 hora de Juárez del 4 de nov.**

## 1. Propuesta

> Handful Recipes convierte un video de un familiar cocinando en una **receta viva**: cada paso ligado a su clip, las medidas informales ("un puñito") mostradas y nunca inventadas, y las preguntas sobre lo que no se dijo enviadas a esa persona para completarla.

**Regla de producto:** la receta solo afirma lo que el video o una respuesta respaldan. Lo demás queda como hueco visible.

**Usuario inicial:** adulto de 25 a 45 años que quiere conservar las recetas de un familiar mayor. **Usuario secundario:** el familiar que responde desde un enlace, sin instalar nada.

## 2. Alcance del MVP

| Incluye | Excluye |
|---|---|
| Subir o grabar video (≤ 10 min) | API de WhatsApp Business (se comparte por enlace `wa.me`) |
| Transcripción por turnos (quién habla) | Conversión a gramos de medidas no medidas |
| Pasos con clip y marca de tiempo | Nutrición, salud o recomendaciones dietéticas |
| Ingredientes y "puñitos" con SAM | App nativa (es PWA) |
| Detección de huecos → preguntas | Cuentas complejas o roles (enlace mágico simple) |
| Página de respuesta por nota de voz | Traducción automática completa (solo si sobra tiempo) |
| Receta viva compartible | Edición de video |
| Exportar PDF (opcional, si sobra tiempo) | |

## 3. Componentes

| Carpeta | Componente | Tecnología |
|---|---|---|
| `apps/web` | PWA: grabar, revisar, preguntas, respuesta, receta viva | Next.js (App Router) + TypeScript + Tailwind v4, en Vercel |
| `services/worker` | Pipeline de procesamiento | Python 3.12 + FFmpeg + cliente de Meta Model API |
| `supabase` | Base de datos y almacenamiento | Postgres + Storage |
| `eval` | Conjunto de prueba, etiquetas y métricas | Python + JSONL |
| `demo` | Guion, tomas y video de 3 minutos | Remotion |
| `docs` | Plan, arquitectura, identidad y contexto | Markdown |

## 4. Modelos de Meta

| Modelo | ID | Función |
|---|---|---|
| Muse Voice Transcribe | `muse-voice-transcribe-1.0` | Voz del video y notas de respuesta; diarización y turnos con marca de tiempo |
| Muse Spark 1.3 | `muse-spark-1.3` | Segmentar el video en pasos, ingredientes, huecos y preguntas; integrar respuestas |
| SAM 3.1 | `sam-3.1` | Segmentar y seguir la mano o el ingrediente en el clip del "puñito" |
| Muse Image (opcional) | `muse-image-1.0` | Portada de la receta |

Notas del catálogo oficial: Spark 1.3 no soporta audio por completo, así que **el audio va a Voice Transcribe, no a Spark**. Voice Transcribe no da marcas por palabra, solo por turno.

## 5. Pipeline

1. `ingest`: guardar el video, extraer el audio (FFmpeg) y fotogramas clave.
2. `transcribe`: Voice Transcribe, con turnos y hablantes.
3. `segment_steps`: Spark recibe el video y los turnos y devuelve pasos `{inicio, fin, acción, ingredientes, evidencia}` en JSON con esquema.
4. `handful_clips`: para cada medida informal, SAM sigue la mano o el ingrediente y se recorta el clip.
5. `detect_gaps`: Spark marca lo no dicho (fuego, tiempo, variedad, señal de "listo") y genera de 3 a 5 preguntas.
6. `merge_answers`: la nota de voz de respuesta pasa por Voice Transcribe, y Spark la asigna al paso y al hueco correctos.

Cada salida de modelo se guarda con su procedencia (modelo, versión, entrada, marca de tiempo) para auditar y medir.

## 6. Calendario

| Fecha | Objetivo | Entregable verificable |
|---|---|---|
| **Lun 27 oct** | Validación técnica | Llamadas reales a los 3 modelos con un video propio; repo público creado |
| **Mar 28 oct** | Decisión + base | Go/no-go (sección 7); esquema de Supabase; `ingest` + `transcribe` funcionando |
| **Mié 29 oct** | Pasos | `segment_steps` con JSON validado; grabar 3 o 4 recetas familiares |
| **Jue 30 oct** | Puñitos + huecos | `handful_clips` y `detect_gaps`; primeras métricas |
| **Vie 31 oct** | App 1 | Subir video → estado de procesamiento → revisar el borrador |
| **Sáb 1 nov** | App 2 | Preguntas, página de respuesta con voz, `merge_answers`, receta viva |
| **Dom 2 nov** | Evaluación + pulido | Métricas finales en `eval/results`; errores visibles; identidad aplicada |
| **Lun 3 nov** | Video | Grabación y edición de la demo; README con lo construido en el evento |
| **Mar 4 nov** | Entrega | Revisar enlaces públicos y enviar antes de las 15:00 de Juárez |

Regla: si un día se retrasa, se recorta alcance (PDF, Muse Image, traducción) y no se mueve la fecha de entrega.

## 7. Validación y criterios de continuar o abandonar (28 oct)

Con 3 videos propios:

- **Continuar** si:
  - Spark segmenta pasos razonables en al menos 2 de 3 videos;
  - al menos 50% de las preguntas generadas corresponden a huecos reales (etiquetados por ti);
  - SAM produce una máscara usable del ingrediente o la mano en al menos 1 caso por video.
- **Ajustar** si Spark falla con videos largos: trocear el video por turnos de voz.
- **Recortar** si SAM no funciona: mostrar el clip sin máscara. El "puñito" sigue siendo visible y no se inventa.

## 8. Métricas (en `eval/`)

| Métrica | Cómo se mide |
|---|---|
| Cobertura de pasos | Pasos detectados frente a pasos etiquetados a mano |
| Alineación de clips | Error en segundos entre el inicio predicho y el real |
| Precisión de huecos | Preguntas útiles sobre preguntas generadas |
| Exhaustividad de huecos | Huecos reales detectados sobre huecos etiquetados |
| Cantidades inventadas | Medidas numéricas sin respaldo en video o respuesta (**objetivo: 0**) |
| Integración de respuestas | Respuestas asignadas al paso correcto |
| Tiempo y coste | Segundos y llamadas por minuto de video |

Casos de prueba: video con ruido de cocina, dos personas hablando a la vez, mezcla de español e inglés, paso hecho sin hablar, respuesta ambigua ("como siempre, mijo").

## 9. Guion de demo (3 min)

| Tiempo | Escena |
|---|---|
| 0:00–0:20 | La abuela cocina: "esto lleva un puñito". El problema en una frase |
| 0:20–1:20 | Se sube el video → receta con pasos y clips; tocar "sal" muestra el puñito con máscara SAM |
| 1:20–2:00 | Huecos detectados → pregunta por WhatsApp → respuesta en voz → la receta se completa |
| 2:00–2:35 | Métricas reales, **incluidos los fallos**, y qué modelo hace cada parte |
| 2:35–3:00 | Visión: otros saberes que viven en las manos. Cierre: "Esta receta ya no se va a perder." |

## 10. Riesgos

| Riesgo | Mitigación |
|---|---|
| Spark no maneja videos largos o falla en la segmentación | Trocear por turnos; videos ≤ 10 min |
| SAM falla con mano, vapor o poca luz | Clip sin máscara; buena luz al grabar |
| Preguntas obvias o de relleno | Lista de tipos de hueco en el prompt; medir precisión |
| Privacidad de la familia | Consentimiento escrito de quien aparece; nada de datos reales en el repo público |
| Créditos o límites de la API | Caché de respuestas en `eval`; no reprocesar sin cambios |
| Tiempo | Recortes en la sección 6; entrega a las 15:00 |

## 11. Cumplimiento

- Repo público desde el día 1; todo el código creado durante el evento (README con fechas y lista de lo construido).
- Modelos de Meta en el núcleo del producto.
- No es consejo médico ni nutricional, ni RAG, ni un chatbot, ni un analizador simple.
- Videos familiares solo con consentimiento; en el repo, solo muestras autorizadas o sintéticas.
- Secretos en `.env`, nunca en el repo.
