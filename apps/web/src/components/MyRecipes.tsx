"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listOwned, type OwnedRecipe } from "@/lib/client/owner";

export function MyRecipes() {
  const [items, setItems] = useState<OwnedRecipe[] | null>(null);
  useEffect(() => setItems(listOwned()), []);
  if (!items?.length) return null;
  return (
    <section aria-labelledby="mine" className="space-y-3">
      <h2 id="mine" className="font-display text-2xl">
        Your recipes
      </h2>
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id}>
            <Link href={`/recipes/${r.id}`} className="card flex items-center justify-between hover:border-barro">
              <span>
                <span className="block text-lg font-medium">{r.title}</span>
                <span className="meta">by {r.cookName}</span>
              </span>
              <span aria-hidden className="text-barro">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
