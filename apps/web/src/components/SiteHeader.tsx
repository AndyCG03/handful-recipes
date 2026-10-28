import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
      <Link href="/" aria-label="Handful Recipes, home" className="inline-flex items-center">
        <picture>
          <source srcSet="/brand/logo-dark.png" media="(prefers-color-scheme: dark)" />
          <Image src="/brand/logo.png" alt="Handful Recipes" width={160} height={67} priority className="h-11 w-auto" />
        </picture>
      </Link>
      <Link href="/new" className="btn-secondary min-h-11 px-4 text-base">
        New recipe
      </Link>
    </header>
  );
}
