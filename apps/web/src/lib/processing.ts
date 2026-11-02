import type { BackgroundJob, RecipeStatus } from "./domain";

export const JOB_STALE_MS = 6 * 60 * 1000;
export const STAGE_LABELS = {
  transcribe: "Listening to the voices",
  analyze: "Building the steps and questions",
  handful: "Finding the visual measures",
} as const;

export function isJobActive(job: BackgroundJob | null | undefined, now = Date.now()): boolean {
  return !!job && (job.status === "queued" || job.status === "running") && now - Date.parse(job.updatedAt) < JOB_STALE_MS;
}

export function nextStage(status: RecipeStatus, hasTranscript: boolean, hasSteps: boolean) {
  if (status === "uploaded" || (status === "failed" && !hasTranscript && !hasSteps)) return "transcribe" as const;
  if (status === "transcribed" || (status === "failed" && !hasSteps)) return "analyze" as const;
  return "handful" as const;
}
