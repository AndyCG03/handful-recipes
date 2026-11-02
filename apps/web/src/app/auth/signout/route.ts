import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  await (await supabaseServer()).auth.signOut();
  return NextResponse.redirect(new URL("/?signedout=1", req.url), 303);
}
