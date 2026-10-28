import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["600"], variable: "--font-fraunces", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Handful Recipes", template: "%s · Handful Recipes" },
  description: "Some recipes were never written. Record a family recipe; keep every step, every handful and every answer.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Handful", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCF7EF" },
    { media: "(prefers-color-scheme: dark)", color: "#211C19" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl px-4 pb-16">{children}</main>
      </body>
    </html>
  );
}
