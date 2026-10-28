import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { MetaApiError } from "./meta";

export const EDIT_KEY_HEADER = "x-edit-key";

export function json<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export function errorResponse(e: unknown) {
  if (e instanceof ZodError) return json({ error: "Invalid input", issues: e.issues }, 400);
  if (e instanceof MetaApiError) {
    console.error(e.message);
    return json({ error: "The AI service failed. Please try again.", detail: e.message }, 502);
  }
  console.error(e);
  return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
}
