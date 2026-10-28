import type { PipelineProgress } from "@/lib/client/pipeline";

export function ProgressPanel({ progress, error, onRetry }: { progress: PipelineProgress; error: string | null; onRetry?: () => void }) {
  const pct = Math.round((progress.done / progress.total) * 100);
  return (
    <div className="card space-y-4" aria-live="polite">
      {error ? (
        <>
          <p role="alert" className="text-lg text-barro">
            {error}
          </p>
          {onRetry && (
            <button type="button" className="btn-secondary" onClick={onRetry}>
              Try again
            </button>
          )}
        </>
      ) : (
        <>
          <p className="font-display text-2xl">{progress.label}…</p>
          <div className="h-3 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-barro transition-[width] duration-500" style={{ width: `${Math.max(pct, 4)}%` }} />
          </div>
          <p className="meta">This can take a few minutes for longer videos. Keep this page open.</p>
        </>
      )}
    </div>
  );
}
