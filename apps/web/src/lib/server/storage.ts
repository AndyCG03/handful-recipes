import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { del, list, put } from "@vercel/blob";

/**
 * Storage abstraction.
 * - "blob": Vercel Blob (production). Requires BLOB_READ_WRITE_TOKEN.
 * - "local": files under apps/web/.data, served by /api/files/[...path] (development).
 *
 * Blob URLs are cached by the CDN, so mutable JSON is written as immutable versions
 * (`<prefix>/v-<timestamp>.json`) and read back through the uncached list API.
 */

export type StorageDriver = "blob" | "local";

export function storageDriver(): StorageDriver {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

const LOCAL_ROOT = path.join(process.cwd(), ".data");
const LOCAL_URL_PREFIX = "/api/files/";

function safeLocalPath(pathname: string): string {
  const full = path.resolve(LOCAL_ROOT, pathname);
  if (!full.startsWith(LOCAL_ROOT + path.sep)) throw new Error("Invalid path");
  return full;
}

export async function putFile(pathname: string, body: Buffer | string, contentType: string): Promise<string> {
  if (storageDriver() === "blob") {
    const res = await put(pathname, body, { access: "public", contentType, addRandomSuffix: false, allowOverwrite: true });
    return res.url;
  }
  const full = safeLocalPath(pathname);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, body);
  return LOCAL_URL_PREFIX + pathname;
}

export async function readLocalFile(pathname: string): Promise<Buffer> {
  return fs.readFile(safeLocalPath(pathname));
}

export async function writeLocalFile(pathname: string, data: Buffer): Promise<void> {
  const full = safeLocalPath(pathname);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
}

/** Read the bytes behind a URL returned by this module (or uploaded by the client). */
export async function readBytes(url: string): Promise<Buffer> {
  if (url.startsWith(LOCAL_URL_PREFIX)) {
    return readLocalFile(decodeURIComponent(url.slice(LOCAL_URL_PREFIX.length)));
  }
  const allowed = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;
  if (!allowed.test(url)) throw new Error("URL not in app storage");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Storage read failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function putJsonVersion(prefix: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data);
  const name = `${prefix}/v-${Date.now().toString().padStart(15, "0")}.json`;
  if (storageDriver() === "blob") {
    await put(name, body, { access: "public", contentType: "application/json", addRandomSuffix: true });
    await pruneVersions(prefix, 3);
    return;
  }
  // Local: a single mutable file is enough.
  await writeLocalFile(`${prefix}/latest.json`, Buffer.from(body));
}

export async function getLatestJson(prefix: string): Promise<unknown | null> {
  if (storageDriver() === "blob") {
    const { blobs } = await list({ prefix: `${prefix}/v-` });
    if (blobs.length === 0) return null;
    const latest = blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b));
    const res = await fetch(latest.url, { cache: "no-store" });
    return res.ok ? res.json() : null;
  }
  try {
    return JSON.parse((await readLocalFile(`${prefix}/latest.json`)).toString("utf-8"));
  } catch {
    return null;
  }
}

async function pruneVersions(prefix: string, keep: number): Promise<void> {
  const { blobs } = await list({ prefix: `${prefix}/v-` });
  const old = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)).slice(keep);
  if (old.length) await del(old.map((b) => b.url));
}
