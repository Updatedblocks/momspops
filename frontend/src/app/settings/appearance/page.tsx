"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSettingsStore, type TextSize } from "@/store/useSettingsStore";
import UnsavedModal from "@/components/UnsavedModal";

const THEMES = [
  { key: "light" as const, label: "Canvas", ring: "bg-[#FDFBF7] border-stone-300" },
  { key: "dark" as const, label: "Midnight", ring: "bg-[#1A1A1A] border-stone-600" },
  { key: "system" as const, label: "System", ring: "bg-gradient-to-br from-[#FDFBF7] to-[#1A1A1A] border-stone-400" },
];
const TEXT_SIZES: { key: TextSize; label: string; cls: string }[] = [
  { key: "small", label: "Aa", cls: "text-sm" },
  { key: "base", label: "Aa", cls: "text-[1rem]" },
  { key: "large", label: "Aa", cls: "text-lg" },
];

export default function AppearancePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);

  // ── Atomic selectors ──
  const gTextSize = useSettingsStore((s) => s.textSize);
  const setTextSize = useSettingsStore((s) => s.setTextSize);

  const [localTextSize, setLocalTextSize] = useState<TextSize>(gTextSize);
  const [localTheme, setLocalTheme] = useState(theme);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setLocalTheme(theme); }, [theme]);

  const isDirty = localTextSize !== gTextSize || localTheme !== theme;

  const handleSave = () => {
    setTextSize(localTextSize);
    if (localTheme && localTheme !== theme) setTheme(localTheme);
  };
  const handleBack = () => { if (isDirty) setShowUnsaved(true); else router.back(); };
  const handleDiscard = () => {
    setLocalTextSize(gTextSize); setLocalTheme(theme);
    setShowUnsaved(false); router.back();
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-header border-b border-subtle shadow-sm sticky top-0 z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button aria-label="Go back" onClick={handleBack}
            className="absolute left-4 flex items-center justify-center p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all btn-press">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">Appearance</h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 flex flex-col gap-6 animate-fade-in-up">
        {/* App Theme */}
        <section className="bg-surface rounded-3xl p-6 border border-subtle shadow-sm">
          <h2 className="text-lg font-serif text-primary mb-4">App Theme</h2>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button key={t.key} onClick={() => setLocalTheme(t.key)}
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-colors duration-300 ${
                  localTheme === t.key ? "border-rose bg-rose/5 dark:bg-rose/10" : "border-transparent hover:bg-stone-50 dark:hover:bg-stone-800"
                }`}>
                <div className={`w-8 h-8 rounded-full border shadow-sm mb-2 ${t.ring}`} />
                <span className={`text-xs font-medium ${localTheme === t.key ? "text-primary" : "text-secondary"}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Text Size */}
        <section className="bg-surface rounded-3xl p-6 border border-subtle shadow-sm">
          <h2 className="text-lg font-serif text-primary mb-4">Text Size</h2>
          <div className="flex items-center justify-between rounded-2xl p-1 relative">
            <div className={`absolute top-1 h-[calc(100%-8px)] bg-white dark:bg-surface rounded-xl border-2 border-stone-900 dark:border-stone-300 shadow-sm transition-all duration-300 ${
              localTextSize === "small" ? "left-1 w-[calc(33.333%-4px)]" : localTextSize === "base" ? "left-[calc(33.333%+2px)] w-[calc(33.333%-4px)]" : "left-[calc(66.666%+4px)] w-[calc(33.333%-4px)]"
            }`} />
            {TEXT_SIZES.map((s) => (
              <button key={s.key} onClick={() => setLocalTextSize(s.key)}
                className={`flex-1 py-3 text-center relative z-10 transition-colors duration-200 ${
                  localTextSize === s.key
                    ? "text-black dark:text-white font-bold"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}>
                <span className={s.cls}>{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Save button */}
        <button onClick={handleSave}
          className="w-full py-3 rounded-full font-bold transition-all bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 btn-press">
          Save
        </button>
      </main>

      <UnsavedModal isOpen={showUnsaved} onSave={() => { setShowUnsaved(false); handleSave(); }} onDiscard={handleDiscard} />
    </div>
  );
}