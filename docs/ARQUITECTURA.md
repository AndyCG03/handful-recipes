# Arquitectura actual — 28 de octubre de 2026

```mermaid
flowchart LR
  U1[Familiar graba o sube video] --> W[PWA Next.js]
  U1 -->|responde texto o voz en la revision| A[API de respuestas del propietario]
  U2[Familiar invitado por WhatsApp] -->|nota de voz| G[Pagina de respuesta]
  W -->|prepara WAV y fotogramas reales| M[WebAudio y captura en navegador]
  M -->|sube archivos| S[(Vercel Blob o disco local)]
  W -->|POST background devuelve 202| J[Job persistido con checkpoints]
  J --> K[Next after en servidor]
  K --> P2[Transcripcion] --> P3[Pasos y preguntas] --> P4[Cajas SAM en muestras]
  P2 --> VT[Muse Voice Transcribe]
  P3 --> SP[Muse Spark 1.3]
  P4 --> SAM[SAM 3.1]
  A -->|voz solamente| VT
  A -->|integrar texto con incertidumbre| SP
  G --> A2[API de respuesta familiar]
  A2 --> VT
  A2 --> SP
  K -->|guardar cada etapa| S
  A --> S
  A2 --> S
  W -->|consultar avance| J
  U3[Familia ve receta viva] --> R[Pagina compartida de lectura]
  R --> S
```

Regla: cada paso enlaza su clip; las medidas se muestran, nunca se inventan.

`after()` permite continuar tras responder al navegador, pero no sustituye una cola durable y está limitado por la duración de la función. Supabase, worker Python/FFmpeg y tracking temporal de máscaras son partes del plan aún no integradas en la aplicación actual. Ver `REVISION_FLUJO_20261028.md`.
