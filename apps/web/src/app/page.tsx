import Link from "next/link";
import { MyRecipes } from "@/components/MyRecipes";

export default function Home() {
  return (
    <div className="space-y-12 pt-6">
      <section className="space-y-5">
        <h1 className="font-display text-5xl leading-tight text-cacao">Some recipes were never written.</h1>
        <p className="text-xl">
          Record someone you love while they cook. Handful Recipes turns the video into a living recipe: every step with its
          clip, every “un puñito” shown as it was done, and the questions nobody thought to ask.
        </p>
        <Link href="/new" className="btn-primary">
          Record a family recipe
        </Link>
      </section>

      <section aria-labelledby="how" className="space-y-4">
        <h2 id="how" className="font-display text-2xl">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["Record", "Film them cooking and chatting. No script, no measuring."],
            ["Review", "Steps, clips and handfuls appear. Nothing is invented."],
            ["Ask", "Send what's missing by WhatsApp. They answer with their voice."],
          ].map(([t, d], i) => (
            <li key={t} className="card">
              <p className="font-display text-xl text-barro">
                {i + 1}. {t}
              </p>
              <p className="meta mt-1">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <MyRecipes />
    </div>
  );
}
