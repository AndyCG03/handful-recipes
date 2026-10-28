"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { OwnerRecipe, PublicRecipe } from "@/lib/domain";
import { getRecipe } from "@/lib/client/api";
import { editKeyFor } from "@/lib/client/owner";
import { runPipeline, type PipelineProgress } from "@/lib/client/pipeline";
import { ProgressPanel } from "@/components/ProgressPanel";
import { QuestionsPanel } from "@/components/QuestionsPanel";
import { RecipeView } from "@/components/RecipeView";

export function OwnerRecipePage({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<OwnerRecipe | PublicRecipe | null>(null);
  const [owner, setOwner] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    const key = editKeyFor(id);
    setEditKey(key);
    getRecipe(id, key)
      .then((res) => {
        setRecipe(res.recipe);
        setOwner(res.owner);
      })
      .catch((e: Error) => setLoadError(e.message));
  }, [id]);

  const resume = useCallback(async () => {
    if (!recipe || !editKey || !("askToken" in recipe)) return;
    setRunError(null);
    try {
      const next = await runPipeline(recipe, editKey, recipe.videoUrl, setProgress);
      setRecipe(next);
      setProgress(null);
    } catch (e) {
      setRunError(e instanceof Error ? e.message : "Processing failed");
    }
  }, [recipe, editKey]);

  if (loadError) return <p className="pt-8 text-lg">This recipe could not be found.</p>;
  if (!recipe) return <p className="pt-8 meta">Loading…</p>;
  if (!owner || !("askToken" in recipe)) {
    return (
      <div className="space-y-4 pt-4">
        <h1 className="font-display text-4xl">{recipe.title}</h1>
        <p className="meta">You are viewing the shared version of this recipe.</p>
        <RecipeView recipe={recipe} />
      </div>
    );
  }

  const unfinished = recipe.status !== "ready";
  const answered = recipe.gaps.filter((g) => g.status === "answered").length;

  return (
    <div className="space-y-8 pt-4">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">{recipe.title}</h1>
        <p className="meta">
          by {recipe.cookName} · {recipe.steps.length} steps · {answered}/{recipe.gaps.length} questions answered
        </p>
        {!unfinished && (
          <Link href={`/r/${recipe.id}`} className="btn-ghost px-0">
            Open the family link →
          </Link>
        )}
      </header>

      {unfinished && (
        <div className="space-y-3">
          {progress ? (
            <ProgressPanel progress={progress} error={runError} onRetry={resume} />
          ) : (
            <div className="card space-y-3">
              <p className="text-lg">
                {recipe.status === "failed" ? `Processing stopped: ${recipe.error ?? "unknown error"}` : "This recipe hasn't finished processing."}
              </p>
              <button type="button" className="btn-primary" onClick={resume}>
                Continue processing
              </button>
            </div>
          )}
        </div>
      )}

      {recipe.steps.length > 0 && <RecipeView recipe={recipe} />}

      {recipe.gaps.length > 0 && editKey && <QuestionsPanel recipe={recipe} editKey={editKey} onChange={setRecipe} />}
    </div>
  );
}
