"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const raw = useSearchParams().get("next") ?? "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/"; // same-site redirects only
  const ids = { email: useId(), password: useId() };
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const auth = supabaseBrowser().auth;
    const { data, error } = mode === "signin"
      ? await auth.signInWithPassword({ email, password })
      : await auth.signUp({ email, password });
    setBusy(false);
    if (error) return setMessage(error.message);
    if (!data.session) return setMessage("Check your email to confirm your account, then sign in.");
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor={ids.email} className="label">Email</label>
        <input id={ids.email} className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor={ids.password} className="label">Password</label>
        <input id={ids.password} className="field" type="password" minLength={8} required autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {message && <p role="alert" className="text-barro">{message}</p>}
      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>
      <button type="button" className="btn-ghost w-full" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(null); }}>
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
