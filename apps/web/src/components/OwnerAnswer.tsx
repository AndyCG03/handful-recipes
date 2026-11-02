"use client";

import { useId, useState } from "react";
import type { Gap, OwnerRecipe } from "@/lib/domain";
import { answerOwnQuestion, uploadFile } from "@/lib/client/api";
import { toWav } from "@/lib/client/media";
import { VoiceRecorder } from "./VoiceRecorder";

export function OwnerAnswer({ recipeId, gap, disabled, onBusy, onChange }: {
  recipeId: string; gap: Gap; disabled: boolean;
  onBusy: (busy: boolean) => void; onChange: (recipe: OwnerRecipe) => void;
}) {
  const field = useId();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [text, setText] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (disabled || (mode === "text" ? !text.trim() : !blob)) return;
    setSaving(true); onBusy(true); setError(null);
    try {
      const answer = mode === "text"
        ? { mode: "text" as const, gapId: gap.id, text: text.trim() }
        : { mode: "voice" as const, gapId: gap.id, audioUrl: await uploadFile(await toWav(blob!), `owner-answers/${recipeId}/${gap.id}-${Date.now()}.wav`) };
      const result = await answerOwnQuestion(recipeId, answer);
      onChange(result.recipe);
      const updated = result.recipe.gaps.find((g) => g.id === gap.id);
      if (!updated?.answer?.resolved) setError("Your answer was saved, but this detail still needs clarification. Add a more specific answer or ask your family.");
      else { setOpen(false); setText(""); setBlob(null); }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your answer.");
    } finally {
      setSaving(false); onBusy(false);
    }
  }

  if (!open) return <button type="button" className="btn-secondary min-h-11 px-4 text-base" disabled={disabled} onClick={() => setOpen(true)}>I can answer this</button>;

  return (
    <div className="mt-3 space-y-3 rounded-2xl border border-line bg-manta p-4">
      <p className="font-medium">Add what you know</p>
      <p className="meta">Your answer stays linked to this question. Keep the original words and measures; if you are unsure, leave it for your family.</p>
      <div className="flex flex-wrap gap-2" aria-label="Answer format">
        <button type="button" aria-pressed={mode === "text"} disabled={disabled} className={mode === "text" ? "btn-primary min-h-11 px-4 text-base" : "btn-secondary min-h-11 px-4 text-base"} onClick={() => setMode("text")}>Write</button>
        <button type="button" aria-pressed={mode === "voice"} disabled={disabled} className={mode === "voice" ? "btn-primary min-h-11 px-4 text-base" : "btn-secondary min-h-11 px-4 text-base"} onClick={() => setMode("voice")}>Record voice</button>
      </div>
      {mode === "text" ? <div>
        <label className="label" htmlFor={field}>Your answer</label>
        <textarea id={field} className="field py-3" rows={3} maxLength={2000} value={text} disabled={disabled} onChange={(e) => setText(e.target.value)} placeholder="For example: I use low heat, until it starts to bubble." />
      </div> : <VoiceRecorder onRecorded={setBlob} disabled={disabled} />}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" disabled={disabled || (mode === "text" ? !text.trim() : !blob)} onClick={save}>{saving ? "Saving your answer…" : "Save my answer"}</button>
        <button type="button" className="btn-ghost" disabled={disabled} onClick={() => setOpen(false)}>Cancel</button>
      </div>
      {error && <p role="alert" className="text-base text-ciruela">{error}</p>}
    </div>
  );
}
