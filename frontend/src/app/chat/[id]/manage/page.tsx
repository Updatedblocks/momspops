"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import UnsavedModal from "@/components/UnsavedModal";

export default function PersonaManagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);

  // ── Atomic selectors ──
  const personas = useSettingsStore((s) => s.personas);
  const updatePersona = useSettingsStore((s) => s.updatePersona);
  const persona = personas.find((p) => p.id === params.id) ?? personas[0];

  const [name, setName] = useState(persona.name);
  const [relation, setRelation] = useState(persona.relation);
  const [tone, setTone] = useState(persona.tone);

  useEffect(() => {
    setName(persona.name); setRelation(persona.relation); setTone(persona.tone);
  }, [persona.id]);

  useEffect(() => setMounted(true), []);

  const isDirty = name !== persona.name || relation !== persona.relation || tone !== persona.tone;

  const handleSave = () => {
    updatePersona(persona.id, { name, relation, tone });
    router.back();
  };
  const handleBack = () => { if (isDirty) setShowUnsaved(true); else router.back(); };
  const handleDiscard = () => {
    setName(persona.name); setRelation(persona.relation); setTone(persona.tone);
    setShowUnsaved(false); router.back();
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col selection:bg-rose/10">
      <header className="bg-header sticky top-0 border-b border-subtle shadow-sm z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button aria-label="Go back" onClick={handleBack}
            className="absolute left-4 hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-full transition-all duration-300 flex items-center justify-center opacity-80 btn-press">
            <span className="material-symbols-outlined text-rose">arrow_back</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">Managing {persona.name}&apos;s Soul</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-6 flex flex-col gap-6 pb-32 animate-fade-in-up">
        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle hover:shadow-md transition-all duration-300">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="persona-name">Persona Name</label>
            <input className="w-full bg-transparent border-0 border-b border-subtle dark:border-stone-600 px-0 py-2 font-serif text-xl text-primary focus:ring-0 focus:border-rose transition-colors duration-300"
              id="persona-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </section>

        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle flex flex-row items-center justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center shadow-sm border border-subtle">
              <span className="material-symbols-outlined text-rose text-xl">mic</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-primary">Voice Notes</h3>
                <span className="bg-muted/30 dark:bg-muted/20 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">Tier 2</span>
              </div>
            </div>
          </div>
          <button aria-checked="false"
            className="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 dark:bg-stone-700 transition-colors duration-200"
            role="switch" type="button">
            <span className="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-surface shadow ring-0 transition duration-200 translate-x-0" />
          </button>
        </section>

        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle flex flex-col gap-6">
          <header className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose" style={{ fontVariationSettings: "'FILL' 1" }}>shelves</span>
            <h2 className="text-lg font-serif text-primary">Memory Vault</h2>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-subtle/50 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors duration-300">
              <span className="text-4xl font-serif text-rose mb-1">142</span>
              <span className="text-xs text-secondary">text memories</span>
            </div>
            <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-subtle/50 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors duration-300">
              <span className="text-4xl font-serif text-rose mb-1">12</span>
              <span className="text-xs text-secondary">voice recordings</span>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col items-center gap-4">
          <button className="w-full max-w-sm py-4 px-6 rounded-full border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:ring-4 focus:ring-red-500/10 transition-all duration-300 flex items-center justify-center gap-2 group btn-press">
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-300">delete</span>
            <span className="font-medium text-sm">Archive &amp; Delete Persona</span>
          </button>
          <p className="text-xs text-secondary text-center max-w-sm opacity-80 leading-relaxed">
            All associated memory data will be permanently wiped from the servers.
          </p>
        </section>

        <button onClick={handleSave}
          className="w-full py-3 rounded-full font-bold transition-all bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 btn-press">
          Save
        </button>
      </main>

      <UnsavedModal isOpen={showUnsaved} onSave={() => { setShowUnsaved(false); handleSave(); }} onDiscard={handleDiscard} />
    </div>
  );
}