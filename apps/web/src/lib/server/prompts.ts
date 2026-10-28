import "server-only";
import { z } from "zod";
import { GapKind } from "@/lib/domain";

// ---------- analyze: steps + gaps from video + transcript ----------

export const ANALYZE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "steps", "gaps"],
  properties: {
    title: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["start_sec", "end_sec", "action", "ingredients", "informal_measure", "handful_subject"],
        properties: {
          start_sec: { type: "number" },
          end_sec: { type: "number" },
          action: { type: "string" },
          ingredients: { type: "array", items: { type: "string" } },
          informal_measure: { type: ["string", "null"] },
          handful_subject: { type: ["string", "null"] },
        },
      },
    },
    gaps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["step_index", "kind", "question", "evidence"],
        properties: {
          step_index: { type: "integer" },
          kind: { type: "string", enum: GapKind.options },
          question: { type: "string" },
          evidence: { type: "string" },
        },
      },
    },
  },
} as const;

export const AnalyzeOut = z.object({
  title: z.string(),
  steps: z.array(
    z.object({
      start_sec: z.number(),
      end_sec: z.number(),
      action: z.string(),
      ingredients: z.array(z.string()),
      informal_measure: z.string().nullable(),
      handful_subject: z.string().nullable(),
    }),
  ),
  gaps: z.array(z.object({ step_index: z.number().int(), kind: GapKind, question: z.string(), evidence: z.string() })),
});

export function analyzePrompt(cookName: string, transcript: string): string {
  return `You are extracting a family recipe from a home cooking video. The cook is ${cookName}.
The speech transcript with speaker turns (seconds) is below; it may be empty or noisy.

Rules:
- Split the cooking into ordered steps using what is SEEN and SAID. start_sec/end_sec must point to where the step happens in the video.
- Write each action briefly in the language spoken in the video (Spanish if there is no speech).
- informal_measure: copy the literal phrase that was said (e.g. "un puñito", "hasta que se dore", "a ojo"). If nothing was said but an amount was added by hand or poured without measuring, write a short literal description in the video's language, such as "a ojo, directo de la bolsa". NEVER convert to grams, cups, minutes or any number that was not said. null if the step has no amount.
- handful_subject: when informal_measure is not null, a short ENGLISH noun phrase naming what holds or carries the amount on screen, so a segmentation model can find it: prefer "hand", "spoon", "bowl", "bag", "cup", "pot". Never name tiny items like "salt" or "cereal". null otherwise.
- gaps: information someone would need to reproduce the dish that was NOT said or clearly shown: heat level, duration, ingredient variety or brand, how to know it is done, amounts. One question per gap, written warmly in the video's language, addressed directly to ${cookName}. evidence = short reason it is a gap. Do not ask about what was already stated. At most 6 gaps, most important first.
- Do not invent anything unsupported by the video or transcript.

TRANSCRIPT:
${transcript || "(no speech detected)"}`;
}

// ---------- merge an answer into the recipe ----------

export const MERGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["note", "resolved"],
  properties: { note: { type: "string" }, resolved: { type: "boolean" } },
} as const;

export const MergeOut = z.object({ note: z.string(), resolved: z.boolean() });

export function mergePrompt(p: { cookName: string; question: string; stepAction: string | null; answer: string }): string {
  return `A family member answered a question about a recipe step by voice note.

Step: ${p.stepAction ?? "(general)"}
Question asked to ${p.cookName}: ${p.question}
Transcript of ${p.cookName}'s answer: ${p.answer}

Return:
- note: one short sentence to show on the step, keeping ${p.cookName}'s own words and units exactly as said (do not convert or add precision). Same language as the answer.
- resolved: true only if the answer actually answers the question; false if it is unclear, off-topic or empty.`;
}
