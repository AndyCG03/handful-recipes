import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest } from "next/server";
import { errorResponse, json } from "@/lib/server/http";
import { getRecipeByAskToken } from "@/lib/server/recipes";
import { currentUser } from "@/lib/supabase/server";

/**
 * Issues short-lived upload tokens. Signed-in users can upload recipe media; a cook without an
 * account can only upload a voice answer, and only with a valid ask token.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("uploads/")) throw new Error("Invalid upload path");
        if (await currentUser()) {
          return {
            allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm", "audio/wav", "image/jpeg"],
            maximumSizeInBytes: 300 * 1024 * 1024,
            addRandomSuffix: true,
          };
        }
        if (clientPayload && pathname.startsWith("uploads/answers/") && (await getRecipeByAskToken(clientPayload))) {
          return { allowedContentTypes: ["audio/wav"], maximumSizeInBytes: 32 * 1024 * 1024, addRandomSuffix: true };
        }
        throw new Error("Sign in to upload files");
      },
      onUploadCompleted: async () => {},
    });
    return json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
