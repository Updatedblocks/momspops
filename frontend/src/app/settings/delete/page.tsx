"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteMemoriesPage() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="flex-1 flex flex-col selection:bg-primary-container selection:text-primary">
      <header className="bg-header dark:bg-surface-dim border-b border-subtle shadow-[0_2px_10px_-3px_rgba(196,154,154,0.1)] sticky top-0 z-40">
        <div className="relative flex items-center justify-center w-full px-6 h-16">
          <button aria-label="Go back" onClick={() => router.back()}
            className="absolute left-4 text-secondary hover:bg-header dark:hover:bg-surface transition-colors duration-300 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">Erase Memories</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-2xl mx-auto">
        <div className="w-full max-w-md flex flex-col items-center text-center gap-4 animate-fade-in-up">
          <div className="text-secondary dark:text-secondary mb-2">
            <span className="material-symbols-outlined text-5xl font-light">warning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-primary tracking-tight mb-1">Irreversible Action</h2>
          <p className="text-sm text-secondary dark:text-secondary max-w-sm text-balance leading-relaxed">
            Deleting this data will permanently erase all distilled personas, chat logs, and audio notes from our secure vaults. This cannot be undone.
          </p>
          <div className="w-full mt-4 space-y-4">
            <input autoComplete="off"
              className="w-full bg-transparent border border-subtle dark:border-subtle/30 rounded px-4 py-3 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-all duration-300 placeholder:text-secondary dark:placeholder:text-secondary dark:text-primary"
              placeholder='Type "ERASE" to confirm' type="text"
              value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
            <button disabled={confirmText !== "ERASE"}
              className="w-full bg-error text-white text-sm font-medium py-3 px-6 rounded-full hover:bg-red-700 active:opacity-70 transition-all duration-300 shadow-[0_4px_14px_0_rgba(186,26,26,0.15)] disabled:opacity-40 disabled:cursor-not-allowed">
              Permanently Erase
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}