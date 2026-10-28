import type { OwnerRecipe } from "@/lib/domain";
import { runStage, uploadFile } from "./api";
import { captureFrames } from "./media";

export type PipelineProgress = { label: string; done: number; total: number };

/**
 * Runs the remaining pipeline stages for a recipe. Resumable: it starts from the recipe's status.
 * `videoSrc` should be an object URL of the local file when available (avoids CORS on frame capture).
 */
export async function runPipeline(
  recipe: OwnerRecipe,
  editKey: string,
  videoSrc: string,
  onProgress: (p: PipelineProgress) => void,
): Promise<OwnerRecipe> {
  let r = recipe;
  const total = 3;

  if (r.status === "uploaded" || (r.status === "failed" && r.transcript.length === 0 && r.steps.length === 0)) {
    onProgress({ label: "Listening to the voices", done: 0, total });
    r = (await runStage(r.id, editKey, "transcribe")).recipe;
  }
  if (r.status === "transcribed" || (r.status === "failed" && r.steps.length === 0)) {
    onProgress({ label: "Watching the hands, step by step", done: 1, total });
    r = (await runStage(r.id, editKey, "analyze")).recipe;
  }
  if (r.status === "analyzed" || r.status === "failed") {
    onProgress({ label: "Finding each handful", done: 2, total });
    const targets = r.steps.filter((s) => s.handful);
    const seconds = targets.map((s) => (s.startSec + s.endSec) / 2);
    const frames = seconds.length ? await captureFrames(videoSrc, seconds) : [];
    const uploaded = await Promise.all(
      frames.map(async (blob, i) => ({
        stepId: targets[i].id,
        frameSec: seconds[i],
        frameUrl: await uploadFile(blob, `${r.id}/frames/${targets[i].id}.jpg`),
      })),
    );
    r = (await runStage(r.id, editKey, "handful", uploaded)).recipe;
  }
  onProgress({ label: "Ready", done: total, total });
  return r;
}
