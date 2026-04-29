"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function WelcomePage() {
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const supabase = createClient();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const handleGoogleSignIn = async () => {
    setLoading("google");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  };

  const handleAppleSignIn = () => {
    alert(
      "Apple auth requires Apple Developer account configuration, coming soon.",
    );
  };

  const handleEmailSignIn = async () => {
    if (!emailMode) {
      setEmailMode(true);
      return;
    }
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setLoading("email");
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setLoading(null);
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Check your email for the login link!");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative min-h-[100dvh]">
      {/* Hero branding */}
      <header className="text-center mb-10 animate-fade-in-up">
        <h1 className="font-serif font-bold tracking-tight text-primary leading-[0.95]">
          <span className="block text-7xl sm:text-8xl italic">Moms</span>
          <span className="block text-5xl sm:text-6xl text-rose my-1">&amp;</span>
          <span className="block text-7xl sm:text-8xl italic">Pops</span>
        </h1>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <span className="block w-8 h-px bg-rose/40" />
          <span className="text-rose/60 text-xs tracking-[0.3em] uppercase font-sans font-medium">est. with love</span>
          <span className="block w-8 h-px bg-rose/40" />
        </div>

        <p className="text-lg sm:text-xl text-secondary font-serif italic leading-relaxed max-w-xs mx-auto">
          Preserve the voices you love.
        </p>
      </header>

      {/* Auth buttons */}
      <div className="w-full max-w-sm space-y-3 animate-fade-in-up stagger-2">
        <button
          onClick={handleAppleSignIn}
          className="w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-3 bg-surface text-primary border border-subtle shadow-sm btn-press"
        >
          <span className="material-symbols-outlined text-xl">ios</span>
          <span>Continue with Apple</span>
        </button>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading === "google"}
          className="w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-3 bg-surface text-primary border border-subtle shadow-sm btn-press"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              fill="#EA4335"
            />
          </svg>
          <span>
            {loading === "google" ? "Redirecting..." : "Continue with Google"}
          </span>
        </button>

        {/* Email button — first click toggles input, second click sends */}
        {!emailMode ? (
          <button
            onClick={handleEmailSignIn}
            className="w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-3 bg-surface text-primary border border-subtle shadow-sm btn-press"
          >
            <span className="material-symbols-outlined text-xl">mail</span>
            <span>Continue with Email</span>
          </button>
        ) : (
          <div className="w-full space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
              placeholder="you@example.com"
              autoFocus
              className="w-full py-4 px-5 rounded-2xl font-medium bg-surface text-primary border border-subtle shadow-sm placeholder:text-secondary/50 outline-none focus:border-rose/50 transition-colors"
            />
            <button
              onClick={handleEmailSignIn}
              disabled={loading === "email"}
              className="w-full py-4 rounded-2xl font-medium flex items-center justify-center gap-3 bg-rose text-white shadow-sm btn-press"
            >
              <span className="material-symbols-outlined text-xl">send</span>
              <span>
                {loading === "email" ? "Sending..." : "Send Magic Link"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center px-4 w-full animate-fade-in-up stagger-4">
        <p className="text-xs text-secondary/70">
          By continuing, you agree to our{" "}
          <span className="text-rose underline underline-offset-4 decoration-rose/30 cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-rose underline underline-offset-4 decoration-rose/30 cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </footer>
    </div>
  );
}
