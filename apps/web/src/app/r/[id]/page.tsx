import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toPublic } from "@/lib/domain";
import { getRecipe } from "@/lib/server/recipes";
import { RecipeView } from "@/components/RecipeView";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getRecipe((await params).id);
  return r ? { title: `${r.title} by ${r.cookName}`, robots: { index: false } } : { title: "Recipe" };
}

/** The family link: read-only living recipe. */
export default async function SharedRecipePage({ params }: Props) {
  const recipe = await getRecipe((await params).id);
  if (!recipe || recipe.status !== "ready") notFound();
  const pub = toPublic(recipe);
  return (
    <div className="space-y-6 pt-4">
      <header className="space-y-1">
        <h1 className="font-display text-4xl">{pub.title}</h1>
        <p className="meta">The way {pub.cookName} makes it. Tap a step to watch it.</p>
      </header>
      <RecipeView recipe={pub} />
    </div>
  );
}
