"use client";

import { useEffect, useState } from "react";

const KEY = "handful.flash";

/** Remembers a message across the redirect that follows signing in. */
export function flashAuthMessage(message: string) {
  try {
    sessionStorage.setItem(KEY, message);
  } catch {
    /* Storage blocked: the header still shows the signed-in state. */
  }
}

/** Brief confirmation after signing in or out. */
export function AuthToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let text: string | null = null;
    try {
      text = sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get("signedout") === "1") {
      text = "You're signed out.";
      url.searchParams.delete("signedout");
      window.history.replaceState(null, "", url);
    }
    if (!text) return;
    setMessage(text);
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!message) return null;
  return (
    <div role="status" className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-laurel bg-surface p-4 shadow-lg">
      <span aria-hidden className="text-laurel">✓</span>
      <span className="flex-1">{message}</span>
      <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss" className="min-h-11 min-w-11 text-laurel">×</button>
    </div>
  );
}
