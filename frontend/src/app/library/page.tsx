"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useSettingsStore } from "@/store/useSettingsStore";

const PERSONAS = [
  {
    id: "mom",
    name: "Mom",
    lastEntry: "2d ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbMJyFP-3aGvHVSXsMW7HTaNEtDzZrA0Kzd1T2Q8HjOfypgK4L1b380_ryr-TCFvYlVn4BS-BvoIGVgf33CPA_n0ZGMM_Cs_Po_9XhJDLD0XGnbD_mBpNPG3qHcDSKMrdJQ0hMWVvprpBRs36FLXPfmUw5od4lEelTtSpkplUJ5iIDSO01VYBa6rkhEwpBsEDtzR9Cq27vjFI4COo3QfW1HXQTvhLJ1jCK3sUESWugHjikUVsFatLYAp3K4a0kb9wtKt2biN6-_1CB",
    icon: "local_florist",
  },
  {
    id: "dad",
    name: "Dad",
    lastEntry: "1w ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmcvF9ISmjxb9nQ56-k7BTkmpoBwrCpGo544VGQawl6ksVwWPOK1yMqbt6wIbmBhhjLTuAcnDKBudgKahWs_I6JmTBOtjlrkvYB_n7CMUzYVO8_idNeS_c7CNY0IGq1WWDU4JXeyEkCL2fJ0FjOC5uSxADJTN94FFxNNjiktsT84H7n84q2v-uj4XhQBNvcBm2790UOE8XSExVzuq14zjHM60Q6rCchIhz4tmVz5mU0bZpYfprJOltzQXZaJoZkRI1iZCgIKCQj6dS",
    icon: "park",
  },
  {
    id: "grandpa",
    name: "Grandpa",
    lastEntry: "Drafting...",
    img: null,
    initial: "G",
    icon: "auto_awesome",
  },
];

export default function LibraryPage() {
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);

  return (
    <div className="flex-1 flex flex-col texture-overlay">
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
        {/* Thought of the Day */}
        <section className="rounded-2xl bg-surface border border-subtle/60 p-5 shadow-sm shadow-sand/20 border border-subtle texture-overlay relative overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <p className="font-label-caps text-label-caps text-primary-variant uppercase tracking-widest mb-3 opacity-80">
            Thought of the Day
          </p>
          <p className="font-h2 text-h2 text-primary italic leading-relaxed">
            &ldquo;The things you hide in your heart are the things that keep you
            alive.&rdquo;
          </p>
        </section>

        {/* Waiting for you */}
        <section className="flex flex-col gap-4 animate-fade-in-up stagger-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 mt-8 ml-1">
            Waiting for you...
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat/mom"
              className="bg-terracotta text-primary rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200 shadow-sm border border-subtle btn-press"
            >
              <span className="w-2 h-2 rounded-full bg-primary block" />
              <span className="font-body-md">Mom</span>
            </Link>
            <Link
              href="/chat/grandpa"
              className="bg-sage text-primary rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200 shadow-sm border border-subtle btn-press"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary block" />
              <span className="font-body-md">Grandpa</span>
            </Link>
          </div>
        </section>

        {/* Your Circle */}
        <section className="flex flex-col gap-4 mt-4 animate-fade-in-up stagger-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 mt-8 ml-1">
            Your Circle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PERSONAS.map((persona, i) => (
              <Link
                key={persona.id}
                href={`/chat/${persona.id}`}
                className={`bg-surface rounded-3xl p-5 flex flex-col items-center gap-2 border border-subtle/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer relative overflow-hidden group btn-press animate-fade-in-up stagger-${i + 1}`}
              >
                <span className="material-symbols-outlined text-[100px] floral-watermark text-sand absolute bottom-[-20%] right-[-10%] opacity-5 scale-150 -rotate-[15deg] pointer-events-none">
                  {persona.icon}
                </span>
                {persona.img ? (
                  <img
                    alt={persona.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-surface-container shadow-sm group-hover:scale-110 transition-transform duration-500"
                    src={persona.img}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center border-2 border-surface-container shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="font-persona-name text-h2 text-primary-variant">
                      {persona.initial}
                    </span>
                  </div>
                )}
                <div className="text-center z-10">
                  <h3 className="font-persona-name text-persona-name text-primary">
                    {persona.name}
                  </h3>
                  <p className="font-body-md text-sm text-primary-variant">
                    Last entry: {persona.lastEntry}
                  </p>
                </div>
              </Link>
            ))}

            {/* Add New */}
            <Link
              href="/distill"
              className="bg-transparent border border-dashed border-subtle rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-surface transition-all duration-200 cursor-pointer group min-h-[140px] btn-press animate-fade-in-up stagger-4"
            >
              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-primary-variant group-hover:bg-surface-high group-hover:scale-110 transition-all duration-300">
                <span className="material-symbols-outlined">add</span>
              </div>
              <p className="font-body-md text-sm text-primary-variant text-center">
                Add a loved one
              </p>
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}