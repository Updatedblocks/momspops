"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import BottomNav from "@/components/BottomNav";
import Paywall from "@/components/Paywall";
import { createClient } from "@/utils/supabase/client";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const personaId = params.id as string;
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [personaName, setPersonaName] = useState("");
  const [personaRelation, setPersonaRelation] = useState("");
  const [error, setError] = useState("");

  // ── Fetch persona details ──────────────────────────────
  useEffect(() => {
    async function loadPersona() {
      const supabase = createClient();
      const { data } = await supabase
        .from("personas")
        .select("name, relation, status")
        .eq("id", personaId)
        .single();

      if (data) {
        setPersonaName(data.name);
        setPersonaRelation(data.relation);
      }
    }
    if (personaId) loadPersona();
  }, [personaId]);

  // ── useChat hook — streams from /api/chat ──────────────
  const { messages, append, isLoading, error: chatError } =
    useChat({
      api: "/api/chat",
      body: { personaId },
      onError: (e) => setError(e.message),
      onResponse: () => setError(""),
    });

  // ── Local input state (decoupled from useChat v4) ──────
  const [input, setInput] = useState("");

  // ── Bulletproof submit — guards against spamming ───────
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    append({ role: "user", content: input });
    setInput("");
  };

  const displayName = personaName || "Loved One";

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="bg-surface sticky top-0 z-40 shadow-sm shadow-black/5 border-b border-subtle/60">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button
            aria-label="Go back"
            onClick={() => router.back()}
            className="absolute left-4 text-rose hover:bg-header/50 transition-all duration-200 active:opacity-70 rounded-full p-2 btn-press"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 border border-subtle/60">
              <span className="font-serif text-sm text-primary/70">
                {displayName.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
              {displayName}&apos;s Legacy
            </h1>
          </div>

          <button
            onClick={() => setPaywallOpen(true)}
            className="absolute right-4 text-rose font-label-caps text-label-caps uppercase tracking-widest px-3 py-1 rounded-full border border-subtle/60 text-xs hover:bg-rose/5 active:scale-95 transition-all btn-press"
          >
            Echoes
          </button>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-6 flex flex-col gap-4 overflow-y-auto pb-40">
        {error && (
          <div className="text-center py-2">
            <span className="text-xs text-error bg-red-50 dark:bg-red-950/30 rounded-full px-4 py-1.5">
              {error}
            </span>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-secondary text-sm italic animate-fade-in">
              Send a message to begin your conversation...
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full animate-fade-in-up ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Persona avatar (left side) */}
            {msg.role !== "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1 mr-3 self-start border border-subtle/60">
                <span className="font-serif text-sm text-primary/70">
                  {displayName.charAt(0)}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                msg.role === "user"
                  ? "bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-tr-sm ml-auto"
                  : "bg-rose/10 dark:bg-rose/15 border border-rose/20 dark:border-rose/25 rounded-tl-sm mr-auto"
              }`}
            >
              {msg.role !== "user" && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-serif text-primary/80">
                    {displayName}
                  </span>
                </div>
              )}
              <p className="text-primary text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Reminiscing state — shown while AI is streaming */}
        {isLoading && (
          <div className="flex justify-start items-center w-full animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 border border-subtle/60">
              <span className="font-serif text-sm text-primary/70">
                {displayName.charAt(0)}
              </span>
            </div>
            <div className="max-w-[85%] sm:max-w-[75%] bg-surface rounded-2xl rounded-tl-sm px-4 py-3 border border-subtle/50 flex items-center gap-3">
              <div className="flex space-x-1.5 animate-pulse">
                <div className="w-1.5 h-1.5 bg-rose/40 rounded-full" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-rose/40 rounded-full" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-rose/40 rounded-full" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-sm text-secondary italic">
                {displayName} is reminiscing...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Input area */}
      <form
        onSubmit={onSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-surface border-t border-subtle z-40 pb-[72px] md:pb-safe"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-end gap-3 bg-base rounded-3xl border border-subtle p-2 shadow-[0_-2px_20px_rgba(0,0,0,0.02)] transition-shadow focus-within:shadow-[0_-2px_25px_rgba(196,154,154,0.1)] focus-within:border-rose/30">
            <button
              type="button"
              aria-label="Voice input"
              className="p-3 text-secondary hover:text-rose hover:bg-stone-100 dark:hover:bg-stone-800 border-2 border-subtle/80 transition-all duration-200 rounded-full self-end btn-press"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mic
              </span>
            </button>
            <div className="w-px h-6 bg-subtle/50 self-center" />
            <button
              type="button"
              aria-label="Attach file"
              className="p-3 text-secondary hover:text-rose hover:bg-stone-100 dark:hover:bg-stone-800 border-2 border-subtle/80 transition-all duration-200 rounded-full self-end btn-press"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="flex-grow">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-primary placeholder:text-secondary/50 disabled:opacity-40"
                placeholder={`Message ${displayName}...`}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                  }
                }}
                style={{ scrollbarWidth: "none" }}
              />
            </div>
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-full self-end shadow-sm btn-press transition-all duration-200 ${
                !input.trim() || isLoading
                  ? "bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed"
                  : "bg-rose text-white hover:bg-muted"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                send
              </span>
            </button>
          </div>
        </div>
      </form>

      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      <BottomNav />
    </div>
  );
}
