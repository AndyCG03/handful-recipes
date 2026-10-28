import { upload } from "@vercel/blob/client";
import type { AskView, OwnerRecipe, PipelineStage, PublicRecipe } from "@/lib/domain";

/** Typed client for the app's API. */

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_DRIVER === "blob" ? "blob" : "local";
const EDIT_KEY_HEADER = "x-edit-key";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

/** Uploads a file to app storage and returns its URL. */
export async function uploadFile(file: Blob, pathname: string, onProgress?: (pct: number) => void): Promise<string> {
  const path = `uploads/${pathname}`;
  if (STORAGE === "blob") {
    const res = await upload(path, file, {
      access: "public",
      handleUploadUrl: "/api/blob-upload",
      contentType: file.type,
      multipart: file.size > 20 * 1024 * 1024,
      onUploadProgress: (e) => onProgress?.(e.percentage),
    });
    return res.url;
  }
  const res = await request<{ url: string }>(`/api/files/${path}`, { method: "PUT", body: file });
  onProgress?.(100);
  return res.url;
}

export function createRecipe(input: {
  title: string;
  cookName: string;
  videoUrl: string;
  audioUrl: string;
  durationSec: number;
  consent: true;
}) {
  return request<{ recipe: OwnerRecipe; editKey: string }>("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function getRecipe(id: string, editKey: string | null) {
  return request<{ recipe: OwnerRecipe | PublicRecipe; owner: boolean }>(`/api/recipes/${id}`, {
    headers: editKey ? { [EDIT_KEY_HEADER]: editKey } : {},
    cache: "no-store",
  });
}

export function runStage(
  id: string,
  editKey: string,
  stage: PipelineStage,
  frames?: Array<{ stepId: string; frameUrl: string; frameSec: number }>,
) {
  return request<{ recipe: OwnerRecipe }>(`/api/recipes/${id}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json", [EDIT_KEY_HEADER]: editKey },
    body: JSON.stringify(stage === "handful" ? { stage, frames: frames ?? [] } : { stage }),
  });
}

export function patchRecipe(
  id: string,
  editKey: string,
  patch: {
    title?: string;
    steps?: Array<{ id: string; action: string }>;
    gaps?: Array<{ id: string; status: "open" | "sent" | "dismissed"; question?: string }>;
  },
) {
  return request<{ recipe: OwnerRecipe }>(`/api/recipes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", [EDIT_KEY_HEADER]: editKey },
    body: JSON.stringify(patch),
  });
}

export function getAsk(token: string) {
  return request<AskView>(`/api/ask/${token}`, { cache: "no-store" });
}

export function answerQuestion(token: string, gapId: string, audioUrl: string) {
  return request<AskView>(`/api/ask/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gapId, audioUrl }),
  });
}
