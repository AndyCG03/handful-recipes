"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { MAX_VIDEO_SECONDS } from "@/lib/domain";
import { createRecipe, startBackground, uploadFile } from "@/lib/client/api";
import { captureFrames, sampleTimes, toWav, videoDuration } from "@/lib/client/media";
import { type PipelineProgress } from "@/lib/client/pipeline";
import { ProgressPanel } from "@/components/ProgressPanel";

export function NewRecipeForm() {
  const router = useRouter();
  const ids = { title: useId(), cook: useId(), video: useId(), consent: useId() };
  const [file, setFile] = useState<File | null>(null);
  const [captureMode, setCaptureMode] = useState<"upload" | "record">("upload");
  const [title, setTitle] = useState("");
  const [cookName, setCookName] = useState("");
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = progress !== null && !error;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !consent) return;
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    let createdId: string | null = null;
    try {
      setProgress({ label: "Checking the video", done: 0, total: 5 });
      const duration = await videoDuration(file);
      if (duration > MAX_VIDEO_SECONDS) throw new Error("Please use a video of 10 minutes or less.");
      if (!Number.isFinite(duration) || duration <= 0) throw new Error("We couldn't read this video's duration. Try exporting it as MP4.");

      setProgress({ label: "Preparing the audio", done: 0, total: 5 });
      const wav = await toWav(file);

      setProgress({ label: "Preparing visual moments", done: 1, total: 5 });
      const seconds = sampleTimes(duration);
      const frames = await captureFrames(objectUrl, seconds);

      const stamp = Date.now();
      const ext = file.type === "video/quicktime" ? "mov" : "mp4";
      setProgress({ label: "Uploading the video", done: 1, total: 5 });
      const [videoUrl, audioUrl] = await Promise.all([
        uploadFile(file, `${stamp}/video.${ext}`, (pct) => setProgress({ label: `Uploading the video · ${Math.round(pct)}%`, done: 1, total: 5 })),
        uploadFile(wav, `${stamp}/audio.wav`),
      ]);
      setProgress({ label: "Saving the visual moments", done: 3, total: 5 });
      const sampleFrames: Array<{ frameUrl: string; frameSec: number }> = [];
      // Bound upload concurrency on mobile rather than uploading 24 frames at once.
      for (let i = 0; i < frames.length; i += 3) {
        sampleFrames.push(...await Promise.all(frames.slice(i, i + 3).map(async (frame, offset) => ({
          frameSec: seconds[i + offset], frameUrl: await uploadFile(frame, `${stamp}/samples/${i + offset}.jpg`),
        }))));
      }

      const { recipe } = await createRecipe({ title, cookName, videoUrl, audioUrl, durationSec: duration, sampleFrames, consent: true });
      createdId = recipe.id;

      setProgress({ label: "Starting your draft in the background", done: 4, total: 5 });
      await startBackground(recipe.id);
      router.push(`/recipes/${recipe.id}`);
    } catch (err) {
      // Once the recipe exists, resume from its page instead of uploading a duplicate.
      if (createdId) router.push(`/recipes/${createdId}?resume=1`);
      else setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  if (progress) {
    return <ProgressPanel progress={progress} error={error} onRetry={() => setProgress(null)} />;
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-2 gap-2" aria-label="Choose how to add your video">
        <button type="button" aria-pressed={captureMode === "upload"} className={captureMode === "upload" ? "btn-primary" : "btn-secondary"} onClick={() => { setCaptureMode("upload"); if (captureMode !== "upload") setFile(null); }}>Upload a video</button>
        <button type="button" aria-pressed={captureMode === "record"} className={captureMode === "record" ? "btn-primary" : "btn-secondary"} onClick={() => { setCaptureMode("record"); if (captureMode !== "record") setFile(null); }}>Use my camera</button>
      </div>
      <div>
        <label htmlFor={ids.video} className="label">
          Video
        </label>
        <input
          id={ids.video}
          type="file"
          accept="video/mp4,video/quicktime,video/*"
          capture={captureMode === "record" ? "environment" : undefined}
          key={captureMode}
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="field py-3 file:mr-4 file:rounded-full file:border-0 file:bg-barro file:px-4 file:py-2 file:text-manta"
        />
      </div>
      <div>
        <label htmlFor={ids.title} className="label">
          Recipe name
        </label>
        <input id={ids.title} className="field" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tortillas de harina" />
      </div>
      <div>
        <label htmlFor={ids.cook} className="label">
          Who is cooking?
        </label>
        <input id={ids.cook} className="field" required maxLength={60} value={cookName} onChange={(e) => setCookName(e.target.value)} placeholder="Abuela Rosa" />
      </div>
      <div className="flex items-start gap-3">
        <input id={ids.consent} type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-6 accent-barro" />
        <label htmlFor={ids.consent}>
          Everyone in this video agreed to be recorded and to have it processed by AI to create this recipe.
        </label>
      </div>
      <button type="submit" className="btn-primary w-full" disabled={!file || !consent || busy}>
        Create the recipe
      </button>
      <p className="meta">Keep this page open while the files upload. Once saved, your draft processes on the server and you can leave the page. You can answer its questions yourself or invite your family.</p>
    </form>
  );
}
