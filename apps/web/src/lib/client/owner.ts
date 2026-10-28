/**
 * Per-device memory of the recipes this person created (no accounts in the MVP).
 * The edit key is the only credential; it never leaves this device except in the edit header.
 */

const KEY = "handful.recipes.v1";

export type OwnedRecipe = { id: string; editKey: string; title: string; cookName: string; createdAt: string };

export function listOwned(): OwnedRecipe[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OwnedRecipe[]) : [];
  } catch {
    return [];
  }
}

export function rememberOwned(r: OwnedRecipe): void {
  try {
    const rest = listOwned().filter((x) => x.id !== r.id);
    localStorage.setItem(KEY, JSON.stringify([r, ...rest]));
  } catch {
    /* storage unavailable (private mode): the recipe still exists, only this list is lost */
  }
}

export function editKeyFor(id: string): string | null {
  return listOwned().find((r) => r.id === id)?.editKey ?? null;
}
