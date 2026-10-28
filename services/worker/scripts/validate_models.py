"""Validación técnica del día 1: prueba Voice Transcribe, Spark 1.3 y SAM 3.1 con un video real.

Uso (desde la raíz del repo):
    python services/worker/scripts/validate_models.py --video eval/videos/prueba.mp4 [--sam-prompt "salt"]

Requiere MODEL_API_KEY en .env (raíz del repo) y ffmpeg en PATH.
Guarda todas las respuestas crudas en eval/results/validation_<fecha>/ para revisarlas y medir.
Formatos de request según dev.meta.ai/docs (consultado el 27 oct 2026).
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

try:  # Usa el almacén de certificados de Windows (el bundle de certifi falla en esta máquina)
    import truststore

    truststore.inject_into_ssl()
except ImportError:
    pass

BASE = "https://api.meta.ai/v1"
ROOT = Path(__file__).resolve().parents[3]


def load_env() -> str:
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())
    key = os.getenv("MODEL_API_KEY") or os.getenv("META_API_KEY")
    if not key:
        sys.exit("Falta MODEL_API_KEY en .env")
    return key


def save(outdir: Path, name: str, data) -> None:
    p = outdir / name
    if isinstance(data, (dict, list)):
        p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    else:
        p.write_text(str(data), encoding="utf-8")


def step(title: str):
    print(f"\n=== {title} ===", flush=True)
    return time.perf_counter()


def done(t0: float, ok: bool, msg: str = "") -> dict:
    dt = round(time.perf_counter() - t0, 1)
    print(f"{'OK' if ok else 'FALLA'} ({dt}s) {msg}", flush=True)
    return {"ok": ok, "seconds": dt, "note": msg}


def extract_wav(video: Path, outdir: Path) -> Path:
    wav = outdir / "audio.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-vn",
         "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", "-map_metadata", "-1", str(wav)],
        check=True,
    )
    return wav


def transcribe(key: str, wav: Path) -> dict:
    req = {
        "model": "muse-voice-transcribe-1.0",
        "audioEncoding": "WAV",
        "mode": "DIARIZATION",
        "languageBias": ["es", "en"],
    }
    with wav.open("rb") as f:
        r = requests.post(
            f"{BASE}/asr/transcribe",
            headers={"Authorization": f"Bearer {key}", "Accept": "application/json"},
            files={
                "request": (None, json.dumps(req), "application/json"),
                "audio": (wav.name, f, "audio/wav"),
            },
            timeout=600,
        )
    r.raise_for_status()
    return r.json()


def upload(key: str, path: Path) -> str:
    with path.open("rb") as f:
        r = requests.post(
            f"{BASE}/files",
            headers={"Authorization": f"Bearer {key}"},
            data={"purpose": "user_data"},
            files={"file": (path.name, f, "video/mp4")},
            timeout=600,
        )
    r.raise_for_status()
    return r.json()["id"]


STEPS_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["title", "steps", "gaps"],
    "properties": {
        "title": {"type": "string"},
        "steps": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["start_sec", "end_sec", "action", "ingredients", "informal_measure"],
                "properties": {
                    "start_sec": {"type": "number"},
                    "end_sec": {"type": "number"},
                    "action": {"type": "string"},
                    "ingredients": {"type": "array", "items": {"type": "string"}},
                    "informal_measure": {"type": ["string", "null"]},
                },
            },
        },
        "gaps": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["step_index", "kind", "question", "evidence"],
                "properties": {
                    "step_index": {"type": "integer"},
                    "kind": {"type": "string", "enum": ["heat", "time", "variety", "doneness", "quantity", "other"]},
                    "question": {"type": "string"},
                    "evidence": {"type": "string"},
                },
            },
        },
    },
}

SPARK_PROMPT = """You are extracting a family recipe from a home cooking video.
A transcript with speaker turns (milliseconds) is provided below.

Rules:
- Split the cooking into ordered steps with start_sec/end_sec from the video.
- informal_measure: copy the literal phrase said or shown (e.g. "un puñito", "hasta que se dore"). NEVER convert to grams, cups or numbers that were not said. Use null if none.
- gaps: information a person would need to reproduce the dish that was NOT said or clearly shown (heat level, duration, ingredient variety, how to know it is done, amounts). Write each question in the language spoken in the video, warmly, addressed to the cook. evidence = why it is a gap. Do not ask about things that were stated.
- Do not invent anything not supported by the video or transcript.

TRANSCRIPT:
"""


def spark(key: str, file_id: str, turns_text: str) -> dict:
    body = {
        "model": "muse-spark-1.3",
        "input": [{
            "type": "message",
            "role": "user",
            "content": [
                {"type": "input_text", "text": SPARK_PROMPT + turns_text},
                {"type": "input_video", "file_id": file_id},
            ],
        }],
        "text": {"format": {"type": "json_schema", "name": "recipe", "schema": STEPS_SCHEMA, "strict": True}},
    }
    r = requests.post(f"{BASE}/responses", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=900)
    if r.status_code >= 400:
        raise RuntimeError(f"{r.status_code}: {r.text[:800]}")
    return r.json()


def response_text(resp: dict) -> str:
    if resp.get("output_text"):
        return resp["output_text"]
    parts = []
    for item in resp.get("output", []):
        for c in item.get("content", []) or []:
            if c.get("type") in ("output_text", "text"):
                parts.append(c.get("text", ""))
    return "".join(parts)


def sam(key: str, file_id: str, prompt: str) -> str:
    body = {
        "model": "sam-3.1",
        "stream": True,
        "input": [{
            "type": "message",
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {"type": "input_video", "file_id": file_id},
            ],
        }],
    }
    text = []
    with requests.post(f"{BASE}/responses", headers={"Authorization": f"Bearer {key}"},
                       json=body, stream=True, timeout=900) as r:
        if r.status_code >= 400:
            raise RuntimeError(f"{r.status_code}: {r.text[:800]}")
        for line in r.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data:"):
                continue
            payload = line[5:].strip()
            if payload == "[DONE]":
                break
            try:
                ev = json.loads(payload)
            except json.JSONDecodeError:
                continue
            if ev.get("type") == "response.output_text.delta":
                text.append(ev.get("delta", ""))
    return "".join(text)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True, type=Path)
    ap.add_argument("--sam-prompt", default="hand")
    ap.add_argument("--sam-clip-seconds", type=int, default=8,
                    help="SAM se prueba sobre un recorte corto para limitar coste")
    ap.add_argument("--sam-start", type=float, default=0.0)
    args = ap.parse_args()

    key = load_env()
    outdir = ROOT / "eval" / "results" / f"validation_{datetime.now():%Y%m%d_%H%M%S}"
    outdir.mkdir(parents=True)
    report: dict = {"video": str(args.video)}

    t = step("1. Audio + Voice Transcribe (DIARIZATION)")
    turns_text = ""
    try:
        wav = extract_wav(args.video, outdir)
        tr = transcribe(key, wav)
        save(outdir, "transcribe.json", tr)
        turns = tr.get("turns", [])
        turns_text = "\n".join(
            f"[{x.get('startMs')}-{x.get('endMs')}] {x.get('speaker', '?')}: {x.get('transcript', '')}" for x in turns
        ) or tr.get("transcript", "")
        speakers = sorted({x.get("speaker") for x in turns if x.get("speaker")})
        report["transcribe"] = done(t, True, f"{len(turns)} turnos, hablantes={speakers}")
    except Exception as e:  # noqa: BLE001
        report["transcribe"] = done(t, False, repr(e)[:500])

    t = step("2. Subir video (Files API)")
    file_id = None
    try:
        file_id = upload(key, args.video)
        report["upload"] = done(t, True, file_id)
    except Exception as e:  # noqa: BLE001
        report["upload"] = done(t, False, repr(e)[:500])

    if file_id:
        t = step("3. Spark 1.3: pasos + huecos (JSON schema)")
        try:
            resp = spark(key, file_id, turns_text)
            save(outdir, "spark_raw.json", resp)
            recipe = json.loads(response_text(resp))
            save(outdir, "spark_recipe.json", recipe)
            report["spark"] = done(t, True, f"{len(recipe['steps'])} pasos, {len(recipe['gaps'])} huecos")
            print(json.dumps(recipe, ensure_ascii=False, indent=2)[:3000])
        except Exception as e:  # noqa: BLE001
            report["spark"] = done(t, False, repr(e)[:800])

    t = step(f"4. SAM 3.1 en recorte de {args.sam_clip_seconds}s: '{args.sam_prompt}'")
    try:
        clip = outdir / "sam_clip.mp4"
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(args.sam_start), "-i", str(args.video),
             "-t", str(args.sam_clip_seconds), "-an", "-vf", "scale=-2:720", "-c:v", "libx264", str(clip)],
            check=True,
        )
        clip_id = upload(key, clip)
        out = sam(key, clip_id, args.sam_prompt)
        save(outdir, "sam_output.txt", out)
        import re
        frames = len(set(re.findall(r"<(\d+)f>", out)))
        masks = out.count("<|mask")
        report["sam"] = done(t, masks > 0, f"{frames} fotogramas, {masks} máscaras")
    except Exception as e:  # noqa: BLE001
        report["sam"] = done(t, False, repr(e)[:800])

    save(outdir, "report.json", report)
    print(f"\nResultados en: {outdir}")


if __name__ == "__main__":
    main()
