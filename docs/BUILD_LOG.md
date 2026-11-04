# Build log (construido durante el hackathon)

## 2026-10-27
- Investigación, selección de idea, identidad visual "Cuenco de barro".
- Plan del proyecto y estructura del repositorio.
- Script de validación `services/worker/scripts/validate_models.py`: Voice Transcribe (DIARIZATION), Files API, Spark 1.3 con video + JSON schema, SAM 3.1 en video con streaming.
- Prueba de plomería con video sintético (voz TTS es-MX + figura en movimiento): los 4 pasos OK. Spark: 4 pasos, 6 huecos, medidas literales sin convertir ("un puñito"). SAM: 120 máscaras en 4 s. Resultados en `eval/results/validation_20261027_225501/`.
- Fix TLS en Windows: `truststore` (certifi no valida api.meta.ai en esta máquina).
- Validación con video real (`eval/videos/video.mp4`, 50 s, cereal con leche, casi sin voz). Spark: 2 pasos correctos solo por lo visual, 2 preguntas de cantidad pertinentes, sin cantidades inventadas. Transcribe: 3 turnos con poco contenido (el video casi no tiene habla). SAM: "cereal" segmenta aros individuales; "bowl of cereal", "plastic bag" y "hand" segmentan la porción completa → el prompt de SAM debe nombrar el recipiente o la mano, no el ingrediente. Resultados en `eval/results/validation_20261027_231622/`.

## 2026-10-28 (madrugada)
- Decisión de arquitectura: el pipeline se implementa en la app Next.js (route handlers por etapa) en lugar del worker Python, para desplegar todo en Vercel. El worker queda como script de validación de modelos.
- App web `apps/web`: modelo de dominio (zod), almacenamiento local/Vercel Blob, cliente Meta tipado, etapas transcribe → analyze → handful, respuesta por voz con merge de Spark.
- Pantallas con identidad "Cuenco de barro": inicio, nueva receta, revisión del dueño + preguntas por WhatsApp, página de respuesta (español), enlace familiar.
- Prueba end-to-end local con video real: 2 pasos, medidas literales ("a ojo, directo del cartón"), SAM encuentra cartón y bolsa, 4 preguntas; respuesta de voz transcrita e integrada ("La leche siempre fría, directito del refri"). 403 sin clave de edición; vista pública sin campos privados.
- Repo público: https://github.com/AndyCG03/handful-recipes · Proyecto Vercel `handful-recipes` con Blob store.

## 2026-10-28 — revisión de flujo y landing
- Landing editorial con identidad Cuenco de barro, ilustración fotográfica generada, ejemplo marcado y explicación de grabar/revisar/completar. Logo con alfa real y adaptación clara en modo oscuro.
- Propietario responde dudas dentro de la revisión por texto o voz. Se conserva autoría y audio cuando existe; una respuesta ambigua no cierra la pregunta. Se muestran también respuestas generales.
- Copiar enlace habilita las preguntas seleccionadas; se conserva la invitación por WhatsApp como alternativa.
- Procesamiento del lado servidor mediante Next after, respuesta HTTP 202, job persistido, checkpoints y consulta de estado. Muestras visuales se preparan antes de encolar para eliminar dependencia de captura posterior desde el navegador.
- Reanudación desde etapa fallida y timeouts en llamadas externas. El mecanismo no es una cola durable; límites y requisitos de despliegue se describen sin afirmar soporte distribuido.
- Verificación: TypeScript, ESLint y build correctos; diez comprobaciones de integración con API simulada local, sin gasto de créditos. Inspección visual local de landing y formulario. Resultado en eval/results/workflow-smoke-20261028.json.
- Auditoría de funcionalidades y configuraciones pendientes en docs/REVISION_FLUJO_20261028.md. No se desplegaron los cambios ni se modificaron secretos o dependencias.

## 2026-11-01 — cuentas y Supabase
- Proyecto Supabase handful-recipes (Mezia): tabla recipes con RLS y acceso solo de servidor.
- Login con Supabase Auth (correo y contraseña); recetas por usuario, "Your recipes" desde cualquier dispositivo, límite de 10 recetas por día y subida protegida (la abuela solo sube audio con su enlace).
- Avisos de inicio y cierre de sesión, encabezado responsive, README en inglés y licencia MIT.
- Video de demo en demo/remotion (Remotion) con capturas y salidas reales.

## 2026-11-03
- Narracion, musica y efectos en el video de demo; paquete y textos de entrega (docs/ENTREGA.md).
