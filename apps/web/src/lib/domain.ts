import { z } from "zod";

/**
 * Domain model for Handful Recipes.
 * Product rule: a recipe only states what the video or an answer supports.
 * Informal measures are kept as literal phrases and never converted to numbers.
 */

export const RecipeStatus = z.enum([
  "uploaded", // video + audio stored, nothing processed
  "transcribed", // voice turns available
  "analyzed", // steps + gaps extracted
  "ready", // handful frames done, ready for review
  "failed",
]);
export type RecipeStatus = z.infer<typeof RecipeStatus>;

export const TranscriptTurn = z.object({
  speaker: z.string().nullable(),
  startSec: z.number(),
  endSec: z.number(),
  text: z.string(),
});
export type TranscriptTurn = z.infer<typeof TranscriptTurn>;

export const Box = z.object({ x1: z.number(), y1: z.number(), x2: z.number(), y2: z.number(), w: z.number(), h: z.number() });
export type Box = z.infer<typeof Box>;

export const Handful = z.object({
  phrase: z.string(), // literal: "un puñito", "hasta que se dore"
  frameSec: z.number().nullable(),
  frameUrl: z.string().nullable(),
  samPrompt: z.string().nullable(),
  boxes: z.array(Box).default([]),
});
export type Handful = z.infer<typeof Handful>;

export const Step = z.object({
  id: z.string(),
  order: z.number().int(),
  action: z.string(),
  ingredients: z.array(z.string()),
  startSec: z.number(),
  endSec: z.number(),
  handful: Handful.nullable(),
});
export type Step = z.infer<typeof Step>;

export const GapKind = z.enum(["heat", "time", "variety", "doneness", "quantity", "other"]);
export type GapKind = z.infer<typeof GapKind>;

export const GapStatus = z.enum(["open", "sent", "answered", "dismissed"]);
export type GapStatus = z.infer<typeof GapStatus>;

export const Answer = z.object({
  audioUrl: z.string(),
  transcript: z.string(),
  note: z.string(), // concise statement placed on the step, in the cook's words
  resolved: z.boolean(),
  answeredAt: z.string(),
});
export type Answer = z.infer<typeof Answer>;

export const Gap = z.object({
  id: z.string(),
  stepId: z.string().nullable(),
  kind: GapKind,
  question: z.string(),
  evidence: z.string(),
  status: GapStatus,
  answer: Answer.nullable(),
});
export type Gap = z.infer<typeof Gap>;

export const ModelRun = z.object({
  stage: z.string(),
  model: z.string(),
  ok: z.boolean(),
  ms: z.number(),
  at: z.string(),
  note: z.string().optional(),
});
export type ModelRun = z.infer<typeof ModelRun>;

export const Recipe = z.object({
  id: z.string(),
  title: z.string(),
  cookName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: RecipeStatus,
  error: z.string().nullable(),
  videoUrl: z.string(),
  audioUrl: z.string(),
  durationSec: z.number(),
  transcript: z.array(TranscriptTurn),
  steps: z.array(Step),
  gaps: z.array(Gap),
  runs: z.array(ModelRun),
  /** sha256 of the owner's edit key; never sent to clients */
  editKeyHash: z.string(),
  /** token for the answer page shared with the cook */
  askToken: z.string(),
});
export type Recipe = z.infer<typeof Recipe>;

/** What anyone with the share link sees. */
export type PublicRecipe = Omit<Recipe, "editKeyHash" | "askToken" | "runs">;
/** What the owner sees. */
export type OwnerRecipe = Omit<Recipe, "editKeyHash">;

export function toPublic(r: Recipe): PublicRecipe {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { editKeyHash, askToken, runs, ...rest } = r;
  return rest;
}

export function toOwner(r: Recipe): OwnerRecipe {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { editKeyHash, ...rest } = r;
  return rest;
}

/** Questions the cook sees on the answer page. */
export type AskView = {
  title: string;
  cookName: string;
  questions: Array<Pick<Gap, "id" | "question" | "status"> & { stepAction: string | null; answered: boolean }>;
};

export const PIPELINE_STAGES = ["transcribe", "analyze", "handful"] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const CreateRecipeInput = z.object({
  title: z.string().trim().min(1).max(120),
  cookName: z.string().trim().min(1).max(60),
  videoUrl: z.string().min(1),
  audioUrl: z.string().min(1),
  durationSec: z.number().positive().max(15 * 60),
  consent: z.literal(true),
});
export type CreateRecipeInput = z.infer<typeof CreateRecipeInput>;

export const MAX_VIDEO_SECONDS = 10 * 60;
