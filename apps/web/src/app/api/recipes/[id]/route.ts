import { NextRequest } from "next/server";
import { z } from "zod";
import { GapStatus, toOwner, toPublic } from "@/lib/domain";
import { EDIT_KEY_HEADER, errorResponse, json } from "@/lib/server/http";
import { getRecipe, isOwner, saveRecipe } from "@/lib/server/recipes";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const recipe = await getRecipe((await ctx.params).id);
  if (!recipe) return json({ error: "Not found" }, 404);
  const owner = isOwner(recipe, req.headers.get(EDIT_KEY_HEADER));
  return json({ recipe: owner ? toOwner(recipe) : toPublic(recipe), owner });
}

const Patch = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  steps: z.array(z.object({ id: z.string(), action: z.string().trim().min(1).max(300) })).optional(),
  gaps: z
    .array(z.object({ id: z.string(), status: GapStatus.exclude(["answered"]), question: z.string().trim().min(1).max(300).optional() }))
    .optional(),
});

/** Owner edits: rename, fix step text, choose which questions to send or dismiss. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const recipe = await getRecipe((await ctx.params).id);
    if (!recipe) return json({ error: "Not found" }, 404);
    if (!isOwner(recipe, req.headers.get(EDIT_KEY_HEADER))) return json({ error: "Forbidden" }, 403);
    const patch = Patch.parse(await req.json());
    if (patch.title) recipe.title = patch.title;
    for (const s of patch.steps ?? []) {
      const step = recipe.steps.find((x) => x.id === s.id);
      if (step) step.action = s.action;
    }
    for (const g of patch.gaps ?? []) {
      const gap = recipe.gaps.find((x) => x.id === g.id);
      if (!gap || gap.status === "answered") continue;
      gap.status = g.status;
      if (g.question) gap.question = g.question;
    }
    return json({ recipe: toOwner(await saveRecipe(recipe)) });
  } catch (e) {
    return errorResponse(e);
  }
}
