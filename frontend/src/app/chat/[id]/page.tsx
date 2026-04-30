"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import Paywall from "@/components/Paywall";
import { createClient } from "@/utils/supabase/client";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  replyTo?: { id: string; content: string; role: string };
};

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

  // ── Hydrate chat history from DB on mount ──────────────
  useEffect(() => {
    async function loadHistory() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("chat_logs")
        .select("role, content, created_at")
        .eq("persona_id", personaId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(
          data.map((msg, i) => ({
            id: `hist-${i}-${Date.now()}`,
            role: msg.role === "assistant" ? "model" : (msg.role as "user" | "model"),
            content: msg.content,
          })),
        );
      }
    }
    if (personaId) loadHistory();
  }, [personaId]);

  // ── Native chat state (zero SDK dependency) ────────────
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll to latest message ──────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Native streaming submit ────────────────────────────
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input,
      ...(replyingTo && {
        replyTo: {
          id: replyingTo.id,
          content: replyingTo.content.slice(0, 120),
          role: replyingTo.role,
        },
      }),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setReplyingTo(null);
    setIsLoading(true);
    setError("");

    // Placeholder for streaming model response
    const modelMsgId = `m-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: modelMsgId, role: "model", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ id, role, content, replyTo }) => ({
            role,
            content: replyTo
              ? `[Replying to: "${replyTo.content}"] ${content}`
              : content,
          })),
          personaId,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Chat API returned ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const text = JSON.parse(line.slice(2));
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsgId
                    ? { ...m, content: m.content + text }
                    : m,
                ),
              );
            } catch {
              // skip malformed
            }
          }
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
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

          <Link href={`/chat/${personaId}/manage`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 border border-subtle/60">
              <span className="font-serif text-sm text-primary/70">
                {displayName.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
              {displayName}&apos;s Legacy
            </h1>
          </Link>

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

        {messages.map((msg) => {
          const isLast = msg.id === messages[messages.length - 1]?.id;
          const isStreaming = msg.role === "model" && msg.content === "" && isLoading && isLast;
          return (
          <div
            key={msg.id}
            className={`flex w-full animate-fade-in-up group ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Reply icon — hover reveal */}
            {msg.role === "user" && (
              <span
                onClick={() => setReplyingTo(msg)}
                className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm self-end mb-1 text-white dark:text-stone-900 bg-stone-900/90 dark:bg-[#FDFBF7]/90 rounded-full p-1 shadow-sm"
              >
                reply
              </span>
            )}

            {/* Persona avatar */}
            {msg.role !== "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1 mr-3 self-start border border-subtle/60">
                <span className="font-serif text-sm text-primary/70">
                  {displayName.charAt(0)}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                msg.role === "user"
                  ? "bg-stone-900 text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1A1A1A] rounded-tr-sm ml-auto"
                  : "bg-surface border border-subtle text-primary rounded-tl-sm mr-auto"
              }`}
            >
              {msg.role !== "user" && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-serif text-primary/70">
                    {displayName}
                  </span>
                </div>
              )}

              {/* Reply quote */}
              {msg.replyTo && (
                <div className={`mb-2 px-2 py-1.5 rounded-lg text-[11px] leading-snug border-l-2 ${
                  msg.role === "user"
                    ? "bg-white/10 border-white/30 text-white/70"
                    : "bg-stone-50 dark:bg-stone-800/50 border-rose/40 text-secondary"
                }`}>
                  <p className="opacity-70 truncate">
                    {msg.replyTo.role === "user" ? "You" : displayName}: {msg.replyTo.content}
                  </p>
                </div>
              )}

              {/* Content or typing dots */}
              {isStreaming ? (
                <div className="flex gap-1.5 items-center h-5 px-1 opacity-70">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce-delay"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce-delay delay-100"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce-delay delay-200"></div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}

              {/* Timestamp + read receipt */}
              {!isStreaming && (
                <div className="flex items-center justify-end gap-1 mt-1 opacity-60 text-[10px] tracking-wide">
                  <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.role === "user" && (
                    <span className="material-symbols-outlined text-[14px]">done_all</span>
                  )}
                </div>
              )}
            </div>

            {/* Reply icon — hover reveal (persona side) */}
            {msg.role !== "user" && (
              <span
                onClick={() => setReplyingTo(msg)}
                className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm self-end mb-1 ml-1 text-white dark:text-stone-900 bg-stone-900/90 dark:bg-[#FDFBF7]/90 rounded-full p-1 shadow-sm"
              >
                reply
              </span>
            )}
          </div>
        )})}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <form
        onSubmit={onSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-surface border-t border-subtle z-40 pb-[72px] md:pb-safe"
      >
        {/* Reply preview bar */}
        {replyingTo && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-rose/5 border-b border-rose/10 animate-slide-down">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose/70 mb-0.5">
                Replying to {replyingTo.role === "user" ? "yourself" : displayName}
              </p>
              <p className="text-xs text-secondary truncate">
                {replyingTo.content.slice(0, 80)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-secondary/60 hover:text-rose transition-colors p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}
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
