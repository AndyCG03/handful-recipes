import type { Metadata } from "next";
import { NewRecipeForm } from "./NewRecipeForm";

export const metadata: Metadata = { title: "New recipe" };

export default function NewRecipePage() {
  return (
    <div className="space-y-6 pt-4">
      <h1 className="font-display text-4xl">Record a family recipe</h1>
      <p className="text-lg">
        Up to 10 minutes. Ask them to talk while they cook, and ask questions out loud. Good light helps us see each handful.
      </p>
      <NewRecipeForm />
    </div>
  );
}
