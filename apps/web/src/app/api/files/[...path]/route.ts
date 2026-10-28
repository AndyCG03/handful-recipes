import { NextRequest } from "next/server";
import { readLocalFile, storageDriver, writeLocalFile } from "@/lib/server/storage";

/** Local development storage only. In production files live in Vercel Blob. */

const TYPES: Record<string, string> = {
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  wav: "audio/wav",
  jpg: "image/jpeg",
  json: "application/json",
};

const MAX_UPLOAD = 300 * 1024 * 1024;

function localOnly() {
  return storageDriver() !== "local" ? new Response("Not found", { status: 404 }) : null;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const blocked = localOnly();
  if (blocked) return blocked;
  const pathname = (await ctx.params).path.join("/");
  let data: Buffer;
  try {
    data = await readLocalFile(pathname);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const type = TYPES[pathname.split(".").pop()?.toLowerCase() ?? ""] ?? "application/octet-stream";
  const range = req.headers.get("range");
  const m = range?.match(/bytes=(\d*)-(\d*)/);
  if (m) {
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Math.min(Number(m[2]), data.length - 1) : data.length - 1;
    return new Response(new Uint8Array(data.subarray(start, end + 1)), {
      status: 206,
      headers: {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${data.length}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(end - start + 1),
      },
    });
  }
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Length": String(data.length) },
  });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const blocked = localOnly();
  if (blocked) return blocked;
  const pathname = (await ctx.params).path.join("/");
  if (!pathname.startsWith("uploads/")) return new Response("Forbidden", { status: 403 });
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length > MAX_UPLOAD) return new Response("Too large", { status: 413 });
  await writeLocalFile(pathname, buf);
  return Response.json({ url: `/api/files/${pathname}` });
}
