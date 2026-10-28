import { NextRequest } from "next/server";
import { z } from "zod";
import { toOwner } from "@/lib/domain";
import { EDIT_KEY_HEADER, errorResponse, json } from "@/lib/server/http";
import { stageAnalyze, stageHandful, stageTranscribe } from "@/lib/server/pipeline";
import { getRecipe, isOwner, saveRecipe } from "@/lib/server/recipes";

export const maxDuration = 300;

const Body = z.discriminatedUnion("stage", [
  z.object({ stage: z.literal("transcribe") }),
  z.object({ stage: z.literal("analyze") }),
  z.object({
    stage: z.literal("handful"),
    frames: z.array(z.object({ stepId: z.string(), frameUrl: z.string(), frameSec: z.number() })).max(20),
  }),
]);

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const recipe = await getRecipe((await ctx.params).id);
  if (!recipe) return json({ error: "Not found" }, 404);
  if (!isOwner(recipe, req.headers.get(EDIT_KEY_HEADER))) return json({ error: "Forbidden" }, 403);

  try {
    const body = Body.parse(await req.json());
    if (body.stage === "transcribe") await stageTranscribe(recipe);
    else if (body.stage === "analyze") await stageAnalyze(recipe);
    else await stageHandful(recipe, body.frames);
    recipe.error = null;
    return json({ recipe: toOwner(await saveRecipe(recipe)) });
  } catch (e) {
    recipe.status = "failed";
    recipe.error = e instanceof Error ? e.message.slice(0, 300) : "Processing failed";
    await saveRecipe(recipe).catch(() => undefined);
    return errorResponse(e);
  }
}
