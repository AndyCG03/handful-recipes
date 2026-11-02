import Link from "next/link";
import Image from "next/image";
import { MyRecipes } from "@/components/MyRecipes";

export default function Home() {
  return (
    <div className="landing">
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden className="inline-block size-2 rounded-full bg-laurel" /> A little of home, kept forever</p>
          <h1 id="hero-title">Some recipes<br />were never<br /><em>written.</em></h1>
          <p className="hero-description">A handful of this. A little more of that.<br className="hidden sm:block" /> Keep their way of cooking — and the voice that makes it theirs.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/new" className="btn-primary">Record a family recipe <span aria-hidden>↗</span></Link>
            <a href="#how-it-works" className="btn-ghost px-2">See how it works <span aria-hidden>↓</span></a>
          </div>
          <p className="hero-caption">A video, a conversation, a recipe to pass on.</p>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <Image src="/brand/family-kitchen.png" alt="Illustration of two generations preparing tortillas together in a home kitchen" fill sizes="(max-width: 760px) 100vw, 50vw" priority className="object-cover" />
            <span className="photo-caption">The way she showed you.</span>
          </div>
          <div className="recipe-peek" aria-label="Example of a recipe step">
            <div className="flex items-center justify-between gap-2"><span className="eyebrow">A step, with its story</span><span className="text-xs text-laurel">Example</span></div>
            <p className="mt-2 font-display text-2xl">“Un puñito de harina”</p>
            <p className="mt-1 text-sm text-laurel">Watch the gesture <span aria-hidden>↗</span> <span className="ml-2 font-medium">00:42</span></p>
            <div className="mt-3 flex gap-2 border-t border-line pt-3 text-sm text-ciruela"><span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full border border-ciruela">?</span><span>How do you know the dough is ready?</span></div>
          </div>
        </div>
      </section>

      <div className="promise-strip"><span>Every step has a source.</span><span>Every handful stays a handful.</span><span>Every answer adds to the story.</span></div>

      <section id="how-it-works" aria-labelledby="how-title" className="landing-section scroll-mt-8">
        <div className="section-heading"><div><p className="eyebrow">From their kitchen to your family</p><h2 id="how-title">Keep more than<br />the ingredients.</h2></div><p>The pauses, the little tricks, the way they know it&apos;s ready. Make room for the things a written recipe misses.</p></div>
        <ol className="how-grid">
          {[
            ["Record the moment.", "Upload a video or use your phone’s camera. Let them cook and talk, just as they always do."],
            ["Find every step.", "Review a draft with clips from the original video. A ‘puñito’ stays something you can see, not an invented number."],
            ["Fill in the little things.", "Answer questions yourself, in writing or by voice. Or share a link with your family so they can add their words."],
          ].map(([title, description], i) => <li key={title}><span className="how-number">0{i + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
        </ol>
      </section>

      <section className="memory-note" aria-labelledby="memory-title">
        <div><p className="eyebrow">A living recipe</p><h2 id="memory-title">Not just how to make it.<br /><em>How they make it.</em></h2></div>
        <div className="space-y-4"><p>Return to the exact moment in the video. Hear the original answer. Add the detail someone remembered later.</p><p className="text-base text-laurel">Your recording stays the source. You review the draft, and details that need an answer stay visible.</p><Link href="/new" className="btn-secondary">Start your first recipe <span aria-hidden>↗</span></Link></div>
      </section>

      <div className="landing-section"><MyRecipes /></div>
      <footer className="landing-footer"><span>Handful Recipes</span><span>Made with care. Rooted in Ciudad Juárez.</span><a href="/new">Save a family recipe ↗</a></footer>
    </div>
  );
}
