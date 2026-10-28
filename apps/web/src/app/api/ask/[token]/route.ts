import { NextRequest } from "next/server";
import { z } from "zod";
import type { AskView, Recipe } from "@/lib/domain";
import { errorResponse, json } from "@/lib/server/http";
import { answerGap } from "@/lib/server/pipeline";
import { getRecipeByAskToken, saveRecipe } from "@/lib/server/recipes";

export const maxDuration = 120;

type Ctx = { params: Promise<{ token: string }> };

function view(r: Recipe): AskView {
  return {
    title: r.title,
    cookName: r.cookName,
    questions: r.gaps
      .filter((g) => g.status === "sent" || g.status === "answered")
      .map((g) => ({
        id: g.id,
        question: g.question,
        status: g.status,
        answered: g.status === "answered",
        stepAction: r.steps.find((s) => s.id === g.stepId)?.action ?? null,
      })),
  };
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const recipe = await getRecipeByAskToken((await ctx.params).token);
  if (!recipe) return json({ error: "Not found" }, 404);
  return json(view(recipe));
}

const Body = z.object({ gapId: z.string(), audioUrl: z.string().min(1) });

/** The cook answers one question with a voice note (already uploaded as WAV). */
export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const recipe = await getRecipeByAskToken((await ctx.params).token);
    if (!recipe) return json({ error: "Not found" }, 404);
    const { gapId, audioUrl } = Body.parse(await req.json());
    const gap = recipe.gaps.find((g) => g.id === gapId);
    if (!gap || (gap.status !== "sent" && gap.status !== "answered")) return json({ error: "Question not available" }, 404);
    await answerGap(recipe, gapId, audioUrl);
    return json(view(await saveRecipe(recipe)));
  } catch (e) {
    return errorResponse(e);
  }
}
