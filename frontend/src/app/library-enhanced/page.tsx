"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Sparkles,
  Plus,
  Settings,
  Users,
  MessageSquare,
  Clock,
  Reply,
  Database,
  Zap,
  TrendingUp,
  Lock,
  Sun,
  Moon,
} from "lucide-react";

const mockPersonas = [
  { id: "1", name: "Mom", relation: "Mother", status: "ready", lastMessage: "Don't forget to call this weekend ❤️", lastTime: "2h ago" },
  { id: "2", name: "Dad", relation: "Father", status: "ready", lastMessage: "The garden is looking great this spring", lastTime: "Yesterday" },
  { id: "3", name: "Aunt May", relation: "Aunt", status: "ready", lastMessage: "I found those old photos you wanted!", lastTime: "3d ago" },
];

const mockStats = [
  { icon: Users, label: "Personas", value: "4", color: "text-rose", bg: "bg-rose/10" },
  { icon: MessageSquare, label: "Messages", value: "342", color: "text-sage", bg: "bg-sage/10" },
  { icon: TrendingUp, label: "This Week", value: "28", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Database, label: "Memories", value: "1,247", color: "text-violet-500", bg: "bg-violet-500/10" },
];

function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function LibraryEnhancedPage() {
  const [greeting, setGreeting] = useState("");
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "☀️ Good morning" : h < 18 ? "🌤️ Good afternoon" : "🌙 Good evening");
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [isLight]);

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Top Bar ────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-header border-b border-subtle/40">
        <div className="relative flex items-center justify-between w-full px-5 py-4">
          <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-subtle/60 hover:border-rose/50 transition-all duration-300 bg-rose/10 flex items-center justify-center">
            <span className="font-serif text-sm text-rose/70">T</span>
          </button>
          <h1 className="text-xl font-serif font-bold tracking-tight absolute left-1/2 -translate-x-1/2 text-primary">
            Soul Library
          </h1>
          {/* Right: theme + settings */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsLight(!isLight)}
              className="p-2 rounded-full text-secondary hover:text-rose hover:bg-header/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button className="p-2 rounded-full text-secondary hover:text-rose hover:bg-header/50 transition-all duration-200">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-5 py-6 flex flex-col gap-6">

        {/* Welcome */}
        <section>
          <p className="text-secondary text-sm">{greeting}</p>
          <h2 className="font-serif text-3xl font-bold mt-1 tracking-tight text-primary">Your Vault</h2>
        </section>

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-subtle/60 bg-surface p-4 flex flex-col gap-2 hover:border-rose/20 transition-all duration-300">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono tabular-nums text-primary">{stat.value}</p>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Awakening */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest">Awakening</h3>
            <span className="text-[10px] text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">1 active</span>
          </div>
          <Card className="border-amber/20 bg-amber/5 animate-pulse">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber/10 border-2 border-amber/20 flex items-center justify-center flex-shrink-0">
                  <Lock size={20} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-sm text-primary">Grandpa Joe</p>
                  <p className="text-xs text-secondary">Grandfather</p>
                </div>
                <div className="flex-1">
                  <ProgressBar value={62} size="sm" fillClassName="bg-gradient-to-r from-amber-400 to-amber-500" pulse />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Echoes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest">Recent Echoes</h3>
            <button className="text-[10px] text-rose font-medium hover:underline">View all</button>
          </div>
          <div className="flex flex-col gap-2">
            {mockPersonas.map((p) => (
              <div key={p.id} className="rounded-2xl bg-surface border border-subtle/60 hover:bg-header transition-colors duration-200 p-4 flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-rose/10 border border-subtle/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <span className="font-serif text-sm text-rose/70">{p.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{p.name}</p>
                  <p className="text-xs text-secondary truncate">{p.lastMessage}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] text-secondary flex items-center gap-1"><Clock size={10} />{p.lastTime}</span>
                  <div className="w-8 h-8 rounded-full bg-header flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Reply size={14} className="text-rose" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Circle */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest">Your Circle</h3>
            <span className="text-[10px] text-secondary">{mockPersonas.length} personas</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mockPersonas.map((persona) => (
              <Card key={persona.id} hover className="cursor-pointer">
                <CardContent className="flex flex-col items-center gap-3 py-5">
                  <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center border-2 border-subtle/60 shadow-sm overflow-hidden">
                    <span className="font-serif text-xl text-rose/70">{persona.name.charAt(0)}</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-serif text-base font-bold text-primary">{persona.name}</h4>
                    <p className="text-[10px] text-secondary">{persona.relation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed border-2 border-subtle/60 bg-transparent hover:bg-surface cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-5 min-h-[140px]">
                <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center text-rose"><Plus size={22} /></div>
                <p className="text-xs text-secondary text-center">Add a<br />loved one</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card hover className="cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-rose" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Distill a Memory</p>
                  <p className="text-[10px] text-secondary">Upload & preserve</p>
                </div>
              </CardContent>
            </Card>
            <Card hover className="cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-sage" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">View Vault</p>
                  <p className="text-[10px] text-secondary">Browse memories</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="text-center pt-8 pb-8">
          <p className="text-[10px] text-secondary/50">Moms&amp;Pops · UI Mockup</p>
        </footer>
      </main>

      {/* ── Bottom Nav (UI skeleton only) ───────────── */}
      <nav className="sticky bottom-0 z-40 bg-surface border-t border-subtle/60 pb-safe">
        <div className="flex items-center justify-around py-3 px-2 max-w-md mx-auto">
          {[
            { icon: Users, label: "Library", active: true },
            { icon: Sparkles, label: "Distill", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-all duration-300 ${
                tab.active
                  ? "text-rose bg-rose/10"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
