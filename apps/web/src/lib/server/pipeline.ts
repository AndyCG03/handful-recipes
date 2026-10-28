import "server-only";
import type { Gap, Recipe, Step } from "@/lib/domain";
import { MODELS, samBoxes, sparkJson, transcribe, uploadFile } from "./meta";
import { ANALYZE_SCHEMA, AnalyzeOut, MERGE_SCHEMA, MergeOut, analyzePrompt, mergePrompt } from "./prompts";
import { newId, recordRun } from "./recipes";
import { readBytes } from "./storage";

/**
 * Pipeline stages. Each stage is short enough for one serverless request and mutates
 * the recipe in place; the caller persists it.
 *   transcribe → analyze → handful (client supplies frames) → ready
 */

export async function stageTranscribe(recipe: Recipe): Promise<void> {
  const wav = await readBytes(recipe.audioUrl);
  const res = await recordRun(recipe, "transcribe", MODELS.transcribe, () => transcribe(wav));
  recipe.transcript = res.turns.map((t) => ({
    speaker: t.speaker ?? null,
    startSec: t.startMs / 1000,
    endSec: t.endMs / 1000,
    text: t.transcript,
  }));
  recipe.status = "transcribed";
}

export async function stageAnalyze(recipe: Recipe): Promise<void> {
  const video = await readBytes(recipe.videoUrl);
  const fileId = await recordRun(recipe, "analyze.upload", "files", () => uploadFile(video, "recipe.mp4", "video/mp4"));
  const transcriptText = recipe.transcript
    .map((t) => `[${t.startSec.toFixed(1)}-${t.endSec.toFixed(1)}] ${t.speaker ?? "?"}: ${t.text}`)
    .join("\n");

  const raw = await recordRun(recipe, "analyze", MODELS.spark, () =>
    sparkJson({
      content: [
        { type: "input_text", text: analyzePrompt(recipe.cookName, transcriptText) },
        { type: "input_video", file_id: fileId },
      ],
      schemaName: "recipe_analysis",
      schema: ANALYZE_SCHEMA,
    }),
  );
  const out = AnalyzeOut.parse(raw);

  const clamp = (s: number) => Math.min(Math.max(0, s), recipe.durationSec);
  const kept = out.steps
    .map((s, originalIndex) => ({ ...s, originalIndex, id: newId(), start_sec: clamp(s.start_sec), end_sec: clamp(s.end_sec) }))
    .filter((s) => s.end_sec > s.start_sec && s.action.trim())
    .sort((a, b) => a.start_sec - b.start_sec);

  const steps: Step[] = kept.map((s, i) => ({
      id: s.id,
      order: i + 1,
      action: s.action.trim(),
      ingredients: s.ingredients,
      startSec: s.start_sec,
      endSec: s.end_sec,
      handful: s.informal_measure
        ? { phrase: s.informal_measure, frameSec: null, frameUrl: null, samPrompt: s.handful_subject ?? "hand", boxes: [] }
        : null,
    }));

  // step_index refers to the model's original order.
  const stepIdByOriginalIndex = new Map(kept.map((s) => [s.originalIndex, s.id]));
  const gaps: Gap[] = out.gaps.slice(0, 6).map((g) => ({
    id: newId(),
    stepId: stepIdByOriginalIndex.get(g.step_index) ?? null,
    kind: g.kind,
    question: g.question.trim(),
    evidence: g.evidence.trim(),
    status: "open",
    answer: null,
  }));

  if (!recipe.title.trim() && out.title) recipe.title = out.title;
  recipe.steps = steps;
  recipe.gaps = gaps;
  recipe.status = "analyzed";
}

export type HandfulFrame = { stepId: string; frameUrl: string; frameSec: number };

export async function stageHandful(recipe: Recipe, frames: HandfulFrame[]): Promise<void> {
  for (const f of frames) {
    const step = recipe.steps.find((s) => s.id === f.stepId);
    if (!step?.handful) continue;
    step.handful.frameUrl = f.frameUrl;
    step.handful.frameSec = f.frameSec;
    try {
      const img = await readBytes(f.frameUrl);
      const fileId = await uploadFile(img, "frame.jpg", "image/jpeg");
      const prompt = step.handful.samPrompt ?? "hand";
      let boxes = await recordRun(recipe, "handful", MODELS.sam, () => samBoxes(fileId, "image", prompt));
      if (boxes.length === 0 && prompt !== "hand") {
        boxes = await recordRun(recipe, "handful.fallback", MODELS.sam, () => samBoxes(fileId, "image", "hand"));
      }
      step.handful.boxes = boxes.slice(0, 3);
    } catch {
      // A missing box is acceptable: the frame still shows the gesture. Error is kept in runs.
      step.handful.boxes = [];
    }
  }
  recipe.status = "ready";
}

export async function answerGap(recipe: Recipe, gapId: string, audioUrl: string): Promise<Gap> {
  const gap = recipe.gaps.find((g) => g.id === gapId);
  if (!gap) throw new Error("Question not found");
  const wav = await readBytes(audioUrl);
  const tr = await recordRun(recipe, "answer.transcribe", MODELS.transcribe, () => transcribe(wav, { mode: "PUSH_TO_TALK" }));
  const text = tr.transcript.trim();
  const step = recipe.steps.find((s) => s.id === gap.stepId);

  let merged = { note: text, resolved: text.length > 0 };
  if (text) {
    const raw = await recordRun(recipe, "answer.merge", MODELS.spark, () =>
      sparkJson({
        content: [
          { type: "input_text", text: mergePrompt({ cookName: recipe.cookName, question: gap.question, stepAction: step?.action ?? null, answer: text }) },
        ],
        schemaName: "answer_merge",
        schema: MERGE_SCHEMA,
        reasoning: "low",
      }),
    );
    merged = MergeOut.parse(raw);
  }

  gap.answer = { audioUrl, transcript: text, note: merged.note, resolved: merged.resolved, answeredAt: new Date().toISOString() };
  gap.status = "answered";
  return gap;
}
