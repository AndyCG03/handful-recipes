"use client";

import { useEffect, useState } from "react";
import type { AskView } from "@/lib/domain";
import { answerQuestion, getAsk, uploadFile } from "@/lib/client/api";
import { toWav } from "@/lib/client/media";
import { VoiceRecorder, type RecorderLabels } from "@/components/VoiceRecorder";

const ES_LABELS: RecorderLabels = {
  record: "Grabar mi respuesta",
  again: "Grabar otra vez",
  stop: "Terminar",
  preview: "Tu grabación",
  micError: "No pudimos usar el micrófono. Dale permiso e intenta otra vez.",
};

/** Opened by the cook from WhatsApp. Large type, one question at a time, answer by voice. */
export function AskPage({ token }: { token: string }) {
  const [view, setView] = useState<AskView | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getAsk(token)
      .then(setView)
      .catch(() => setNotFound(true));
  }, [token]);

  if (notFound) return <p className="pt-8 text-xl">This link is not valid anymore.</p>;
  if (!view) return <p className="pt-8 meta">Loading…</p>;

  const pending = view.questions.filter((q) => !q.answered);

  return (
    <div className="space-y-6 pt-4 text-xl">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">Hola, {view.cookName}</h1>
        <p>
          Están guardando tu receta de <strong>{view.title}</strong>. Faltan unos detallitos que solo tú sabes. Contesta con tu voz,
          como si platicaras.
        </p>
      </header>

      {pending.length === 0 ? (
        <p className="card text-2xl">¡Gracias! Ya quedó todo. ❤️</p>
      ) : (
        <ol className="space-y-5">
          {pending.map((q, i) => (
            <QuestionCard key={q.id} index={i + 1} question={q} token={token} onAnswered={setView} />
          ))}
        </ol>
      )}
    </div>
  );
}

function QuestionCard({
  index,
  question,
  token,
  onAnswered,
}: {
  index: number;
  question: AskView["questions"][number];
  token: string;
  onAnswered: (v: AskView) => void;
}) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!blob) return;
    setSending(true);
    setError(null);
    try {
      const wav = await toWav(blob);
      const url = await uploadFile(wav, `answers/${token}/${question.id}-${Date.now()}.wav`);
      onAnswered(await answerQuestion(token, question.id, url));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar. Intenta otra vez.");
      setSending(false);
    }
  }

  return (
    <li className="card space-y-4">
      {question.stepAction && <p className="meta">Paso: {question.stepAction}</p>}
      <p className="font-display text-2xl">
        {index}. {question.question}
      </p>
      <VoiceRecorder onRecorded={setBlob} disabled={sending} labels={ES_LABELS} />
      {blob && (
        <button type="button" className="btn-primary w-full" onClick={send} disabled={sending}>
          {sending ? "Enviando…" : "Enviar respuesta"}
        </button>
      )}
      {error && (
        <p role="alert" className="text-barro">
          {error}
        </p>
      )}
    </li>
  );
}
