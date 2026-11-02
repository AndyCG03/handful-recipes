import { NextRequest } from "next/server";
import { z } from "zod";
import { toOwner } from "@/lib/domain";
import { isJobActive } from "@/lib/processing";
import { errorResponse, json } from "@/lib/server/http";
import { answerGap, answerGapText } from "@/lib/server/pipeline";
import { getRecipe, isOwner, saveRecipe, withRecipeLock } from "@/lib/server/recipes";

export const maxDuration = 120;
const Body = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("text"), gapId: z.string(), text: z.string().trim().min(1).max(2000) }),
  z.object({ mode: z.literal("voice"), gapId: z.string(), audioUrl: z.string().min(1) }),
]);

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const id = (await ctx.params).id;
    const body = Body.parse(await req.json());
    return await withRecipeLock(id, async () => {
    const recipe = await getRecipe(id);
    if (!recipe) return json({ error: "Not found" }, 404);
    if (!await isOwner(recipe)) return json({ error: "Forbidden" }, 403);
    if (isJobActive(recipe.job)) return json({ error: "Please wait until the draft finishes processing." }, 409);
    const gap = recipe.gaps.find((g) => g.id === body.gapId);
    if (!gap || gap.status === "dismissed") return json({ error: "Question not available" }, 404);
    if (body.mode === "text") await answerGapText(recipe, body.gapId, body.text);
    else await answerGap(recipe, body.gapId, body.audioUrl, "owner");
    return json({ recipe: toOwner(await saveRecipe(recipe)) });
    });
  } catch (e) {
    return errorResponse(e);
  }
}
