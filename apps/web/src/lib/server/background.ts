import "server-only";
import { randomUUID } from "node:crypto";
import type { Recipe } from "@/lib/domain";
import { isJobActive, nextStage } from "@/lib/processing";
import { stageAnalyze, stageHandfulFromSamples, stageTranscribe } from "./pipeline";
import { getRecipe, saveRecipe, withRecipeLock } from "./recipes";

/** Checkpoints survive navigation. Next after() is bounded by the hosting function's lifetime;
 * this is deliberately NOT described as a durable/distributed queue. */
export async function prepareBackgroundJob(recipe: Recipe): Promise<Recipe> {
  return withRecipeLock(recipe.id, async () => {
  recipe = (await getRecipe(recipe.id)) ?? recipe;
  if (recipe.status === "ready" || isJobActive(recipe.job)) return recipe;
  const now = new Date().toISOString();
  recipe.job = {
    id: randomUUID(), status: "queued", stage: recipe.status === "failed" && recipe.job ? recipe.job.stage : nextStage(recipe.status, recipe.transcript.length > 0, recipe.steps.length > 0),
    createdAt: now, updatedAt: now, error: null,
  };
  recipe.error = null;
  return saveRecipe(recipe);
  });
}

const running = new Set<string>();

export async function runBackgroundJob(id: string, jobId: string): Promise<void> {
  if (running.has(id)) return;
  running.add(id);
  let recipe: Recipe | null = null;
  try {
    recipe = await getRecipe(id);
    if (!recipe?.job || recipe.job.id !== jobId || recipe.job.status === "completed") return;
    while (recipe.status !== "ready") {
      const stage = recipe.status === "failed" && recipe.job ? recipe.job.stage : nextStage(recipe.status, recipe.transcript.length > 0, recipe.steps.length > 0);
      recipe.job = { ...recipe.job!, status: "running", stage, updatedAt: new Date().toISOString() };
      recipe = await saveRecipe(recipe);
      if (stage === "transcribe") await stageTranscribe(recipe);
      else if (stage === "analyze") await stageAnalyze(recipe);
      else await stageHandfulFromSamples(recipe);
      const latest = await getRecipe(id);
      if (latest?.job?.id !== jobId) return;
      recipe.job = { ...recipe.job!, status: recipe.status === "ready" ? "completed" : "running", updatedAt: new Date().toISOString() };
      recipe.error = null;
      recipe = await saveRecipe(recipe);
    }
  } catch (e) {
    if (recipe?.job && (await getRecipe(id))?.job?.id === jobId) {
      recipe.error = e instanceof Error ? e.message.slice(0, 300) : "Processing failed";
      recipe.status = "failed";
      recipe.job = { ...recipe.job, status: "failed", error: recipe.error, updatedAt: new Date().toISOString() };
      await saveRecipe(recipe).catch(() => undefined);
    }
    console.error("Background recipe processing failed", id, e instanceof Error ? e.message : "Unknown error");
  } finally {
    running.delete(id);
  }
}
