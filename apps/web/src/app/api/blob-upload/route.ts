import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest } from "next/server";
import { errorResponse, json } from "@/lib/server/http";

/** Issues short-lived tokens so the browser uploads straight to Vercel Blob (bypasses the 4.5 MB body limit). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("uploads/")) throw new Error("Invalid upload path");
        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm", "audio/wav", "image/jpeg"],
          maximumSizeInBytes: 300 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
