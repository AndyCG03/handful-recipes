# Build log (construido durante el hackathon)

## 2026-10-27
- Investigación, selección de idea, identidad visual "Cuenco de barro".
- Plan del proyecto y estructura del repositorio.
- Script de validación `services/worker/scripts/validate_models.py`: Voice Transcribe (DIARIZATION), Files API, Spark 1.3 con video + JSON schema, SAM 3.1 en video con streaming.
- Prueba de plomería con video sintético (voz TTS es-MX + figura en movimiento): los 4 pasos OK. Spark: 4 pasos, 6 huecos, medidas literales sin convertir ("un puñito"). SAM: 120 máscaras en 4 s. Resultados en `eval/results/validation_20261027_225501/`.
- Fix TLS en Windows: `truststore` (certifi no valida api.meta.ai en esta máquina).
- Validación con video real (`eval/videos/video.mp4`, 50 s, cereal con leche, casi sin voz). Spark: 2 pasos correctos solo por lo visual, 2 preguntas de cantidad pertinentes, sin cantidades inventadas. Transcribe: 3 turnos con poco contenido (el video casi no tiene habla). SAM: "cereal" segmenta aros individuales; "bowl of cereal", "plastic bag" y "hand" segmentan la porción completa → el prompt de SAM debe nombrar el recipiente o la mano, no el ingrediente. Resultados en `eval/results/validation_20261027_231622/`.
