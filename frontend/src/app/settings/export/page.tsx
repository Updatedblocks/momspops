"use client";

import { useRouter } from "next/navigation";

const INCLUDED_ITEMS = [
  { icon: "forum", label: "Chat Transcripts", selected: true },
  { icon: "graphic_eq", label: "Voice Notes", selected: true },
  { icon: "psychology", label: "Distilled Personas", selected: true },
];

export default function DataExportPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="bg-header sticky top-0 border-b border-subtle/40 shadow-sm shadow-black/5 z-40">
        <div className="relative flex items-center justify-center w-full px-6 h-16">
          <button
            aria-label="Go back"
            onClick={() => router.back()}
            className="absolute left-4 text-primary hover:opacity-70 transition-opacity duration-300 active:scale-95 flex items-center justify-center p-2 rounded-full"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            Your Archive
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 py-6 gap-5">
        <p className="text-sm text-secondary text-center">
          Select the contents and format for your digital heirloom export.
        </p>

        {/* Included contents */}
        <section className="bg-surface rounded-3xl p-5 border border-subtle/50 shadow-sm flex flex-col gap-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sand/5 to-transparent pointer-events-none" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 relative z-10">
            Included Contents
          </h2>
          {INCLUDED_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-3 relative z-10 cursor-pointer ${
                i < INCLUDED_ITEMS.length - 1
                  ? "border-b border-subtle/50"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary/70">
                  {item.icon}
                </span>
                <span className="text-sm text-primary">{item.label}</span>
              </div>
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          ))}
        </section>

        {/* Export Format */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">
            Export Format
          </h2>
          <div className="flex gap-3">
            <button className="flex-1 bg-terracotta/40 text-primary border border-primary/20 rounded-xl py-3 px-4 flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 shadow-sm">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                picture_as_pdf
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center">
                Readable Book (.PDF)
              </span>
            </button>
            <button className="flex-1 bg-surface text-secondary border border-subtle rounded-xl py-3 px-4 flex flex-col items-center justify-center gap-1 hover:bg-header transition-all duration-300 active:scale-95">
              <span className="material-symbols-outlined text-secondary">
                folder_zip
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center">
                Raw Data (.ZIP)
              </span>
            </button>
          </div>
        </section>

        {/* Send button */}
        <div className="mt-auto pt-6 pb-4">
          <button className="w-full bg-sand text-stone-700 text-sm font-medium py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity duration-300 active:scale-[0.98]">
            <span className="material-symbols-outlined">mark_email_read</span>
            <span>Send Archive to Email</span>
          </button>
        </div>
      </main>
    </div>
  );
}