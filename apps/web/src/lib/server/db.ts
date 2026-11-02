import "server-only";

/** Minimal PostgREST access to the `recipes` table. Server-only; the secret key never reaches clients. */

const url = () => process.env.SUPABASE_URL;
const key = () => process.env.SUPABASE_SECRET_KEY;

export const databaseEnabled = () => Boolean(url() && key());

async function rest(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${url()}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: { apikey: key()!, Authorization: `Bearer ${key()}`, "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`Database request failed (${res.status})`);
  return res;
}

async function selectDoc(filter: string): Promise<unknown | null> {
  const rows = (await (await rest(`recipes?select=doc&${filter}&limit=1`)).json()) as Array<{ doc: unknown }>;
  return rows[0]?.doc ?? null;
}

export const dbGetRecipe = (id: string) => selectDoc(`id=eq.${encodeURIComponent(id)}`);
export const dbGetRecipeByToken = (token: string) => selectDoc(`ask_token=eq.${encodeURIComponent(token)}`);

export async function dbSaveRecipe(r: { id: string; ownerId: string; askToken: string; status: string; updatedAt: string }): Promise<void> {
  await rest("recipes?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: r.id, owner_id: r.ownerId, ask_token: r.askToken, status: r.status, updated_at: r.updatedAt, doc: r }),
  });
}

export type RecipeListItem = { id: string; title: string; cookName: string; status: string };

export async function dbListRecipes(ownerId: string): Promise<RecipeListItem[]> {
  const res = await rest(`recipes?select=id,status,title:doc->>title,cookName:doc->>cookName&owner_id=eq.${encodeURIComponent(ownerId)}&order=created_at.desc&limit=50`);
  return (await res.json()) as RecipeListItem[];
}

export async function dbCountRecipesSince(ownerId: string, sinceIso: string): Promise<number> {
  const res = await rest(`recipes?select=id&owner_id=eq.${encodeURIComponent(ownerId)}&created_at=gte.${encodeURIComponent(sinceIso)}`, {
    method: "HEAD",
    headers: { Prefer: "count=exact" },
  });
  return Number(res.headers.get("content-range")?.split("/")[1] ?? 0);
}
