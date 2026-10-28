import { NextRequest } from "next/server";
import { CreateRecipeInput, toOwner } from "@/lib/domain";
import { errorResponse, json } from "@/lib/server/http";
import { createRecipe } from "@/lib/server/recipes";

export async function POST(req: NextRequest) {
  try {
    const input = CreateRecipeInput.parse(await req.json());
    const { recipe, editKey } = await createRecipe(input);
    return json({ recipe: toOwner(recipe), editKey }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
