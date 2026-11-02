"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { OwnerRecipe, PublicRecipe } from "@/lib/domain";
import { getRecipe, startBackground } from "@/lib/client/api";
import { isJobActive, STAGE_LABELS } from "@/lib/processing";
import { ProgressPanel } from "@/components/ProgressPanel";
import { QuestionsPanel } from "@/components/QuestionsPanel";
import { RecipeView } from "@/components/RecipeView";

export function OwnerRecipePage({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<OwnerRecipe | PublicRecipe | null>(null);
  const [owner, setOwner] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    getRecipe(id)
      .then((res) => {
        setRecipe(res.recipe);
        setOwner(res.owner);
      })
      .catch((e: Error) => setLoadError(e.message));
  }, [id]);

  useEffect(() => {
    if (!recipe || !("job" in recipe) || !isJobActive(recipe.job)) return;
    let cancelled = false;
    const timer = setInterval(() => {
      void getRecipe(id).then((res) => {
        if (!cancelled) { setRecipe(res.recipe); setOwner(res.owner); }
      }).catch(() => { /* A temporary polling error does not fail a running server job. */ });
    }, 3000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [id, recipe]);

  const resume = useCallback(async () => {
    if (!recipe || !("askToken" in recipe)) return;
    setRunError(null);
    setStarting(true);
    try {
      setRecipe((await startBackground(recipe.id)).recipe);
    } catch (e) {
      setRunError(e instanceof Error ? e.message : "Processing failed");
    } finally {
      setStarting(false);
    }
  }, [recipe]);

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
  const active = isJobActive(recipe.job);
  const progress = recipe.job ? { label: STAGE_LABELS[recipe.job.stage], done: ["transcribe", "analyze", "handful"].indexOf(recipe.job.stage), total: 3 } : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-4">
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
          {active && progress ? (
            <ProgressPanel progress={progress} error={runError} background />
          ) : (
            <div className="card space-y-3">
              <p className="text-lg">
                {recipe.status === "failed" ? "Processing paused. Your saved stages are safe; retry to continue." : recipe.job ? "The last processing attempt is no longer active. Continue from the saved stage." : "Your video is saved. Start creating its draft in the background."}
              </p>
              <button type="button" className="btn-primary" disabled={starting} onClick={resume}>
                {starting ? "Starting…" : "Continue in background"}
              </button>
              {runError && <p role="alert" className="text-barro">{runError}</p>}
            </div>
          )}
        </div>
      )}

      {recipe.steps.length > 0 && <RecipeView recipe={recipe} />}

      {recipe.gaps.length > 0 && !unfinished && <QuestionsPanel recipe={recipe} onChange={setRecipe} />}
    </div>
  );
}
