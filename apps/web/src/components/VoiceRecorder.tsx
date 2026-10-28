"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "recording" | "recorded";

export type RecorderLabels = { record: string; again: string; stop: string; preview: string; micError: string };

const EN: RecorderLabels = {
  record: "Record your answer",
  again: "Record again",
  stop: "Stop",
  preview: "Your recording",
  micError: "We couldn't use the microphone. Please allow it and try again.",
};

/** Records a voice note with MediaRecorder. Calls onRecorded with the raw recording (converted to WAV by the caller). */
export function VoiceRecorder({
  onRecorded,
  disabled,
  labels = EN,
}: {
  onRecorded: (blob: Blob) => void;
  disabled?: boolean;
  labels?: RecorderLabels;
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      recorder.current?.stream.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: rec.mimeType });
        setPreviewUrl(URL.createObjectURL(blob));
        setState("recorded");
        onRecorded(blob);
      };
      recorder.current = rec;
      rec.start();
      setSeconds(0);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setState("recording");
    } catch {
      setError(labels.micError);
    }
  }

  function stop() {
    if (timer.current) clearInterval(timer.current);
    recorder.current?.stop();
  }

  return (
    <div className="space-y-2">
      {state !== "recording" ? (
        <button type="button" className="btn-primary w-full" onClick={start} disabled={disabled}>
          <span aria-hidden>●</span> {state === "recorded" ? labels.again : labels.record}
        </button>
      ) : (
        <button type="button" className="btn-primary w-full" onClick={stop}>
          <span aria-hidden>■</span> {labels.stop} · {seconds}s
        </button>
      )}
      {previewUrl && state === "recorded" && <audio src={previewUrl} controls className="w-full" aria-label={labels.preview} />}
      {error && (
        <p role="alert" className="text-barro">
          {error}
        </p>
      )}
    </div>
  );
}
