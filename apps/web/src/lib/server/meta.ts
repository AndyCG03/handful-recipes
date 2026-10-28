import "server-only";

/**
 * Minimal Meta Model API client. Formats verified against dev.meta.ai/docs on 2026-10-27
 * and exercised by services/worker/scripts/validate_models.py.
 */

export const MODELS = {
  transcribe: "muse-voice-transcribe-1.0",
  spark: "muse-spark-1.3",
  sam: "sam-3.1",
} as const;

const BASE = process.env.META_API_BASE_URL ?? "https://api.meta.ai/v1";

function apiKey(): string {
  const key = process.env.MODEL_API_KEY;
  if (!key) throw new Error("MODEL_API_KEY is not configured");
  return key;
}

export class MetaApiError extends Error {
  constructor(
    public status: number,
    public body: string,
    where: string,
  ) {
    super(`${where} failed (${status}): ${body.slice(0, 300)}`);
  }
}

async function check(res: Response, where: string): Promise<Response> {
  if (!res.ok) throw new MetaApiError(res.status, await res.text(), where);
  return res;
}

// ---------- Voice Transcribe ----------

export type TranscribeTurn = { turnId: number; startMs: number; endMs: number; transcript: string; speaker?: string };
export type TranscribeResult = { sessionId: string; transcript: string; audioDurationMs: number; turns: TranscribeTurn[] };

export async function transcribe(
  wav: Buffer,
  opts: { mode?: "DIARIZATION" | "PUSH_TO_TALK"; languageBias?: string[]; keywords?: string[] } = {},
): Promise<TranscribeResult> {
  const request = {
    model: MODELS.transcribe,
    audioEncoding: "WAV",
    mode: opts.mode ?? "DIARIZATION",
    languageBias: opts.languageBias ?? ["es", "en"],
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
  };
  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  form.append("audio", new Blob([new Uint8Array(wav)], { type: "audio/wav" }), "audio.wav");
  const res = await fetch(`${BASE}/asr/transcribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, Accept: "application/json" },
    body: form,
  });
  return (await check(res, "transcribe")).json();
}

// ---------- Files ----------

export async function uploadFile(bytes: Buffer, filename: string, mime: string): Promise<string> {
  const form = new FormData();
  form.append("purpose", "user_data");
  form.append("file", new Blob([new Uint8Array(bytes)], { type: mime }), filename);
  const res = await fetch(`${BASE}/files`, { method: "POST", headers: { Authorization: `Bearer ${apiKey()}` }, body: form });
  const json = (await (await check(res, "files.upload")).json()) as { id: string };
  return json.id;
}

// ---------- Responses (Spark / SAM) ----------

type ContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_video"; file_id: string }
  | { type: "input_image"; file_id: string };

type ResponsesOutput = { output_text?: string; output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }> };

function outputText(r: ResponsesOutput): string {
  if (r.output_text) return r.output_text;
  return (r.output ?? [])
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text" || c.type === "text")
    .map((c) => c.text ?? "")
    .join("");
}

/** Spark call constrained to a JSON schema. Returns the parsed object (validate it with zod at the call site). */
export async function sparkJson(params: {
  content: ContentPart[];
  schemaName: string;
  schema: Record<string, unknown>;
  reasoning?: "low" | "medium" | "high";
}): Promise<unknown> {
  const body = {
    model: MODELS.spark,
    input: [{ type: "message", role: "user", content: params.content }],
    text: { format: { type: "json_schema", name: params.schemaName, schema: params.schema, strict: true } },
    ...(params.reasoning ? { reasoning: { effort: params.reasoning } } : {}),
  };
  const res = await fetch(`${BASE}/responses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = outputText((await (await check(res, "spark")).json()) as ResponsesOutput);
  return JSON.parse(text);
}

/** SAM 3.1 on an uploaded image or video. Returns boxes of the first frame/image (masks are left for later). */
export async function samBoxes(fileId: string, kind: "image" | "video", prompt: string) {
  const media: ContentPart = kind === "image" ? { type: "input_image", file_id: fileId } : { type: "input_video", file_id: fileId };
  const res = await fetch(`${BASE}/responses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODELS.sam,
      stream: true,
      input: [{ type: "message", role: "user", content: [{ type: "input_text", text: prompt }, media] }],
    }),
  });
  await check(res, "sam");
  const raw = await readSseText(res);
  return parseSamBoxes(raw);
}

async function readSseText(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let buf = "";
  let out = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return out;
      try {
        const ev = JSON.parse(payload) as { type?: string; delta?: string };
        if (ev.type === "response.output_text.delta" && ev.delta) out += ev.delta;
      } catch {
        /* ignore keep-alives */
      }
    }
  }
  return out;
}

export type SamBox = { x1: number; y1: number; x2: number; y2: number; w: number; h: number };

/** Parses `<|box;x1=..;y1=..;x2=..;y2=..;w=..;h=..|>` tokens from the first frame (or the image). */
export function parseSamBoxes(raw: string): SamBox[] {
  const firstLine = raw.split("\n").find((l) => l.includes("<|box")) ?? "";
  const boxes: SamBox[] = [];
  for (const m of firstLine.matchAll(/<\|box;([^|]+)\|>/g)) {
    const kv = Object.fromEntries(m[1].split(";").map((p) => p.split("=") as [string, string]));
    const n = (k: string) => Number(kv[k]);
    if (["x1", "y1", "x2", "y2", "w", "h"].every((k) => Number.isFinite(n(k)))) {
      boxes.push({ x1: n("x1"), y1: n("y1"), x2: n("x2"), y2: n("y2"), w: n("w"), h: n("h") });
    }
  }
  return boxes;
}
