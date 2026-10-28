"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Gap, PublicRecipe, Step } from "@/lib/domain";
import { formatTime } from "@/lib/format";
import { HandfulFrame } from "./HandfulFrame";

/**
 * The living recipe: one video, steps that play their own clip, handfuls shown (never converted),
 * and the cook's answers attached to their step.
 */
export function RecipeView({ recipe, renderStepExtra }: { recipe: PublicRecipe; renderStepExtra?: (step: Step) => React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stopAt = useRef<number | null>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (stopAt.current !== null && v.currentTime >= stopAt.current) {
        v.pause();
        stopAt.current = null;
      }
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const playStep = useCallback((s: Step) => {
    const v = videoRef.current;
    if (!v) return;
    setActiveStep(s.id);
    stopAt.current = s.endSec;
    v.currentTime = s.startSec;
    v.scrollIntoView({ behavior: "smooth", block: "center" });
    void v.play();
  }, []);

  const answersFor = (stepId: string) => recipe.gaps.filter((g) => g.stepId === stepId && g.answer);

  return (
    <div className="space-y-6">
      <video
        ref={videoRef}
        src={`${recipe.videoUrl}#t=0.5`}
        controls
        playsInline
        preload="metadata"
        className="mx-auto max-h-[60dvh] w-full rounded-3xl bg-black object-contain"
        aria-label={`Video of ${recipe.cookName} cooking ${recipe.title}`}
      />

      <ol className="space-y-4" aria-label="Steps">
        {recipe.steps.map((s) => (
          <li key={s.id} className={`card ${activeStep === s.id ? "border-barro" : ""}`}>
            <div className="flex items-start gap-4">
              <span aria-hidden className="font-display text-3xl leading-none text-barro">
                {s.order}
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-lg">{s.action}</p>
                {s.ingredients.length > 0 && <p className="meta">{s.ingredients.join(" · ")}</p>}

                {s.handful && <HandfulFrame handful={s.handful} />}

                {answersFor(s.id).map((g) => (
                  <AnswerNote key={g.id} gap={g} cookName={recipe.cookName} />
                ))}

                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => playStep(s)} className="btn-secondary min-h-11 px-4 text-base">
                    ▶ Watch {formatTime(s.startSec)}–{formatTime(s.endSec)}
                  </button>
                </div>
                {renderStepExtra?.(s)}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AnswerNote({ gap, cookName }: { gap: Gap; cookName: string }) {
  if (!gap.answer) return null;
  return (
    <figure className="rounded-2xl border-l-4 border-laurel bg-laurel/10 p-3">
      <figcaption className="meta mb-1">
        {cookName} answered: <span className="italic">“{gap.question}”</span>
      </figcaption>
      <blockquote className="text-lg">“{gap.answer.note}”</blockquote>
      <audio src={gap.answer.audioUrl} controls className="mt-2 w-full" aria-label={`${cookName}'s voice answer`} />
    </figure>
  );
}
