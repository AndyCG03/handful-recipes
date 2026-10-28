"use client";

import { useMemo, useState } from "react";
import type { Gap, GapKind, OwnerRecipe } from "@/lib/domain";
import { patchRecipe } from "@/lib/client/api";

const KIND_LABEL: Record<GapKind, string> = {
  heat: "Heat",
  time: "Time",
  variety: "Which one",
  doneness: "When it's ready",
  quantity: "How much",
  other: "Detail",
};

/** Questions the video left open. The owner picks which ones to send; the cook answers by voice. */
export function QuestionsPanel({ recipe, editKey, onChange }: { recipe: OwnerRecipe; editKey: string; onChange: (r: OwnerRecipe) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const askUrl = typeof window !== "undefined" ? `${window.location.origin}/ask/${recipe.askToken}` : "";

  const open = recipe.gaps.filter((g) => g.status === "open");
  const sent = recipe.gaps.filter((g) => g.status === "sent");
  const answered = recipe.gaps.filter((g) => g.status === "answered");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(open.map((g) => g.id)));
  const stepOrder = useMemo(() => new Map(recipe.steps.map((s) => [s.id, s.order])), [recipe.steps]);

  async function update(gaps: Array<{ id: string; status: "open" | "sent" | "dismissed" }>) {
    setBusy(true);
    setError(null);
    try {
      onChange((await patchRecipe(recipe.id, editKey, { gaps })).recipe);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function sendByWhatsApp() {
    const ids = [...selected].filter((id) => open.some((g) => g.id === id));
    const text = `Hola ${recipe.cookName} ❤️ Estoy guardando tu receta de ${recipe.title}. Tengo ${ids.length + sent.length} preguntitas, ¿me las contestas con un audio? ${askUrl}`;
    // Open synchronously (inside the click) so the browser doesn't block it, then persist.
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    if (ids.length) await update(ids.map((id) => ({ id, status: "sent" as const })));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(askUrl);
      setCopied(true);
    } catch {
      setError("Copy failed. Long-press the link to copy it.");
    }
  }

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <section aria-labelledby="questions" className="space-y-4">
      <h2 id="questions" className="font-display text-3xl">
        Questions for {recipe.cookName}
      </h2>
      <p className="meta">What the video didn&apos;t say. Choose what to ask; they answer with a voice note, no app needed.</p>

      {open.length > 0 && (
        <ul className="space-y-3">
          {open.map((g) => (
            <li key={g.id} className="card flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 size-6 shrink-0 accent-barro"
                checked={selected.has(g.id)}
                onChange={() => toggle(g.id)}
                aria-label={`Ask: ${g.question}`}
              />
              <GapBody gap={g} stepOrder={g.stepId ? stepOrder.get(g.stepId) : undefined} />
              <button type="button" className="btn-ghost min-h-11 px-2 text-base" disabled={busy} onClick={() => update([{ id: g.id, status: "dismissed" }])}>
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}

      {sent.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Waiting for an answer</h3>
          <ul className="space-y-3">
            {sent.map((g) => (
              <li key={g.id} className="card">
                <GapBody gap={g} stepOrder={g.stepId ? stepOrder.get(g.stepId) : undefined} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {(open.length > 0 || sent.length > 0) && (
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" disabled={busy || (selected.size === 0 && sent.length === 0)} onClick={sendByWhatsApp}>
            Send by WhatsApp
          </button>
          <button type="button" className="btn-secondary" onClick={copyLink}>
            {copied ? "Link copied" : "Copy answer link"}
          </button>
        </div>
      )}

      {answered.length > 0 && <p className="meta">{answered.length} answered — you&apos;ll find them on their steps above.</p>}
      {error && (
        <p role="alert" className="text-barro">
          {error}
        </p>
      )}
    </section>
  );
}

function GapBody({ gap, stepOrder }: { gap: Gap; stepOrder?: number }) {
  return (
    <div className="min-w-0 flex-1 space-y-1">
      <p className="inline-flex items-center gap-1 text-base font-medium text-ciruela">
        <span aria-hidden>?</span> {KIND_LABEL[gap.kind]}
        {stepOrder ? ` · step ${stepOrder}` : ""}
        {gap.status === "sent" ? " · sent" : ""}
      </p>
      <p className="text-lg">{gap.question}</p>
      <p className="meta">{gap.evidence}</p>
    </div>
  );
}
