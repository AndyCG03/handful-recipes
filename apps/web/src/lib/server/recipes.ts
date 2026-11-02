import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { CreateRecipeInput, ModelRun, Recipe } from "@/lib/domain";
import { currentUser } from "@/lib/supabase/server";
import { databaseEnabled, dbGetRecipe, dbGetRecipeByToken, dbSaveRecipe } from "./db";
import { getLatestJson, putJsonVersion } from "./storage";

const recipePrefix = (id: string) => `recipes/${id}`;
const tokenPrefix = (token: string) => `ask-tokens/${token}`;

export const newToken = () => randomBytes(18).toString("base64url");
export const newId = () => randomUUID();

// Serializes mutations inside one Node instance. A distributed deployment still needs
// database transactions/row locks (documented in the deployment review).
const mutations = new Map<string, Promise<unknown>>();
export async function withRecipeLock<T>(id: string, fn: () => Promise<T>): Promise<T> {
  const previous = mutations.get(id) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(fn);
  mutations.set(id, current);
  try { return await current; }
  finally { if (mutations.get(id) === current) mutations.delete(id); }
}

export async function createRecipe(input: CreateRecipeInput, ownerId: string): Promise<Recipe> {
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
    sampleFrames: input.sampleFrames,
    job: null,
    ownerId,
    askToken: newToken(),
  };
  await saveRecipe(recipe);
  if (!databaseEnabled()) await putJsonVersion(tokenPrefix(recipe.askToken), { recipeId: recipe.id });
  return recipe;
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const raw = databaseEnabled() ? await dbGetRecipe(id) : await getLatestJson(recipePrefix(id));
  if (!raw) return null;
  const parsed = Recipe.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export async function saveRecipe(recipe: Recipe): Promise<Recipe> {
  const next = Recipe.parse({ ...recipe, updatedAt: new Date().toISOString() });
  if (databaseEnabled()) await dbSaveRecipe(next);
  else await putJsonVersion(recipePrefix(next.id), next);
  return next;
}

export async function getRecipeByAskToken(token: string): Promise<Recipe | null> {
  if (!/^[A-Za-z0-9_-]{10,64}$/.test(token)) return null;
  if (databaseEnabled()) {
    const parsed = Recipe.safeParse(await dbGetRecipeByToken(token));
    return parsed.success && parsed.data.askToken === token ? parsed.data : null;
  }
  const idx = (await getLatestJson(tokenPrefix(token))) as { recipeId?: string } | null;
  if (!idx?.recipeId) return null;
  const recipe = await getRecipe(idx.recipeId);
  return recipe && recipe.askToken === token ? recipe : null;
}

export async function isOwner(recipe: Recipe): Promise<boolean> {
  const user = await currentUser();
  return user?.id === recipe.ownerId;
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
