"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useSettingsStore } from "@/store/useSettingsStore";
import { createClient } from "@/utils/supabase/client";

interface LibraryPersona {
  id: string;
  name: string;
  relation: string;
  status: string;
  tone?: string;
  created_at: string;
  avatar_url?: string | null;
}

// ── Elegant Empty State (Stitch-designed semantic tokens) ──
function EmptyLibrary() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in-up">
      <div className="w-full max-w-sm border-2 border-dashed border-subtle rounded-3xl p-10 flex flex-col items-center bg-surface/50">
        <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center mb-6 text-rose">
          <span className="material-symbols-outlined text-4xl">auto_stories</span>
        </div>
        <h2 className="font-serif text-xl text-primary mb-3">
          Your heirloom awaits
        </h2>
        <p className="text-sm text-secondary mb-8 leading-relaxed max-w-xs">
          Every preserved voice begins with a single memory. Distill your first
          connection to bring your library to life.
        </p>
        <Link
          href="/distill"
          className="px-8 py-3.5 rounded-full font-bold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 btn-press"
        >
          Begin Your Heirloom
        </Link>
      </div>
    </div>
  );
}

// ── Distilling Card (Stitch-designed locked/pulsing state) ──
function DistillingCard({ persona }: { persona: LibraryPersona }) {
  return (
    <div
      className="bg-surface rounded-3xl p-5 flex flex-col items-center gap-3 border border-subtle/60 shadow-sm relative overflow-hidden cursor-default animate-fade-in-up"
      style={{
        animation: "distill-pulse 3s ease-in-out infinite",
      }}
    >
      <style jsx>{`
        @keyframes distill-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
      <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center text-rose">
        <span className="material-symbols-outlined text-3xl">lock</span>
      </div>
      <h3 className="font-serif text-base text-primary">Awakening...</h3>
      <p className="text-xs text-secondary/70">Weaving their voice</p>
    </div>
  );
}

export default function LibraryPage() {
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);
  const userId = useSettingsStore((s) => s.user.id);
  const [personas, setPersonas] = useState<LibraryPersona[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch personas from Supabase ─────────────────────
  const fetchPersonas = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("personas")
      .select("id, name, relation, status, tone, created_at, avatar_url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Full replacement — never append
      setPersonas(data);
    }
    setLoading(false);
  };

  // ── Hydrate on mount + when userId changes ───────────
  useEffect(() => {
    fetchPersonas();
  }, [userId]);

  // ── Poll if any persona is distilling ────────────────
  useEffect(() => {
    const hasDistilling = personas.some((p) => p.status === "distilling");
    if (!hasDistilling) return;

    const interval = setInterval(fetchPersonas, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas.filter(p => p.status === "distilling").length]);

  const readyPersonas = personas.filter((p) => p.status === "ready");
  const distillingPersonas = personas.filter((p) => p.status === "distilling");

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="bg-surface border-b border-subtle/50 shadow-sm shadow-black/5 sticky top-0 z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <Link
            href="/settings/profile"
            className="absolute left-4 w-10 h-10 rounded-full overflow-hidden border border-subtle shadow-sm btn-press"
          >
            {avatarUrl ? (
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary text-xl bg-surface">
                person
              </span>
            )}
          </Link>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            Soul Library
          </h1>
          <Link
            href="/settings"
            className="absolute right-4 text-primary hover:opacity-80 transition-all duration-200 btn-press rounded-full p-1"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 py-6 flex flex-col gap-4">
        {/* Thought of the Day — always shows */}
        <section className="rounded-2xl bg-surface border border-subtle/60 p-5 shadow-sm relative overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 pointer-events-none" />
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 opacity-80">
            Thought of the Day
          </p>
          <p className="font-serif text-lg text-primary italic leading-relaxed">
            &ldquo;The things you hide in your heart are the things that keep you
            alive.&rdquo;
          </p>
        </section>

        {/* ── Loading state ─────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-sm text-secondary animate-pulse">Gathering your memories...</p>
          </div>
        )}

        {/* ── Empty State ──────────────────────────── */}
        {!loading && personas.length === 0 && <EmptyLibrary />}

        {/* ── Distilling Personas ─────────────────── */}
        {distillingPersonas.length > 0 && (
          <section className="flex flex-col gap-4 animate-fade-in-up">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 mt-8 ml-1">
              Awakening...
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {distillingPersonas.map((p) => (
                <DistillingCard key={p.id} persona={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── Ready Personas (Your Circle) ────────── */}
        {readyPersonas.length > 0 && (
          <section className="flex flex-col gap-4 mt-4 animate-fade-in-up stagger-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 mt-8 ml-1">
              Your Circle
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {readyPersonas.map((persona, i) => (
                <Link
                  key={persona.id}
                  href={`/chat/${persona.id}`}
                  className={`bg-surface rounded-3xl p-5 flex flex-col items-center gap-2 border border-subtle/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer relative overflow-hidden group btn-press animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
                >
                  {/* Watermark icon */}
                  <span className="material-symbols-outlined text-[100px] text-sand/20 dark:text-sand/10 absolute bottom-[-20%] right-[-10%] opacity-5 scale-150 -rotate-[15deg] pointer-events-none">
                    auto_awesome
                  </span>
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-subtle/60 shadow-sm group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                    {persona.avatar_url ? (
                      <img src={persona.avatar_url} alt={persona.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif text-h2 text-primary/70">
                        {persona.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-center z-10">
                    <h3 className="font-serif text-base text-primary">
                      {persona.name}
                    </h3>
                    <p className="text-xs text-secondary/70">
                      {persona.relation}
                    </p>
                  </div>
                </Link>
              ))}

              {/* Add New */}
              <Link
                href="/distill"
                className="bg-transparent border border-dashed border-subtle rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-surface transition-all duration-200 cursor-pointer group min-h-[140px] btn-press animate-fade-in-up stagger-4"
              >
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-secondary group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <p className="text-sm text-secondary text-center">
                  Add a loved one
                </p>
              </Link>
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
