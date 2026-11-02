import { after, NextRequest } from "next/server";
import { toOwner } from "@/lib/domain";
import { isJobActive } from "@/lib/processing";
import { prepareBackgroundJob, runBackgroundJob } from "@/lib/server/background";
import { errorResponse, json } from "@/lib/server/http";
import { getRecipe, isOwner } from "@/lib/server/recipes";

export const maxDuration = 300;
export const runtime = "nodejs";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const recipe = await getRecipe((await ctx.params).id);
    if (!recipe) return json({ error: "Not found" }, 404);
    if (!await isOwner(recipe)) return json({ error: "Forbidden" }, 403);
    if (recipe.status === "ready" || isJobActive(recipe.job)) return json({ recipe: toOwner(recipe) });
    const queued = await prepareBackgroundJob(recipe);
    if (queued.job) {
      const jobId = queued.job.id;
      after(() => runBackgroundJob(queued.id, jobId));
    }
    return json({ recipe: toOwner(queued) }, 202);
  } catch (e) {
    return errorResponse(e);
  }
}
