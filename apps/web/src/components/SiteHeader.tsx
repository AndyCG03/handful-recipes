import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/supabase/server";

export async function SiteHeader() {
  const user = await currentUser();
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-8">
      <Link href="/" aria-label="Handful Recipes, home" className="inline-flex min-w-0 shrink items-center">
        <Image src="/brand/logo-transparent.png" alt="Handful Recipes" width={1942} height={810} priority className="brand-logo h-12 w-auto max-w-[120px] object-contain sm:h-16 sm:max-w-[215px]" />
      </Link>
      <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1 sm:gap-5">
        <Link href="/#how-it-works" className="hidden text-base text-laurel hover:underline md:block">How it works</Link>
        {user ? (
          <form action="/auth/signout" method="post"><button type="submit" className="min-h-11 whitespace-nowrap px-2 text-sm text-laurel hover:underline sm:px-0 sm:text-base">Sign out</button></form>
        ) : (
          <Link href="/login" className="inline-flex min-h-11 items-center whitespace-nowrap px-2 text-sm text-laurel hover:underline sm:px-0 sm:text-base">Sign in</Link>
        )}
        <Link href="/new" aria-label="Save a recipe" className="btn-secondary min-h-11 whitespace-nowrap px-3 text-sm sm:px-4 sm:text-base">
          <span className="sm:hidden">Save</span><span className="hidden sm:inline">Save a recipe</span> <span aria-hidden>↗</span>
        </Link>
      </nav>
    </header>
  );
}
