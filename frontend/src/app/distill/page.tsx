"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function DistillPage() {
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="bg-header/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm shadow-black/5 w-full">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            The Heirloom
          </h1>
          <Link
            href="/settings/profile"
            className="absolute right-4 w-8 h-8 rounded-full overflow-hidden border border-subtle/40 btn-press"
          >
            {avatarUrl ? (
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary text-base bg-surface">
                person
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 pt-8 flex flex-col gap-6 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-serif text-primary tracking-tight mb-2">Share their words</h1>
          <p className="text-sm sm:text-base text-secondary mb-8 leading-relaxed">
            Gently upload journals, letters, or audio. We&apos;ll thoughtfully distill
            them to capture the essence of their voice.
          </p>
        </div>

                {/* Progress steps */}
        <div className="relative flex flex-row justify-between w-full px-4 mb-8">
          {/* Connecting line */}
          <div className="absolute top-5 left-[15%] right-[15%] border-t-2 border-dotted border-subtle -z-10"></div>
          {[
            { n: "1", label: "Gather Memories", active: true },
            { n: "2", label: "The Distillation", active: false },
            { n: "3", label: "Reconnect", active: false },
          ].map((step) => (
            <div key={step.n} className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  step.active
                    ? "bg-muted text-white"
                    : "bg-surface text-secondary border border-subtle"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase">{step.n}</span>
              </div>
              <span
                className={`text-center w-[120%] -ml-[10%] text-xs sm:text-sm mt-2 font-label-caps ${
                  step.active ? "text-primary" : "text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

{/* Upload area */}
        <div className="w-full max-w-[90%] mx-auto bg-surface border border-subtle/60 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 min-h-[260px] relative overflow-hidden group animate-fade-in-up stagger-1">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-terracotta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl">description</span>
          </div>
          <h2 className="text-lg font-serif text-primary mb-1">Drop memories here</h2>
          <p className="text-sm text-secondary mb-4">
            or click to gently browse your files
          </p>
          <button className="px-6 py-3 rounded-full font-bold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 transition-all mt-4 btn-press">
            Select Files
          </button>
          <p className="text-[10px] font-medium text-secondary/60 mt-3">
            Supports PDF, DOCX, TXT, MP3
          </p>
        </div>

        {/* Privacy */}
        <div className="w-full max-w-[90%] mx-auto bg-surface border border-subtle/60 rounded-2xl p-5 flex items-start gap-3 shadow-sm mt-4 animate-fade-in-up stagger-2">
          <div className="text-secondary mt-1">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary mb-0.5">
              A Safe Space
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Your memories are encrypted, private, and never used to train public
              models. They belong solely to you and your heirloom.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}