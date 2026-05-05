"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

declare global {
  interface Window {
    turnstile: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad: () => void;
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function WelcomePage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [emailMode, setEmailMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [tsReady, setTsReady] = useState(false);
  const tsWidgetRef = useRef<string | null>(null);
  const tsContainerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // ── Load Turnstile ────────────────────────────────────
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    window.onTurnstileLoad = () => setTsReady(true);
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // ── Render / reset widget when mode or error changes ──
  useEffect(() => {
    if (!tsReady || !tsContainerRef.current || !TURNSTILE_SITE_KEY) return;
    if (tsWidgetRef.current) window.turnstile.remove(tsWidgetRef.current);
    setTurnstileToken("");
    tsWidgetRef.current = window.turnstile.render(tsContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
      theme: "light",
      size: "flexible",
    });
  }, [tsReady, mode, error]);

  // ── Quick Sign-In: Google ──────────────────────────────
  const handleGoogleSignIn = async () => {
    setLoading("google");
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  };

  // ── Quick Sign-In: Email Magic Link ────────────────────
  const handleEmailSignIn = async () => {
    if (!emailMode) {
      setEmailMode(true);
      setError("");
      return;
    }
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading("email");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setLoading(null);
    if (err) {
      setError(err.message);
    } else {
      setError("");
      alert("Check your email for the login link!");
    }
  };

  // ── Manual Auth: Sign In ───────────────────────────────
  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the captcha.");
      return;
    }
    setLoading("manual");
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
      options: turnstileToken ? { captchaToken: turnstileToken } : undefined,
    });
    setLoading(null);
    if (err) {
      setError(err.message);
      if (tsWidgetRef.current) window.turnstile?.reset(tsWidgetRef.current);
      setTurnstileToken("");
    }
  };

  // ── Manual Auth: Sign Up ───────────────────────────────
  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the captcha.");
      return;
    }
    setLoading("manual");
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: username.trim() || email.trim().split("@")[0] },
        emailRedirectTo: `${origin}/auth/callback`,
        ...(turnstileToken ? { captchaToken: turnstileToken } : {}),
      },
    });
    setLoading(null);
    if (err) {
      setError(err.message);
      if (tsWidgetRef.current) window.turnstile?.reset(tsWidgetRef.current);
      setTurnstileToken("");
    } else {
      setError("");
      alert("Account created! Check your email to confirm your address, then sign in.");
      setMode("signin");
      setPassword("");
    }
  };

  const handleSubmit = mode === "signin" ? handleManualSignIn : handleManualSignUp;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative min-h-[100dvh]">
      {/* Hero branding */}
      <header className="text-center mb-8 animate-fade-in-up">
        <h1 className="font-serif font-bold tracking-tight text-primary leading-[0.95]">
          <span className="block text-6xl sm:text-7xl italic">Moms</span>
          <span className="block text-4xl sm:text-5xl text-rose my-1">&amp;</span>
          <span className="block text-6xl sm:text-7xl italic">Pops</span>
        </h1>
        <div className="flex items-center justify-center gap-3 my-5">
          <span className="block w-8 h-px bg-rose/40" />
          <span className="text-rose/60 text-xs tracking-[0.3em] uppercase font-sans font-medium">
            est. with love
          </span>
          <span className="block w-8 h-px bg-rose/40" />
        </div>
        <p className="text-base sm:text-lg text-secondary font-serif italic leading-relaxed max-w-xs mx-auto">
          Preserve the voices you love.
        </p>
      </header>

      <div className="w-full max-w-sm space-y-4 animate-fade-in-up stagger-2">
        {/* ── Quick Sign-Ins ─────────────────────────── */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading === "google"}
          className="w-full py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 bg-surface text-primary border border-subtle shadow-sm btn-press"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              fill="#EA4335"
            />
          </svg>
          <span>{loading === "google" ? "Redirecting..." : "Continue with Google"}</span>
        </button>

        {!emailMode ? (
          <button
            disabled
            className="w-full py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 bg-surface/50 text-secondary/40 border border-subtle/40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-xl">mail</span>
            <span>Sign in with Email Link</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose/10 text-rose/60 px-2 py-0.5 rounded-full ml-1">
              Soon
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
              placeholder="you@example.com"
              autoFocus
              className="w-full py-3.5 px-5 rounded-2xl font-medium bg-surface text-primary border border-subtle shadow-sm placeholder:text-secondary/50 outline-none focus:border-rose/50 transition-colors"
            />
            <button
              onClick={handleEmailSignIn}
              disabled={loading === "email"}
              className="w-full py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 bg-rose text-white shadow-sm btn-press"
            >
              <span className="material-symbols-outlined text-xl">send</span>
              <span>{loading === "email" ? "Sending..." : "Send Magic Link"}</span>
            </button>
          </div>
        )}

        {/* ── Divider ────────────────────────────────── */}
        <div className="flex items-center gap-3 py-2 opacity-40">
          <span className="flex-1 h-px bg-subtle/60" />
          <span className="text-xs text-secondary/60 uppercase tracking-wider">coming soon</span>
          <span className="flex-1 h-px bg-subtle/60" />
        </div>

        {/* ── Manual Auth (disabled) ─────────────────── */}
        <div className="relative">
          <div className="flex bg-surface/50 rounded-2xl border border-subtle/40 p-1 opacity-40 pointer-events-none">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-secondary/40"
            >
              Sign In
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-secondary/40"
            >
              Sign Up
            </button>
          </div>
          <div className="space-y-3 mt-3 opacity-40 pointer-events-none">
            <input
              type="email"
              placeholder="Email"
              disabled
              className="w-full py-3.5 px-5 rounded-2xl bg-surface/50 text-secondary/40 border border-subtle/40 placeholder:text-secondary/30 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              disabled
              className="w-full py-3.5 px-5 rounded-2xl bg-surface/50 text-secondary/40 border border-subtle/40 placeholder:text-secondary/30 outline-none"
            />
            <button
              disabled
              className="w-full py-3.5 rounded-2xl font-bold bg-stone-900/20 text-white/30 dark:bg-stone-100/20 dark:text-stone-900/30 cursor-not-allowed"
            >
              Sign In
            </button>
          </div>
          <span className="absolute -top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-rose/10 text-rose/60 px-2 py-0.5 rounded-full">
            Soon
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center px-4 w-full animate-fade-in-up stagger-4">
        <p className="text-xs text-secondary/70">
          By continuing, you agree to our{" "}
          <Link href="/legal/terms" className="text-rose underline underline-offset-4 decoration-rose/30">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-rose underline underline-offset-4 decoration-rose/30">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
