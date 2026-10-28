import "server-only";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { CreateRecipeInput, ModelRun, Recipe } from "@/lib/domain";
import { getLatestJson, putJsonVersion } from "./storage";

const recipePrefix = (id: string) => `recipes/${id}`;
const tokenPrefix = (token: string) => `ask-tokens/${token}`;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const newToken = () => randomBytes(18).toString("base64url");
export const newId = () => randomUUID();

export async function createRecipe(input: CreateRecipeInput): Promise<{ recipe: Recipe; editKey: string }> {
  const editKey = newToken();
  const now = new Date().toISOString();
  const recipe: Recipe = {
    id: newId(),
    title: input.title,
    cookName: input.cookName,
    createdAt: now,
    updatedAt: now,
    status: "uploaded",
    error: null,
    videoUrl: input.videoUrl,
    audioUrl: input.audioUrl,
    durationSec: input.durationSec,
    transcript: [],
    steps: [],
    gaps: [],
    runs: [],
    editKeyHash: sha256(editKey),
    askToken: newToken(),
  };
  await saveRecipe(recipe);
  await putJsonVersion(tokenPrefix(recipe.askToken), { recipeId: recipe.id });
  return { recipe, editKey };
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const raw = await getLatestJson(recipePrefix(id));
  if (!raw) return null;
  const parsed = Recipe.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export async function saveRecipe(recipe: Recipe): Promise<Recipe> {
  const next = Recipe.parse({ ...recipe, updatedAt: new Date().toISOString() });
  await putJsonVersion(recipePrefix(next.id), next);
  return next;
}

export async function getRecipeByAskToken(token: string): Promise<Recipe | null> {
  if (!/^[A-Za-z0-9_-]{10,64}$/.test(token)) return null;
  const idx = (await getLatestJson(tokenPrefix(token))) as { recipeId?: string } | null;
  if (!idx?.recipeId) return null;
  const recipe = await getRecipe(idx.recipeId);
  return recipe && recipe.askToken === token ? recipe : null;
}

export function isOwner(recipe: Recipe, editKey: string | null): boolean {
  if (!editKey) return false;
  const a = Buffer.from(sha256(editKey), "hex");
  const b = Buffer.from(recipe.editKeyHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Runs `fn`, timing it and appending a ModelRun entry for provenance. */
export async function recordRun<T>(recipe: Recipe, stage: string, model: string, fn: () => Promise<T>): Promise<T> {
  const t0 = Date.now();
  try {
    const out = await fn();
    recipe.runs.push(run(stage, model, true, Date.now() - t0));
    return out;
  } catch (e) {
    recipe.runs.push(run(stage, model, false, Date.now() - t0, e instanceof Error ? e.message.slice(0, 300) : String(e)));
    throw e;
  }
}

function run(stage: string, model: string, ok: boolean, ms: number, note?: string): ModelRun {
  return { stage, model, ok, ms, at: new Date().toISOString(), ...(note ? { note } : {}) };
}
