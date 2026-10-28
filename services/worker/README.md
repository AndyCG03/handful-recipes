# services/worker — pipeline

Python 3.12. Requiere FFmpeg en PATH.

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -e .[dev]
python -m handful_worker.main --video ruta\al\video.mp4
```

Etapas en `handful_worker/pipeline/` (una por archivo). Prompts en `handful_worker/prompts/`. Cada salida guarda procedencia en `model_runs`.
