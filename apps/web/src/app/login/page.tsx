import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 pt-8">
      <h1 className="font-display text-4xl">Keep your family&apos;s recipes</h1>
      <p className="text-lg">Sign in to save recipes and return to them from any device.</p>
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
