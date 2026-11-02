import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* Server Components can't set cookies; middleware refreshes the session. */
        }
      },
    },
  });
}

/** The verified signed-in user (validated with Supabase, not just read from the cookie). */
export async function currentUser() {
  const { data } = await (await supabaseServer()).auth.getUser();
  return data.user;
}
