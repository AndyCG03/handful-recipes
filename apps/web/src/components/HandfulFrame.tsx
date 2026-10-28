import type { Handful } from "@/lib/domain";

/** Shows the informal measure as it happened: the literal phrase plus the frame, with SAM's box. Never a number. */
export function HandfulFrame({ handful }: { handful: Handful }) {
  return (
    <div className="space-y-2">
      <p className="inline-flex items-center gap-2 rounded-full bg-comal/15 px-3 py-1 text-base font-medium text-comal">
        <span aria-hidden>✋</span> “{handful.phrase}”
      </p>
      {handful.frameUrl && (
        <div className="relative mx-auto w-fit overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element -- user media from storage */}
          <img src={handful.frameUrl} alt={`The moment of “${handful.phrase}”`} className="block max-h-[45dvh] w-auto max-w-full" />
          {handful.boxes.map((b, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute rounded-xl border-4 border-barro shadow-[0_0_0_2px_var(--manta)]"
              style={{
                left: `${(b.x1 / b.w) * 100}%`,
                top: `${(b.y1 / b.h) * 100}%`,
                width: `${((b.x2 - b.x1) / b.w) * 100}%`,
                height: `${((b.y2 - b.y1) / b.h) * 100}%`,
              }}
            />
          ))}
        </div>
      )}
      <p className="meta">Shown as it was done. Not converted into grams or cups.</p>
    </div>
  );
}
