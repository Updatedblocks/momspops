"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import UnsavedModal from "@/components/UnsavedModal";

export default function PersonaManagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const personaId = params.id;
  const [mounted, setMounted] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [origName, setOrigName] = useState("");
  const [origRelation, setOrigRelation] = useState("");

  // ── Fetch persona from Supabase ─────────────────────
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("personas")
        .select("name, relation, status")
        .eq("id", personaId)
        .single();

      if (data) {
        setName(data.name);
        setRelation(data.relation);
        setOrigName(data.name);
        setOrigRelation(data.relation);
      }
      setLoading(false);
      setMounted(true);
    }
    if (personaId) load();
  }, [personaId]);

  const isDirty = name !== origName || relation !== origRelation;

  const handleSave = async () => {
    const supabase = createClient();
    await supabase
      .from("personas")
      .update({ name, relation })
      .eq("id", personaId);

    router.back();
  };

  const handleBack = () => {
    if (isDirty) setShowUnsaved(true);
    else router.back();
  };

  const handleDiscard = () => {
    setName(origName);
    setRelation(origRelation);
    setShowUnsaved(false);
    router.back();
  };

  if (!mounted || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-secondary text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-header sticky top-0 border-b border-subtle shadow-sm z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button
            aria-label="Go back"
            onClick={handleBack}
            className="absolute left-4 hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-full transition-all duration-300 flex items-center justify-center btn-press"
          >
            <span className="material-symbols-outlined text-rose">arrow_back</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            {name || "Persona"} Settings
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-6 flex flex-col gap-6 pb-32 animate-fade-in-up">
        {/* Name */}
        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle/60">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold uppercase tracking-widest text-secondary"
              htmlFor="persona-name"
            >
              Persona Name
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-subtle px-0 py-2 font-serif text-xl text-primary focus:ring-0 focus:border-rose transition-colors duration-300"
              id="persona-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </section>

        {/* Relationship */}
        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle/60">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold uppercase tracking-widest text-secondary"
              htmlFor="persona-relation"
            >
              Relationship
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-subtle px-0 py-2 font-serif text-xl text-primary focus:ring-0 focus:border-rose transition-colors duration-300"
              id="persona-relation"
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Mother, Father, Grandfather..."
            />
          </div>
        </section>

        {/* Archive & Delete */}
        <section className="mt-8 flex flex-col items-center gap-4">
          <button className="w-full max-w-sm py-4 px-6 rounded-full border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 flex items-center justify-center gap-2 group btn-press">
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-300">
              delete
            </span>
            <span className="font-medium text-sm">Archive &amp; Delete Persona</span>
          </button>
          <p className="text-xs text-secondary text-center max-w-sm leading-relaxed">
            All associated memory data will be permanently wiped from the servers.
          </p>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-full font-bold transition-all bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 btn-press"
        >
          Save Changes
        </button>
      </main>

      <UnsavedModal
        isOpen={showUnsaved}
        onSave={() => {
          setShowUnsaved(false);
          handleSave();
        }}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
