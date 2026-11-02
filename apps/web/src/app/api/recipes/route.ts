import { NextRequest } from "next/server";
import { CreateRecipeInput, toOwner } from "@/lib/domain";
import { errorResponse, json } from "@/lib/server/http";
import { dbCountRecipesSince } from "@/lib/server/db";
import { createRecipe } from "@/lib/server/recipes";
import { currentUser } from "@/lib/supabase/server";

/** Each recipe spends Meta credits; this keeps one account from draining them. */
const MAX_RECIPES_PER_DAY = 10;

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return json({ error: "Sign in required" }, 401);
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    if ((await dbCountRecipesSince(user.id, since)) >= MAX_RECIPES_PER_DAY) {
      return json({ error: "You've reached today's limit of 10 recipes. Please try again tomorrow." }, 429);
    }
    const input = CreateRecipeInput.parse(await req.json());
    return json({ recipe: toOwner(await createRecipe(input, user.id)) }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
