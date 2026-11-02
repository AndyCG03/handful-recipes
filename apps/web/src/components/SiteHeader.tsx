import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/supabase/server";

export async function SiteHeader() {
  const user = await currentUser();
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
      <Link href="/" aria-label="Handful Recipes, home" className="inline-flex items-center">
        <Image src="/brand/logo-transparent.png" alt="Handful Recipes" width={1942} height={810} priority className="brand-logo h-16 w-auto max-w-[180px] object-contain sm:max-w-[215px]" />
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-5">
        <Link href="/#how-it-works" className="hidden text-base text-laurel hover:underline sm:block">How it works</Link>
        {user ? (
          <form action="/auth/signout" method="post"><button type="submit" className="text-base text-laurel hover:underline">Sign out</button></form>
        ) : (
          <Link href="/login" className="text-base text-laurel hover:underline">Sign in</Link>
        )}
        <Link href="/new" className="btn-secondary min-h-11 px-4 text-sm sm:text-base">Save a recipe <span aria-hidden>↗</span></Link>
      </nav>
    </header>
  );
}
