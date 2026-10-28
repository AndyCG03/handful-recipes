"""Cliente mínimo de Meta Model API. IDs según dev.meta.ai/docs/models (27 oct 2026)."""
import os

MODELS = {
    "transcribe": "muse-voice-transcribe-1.0",
    "spark": "muse-spark-1.3",
    "sam": "sam-3.1",
    "image": "muse-image-1.0",
}

API_KEY = os.getenv("META_API_KEY")
BASE_URL = os.getenv("META_API_BASE_URL")
# TODO día 1: verificar endpoints reales, límites de video y salida JSON con esquema.
