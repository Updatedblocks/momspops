"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import {
  Sun, Moon, MessageSquare, Heart, Star, Send, Mic, Settings,
  Users, Sparkles, Plus, Camera, Trash2, Check, X,
} from "lucide-react";

/* ═════════════════════════════════════════════════════════
   Color schema audit — shows every element in both modes
   ═════════════════════════════════════════════════════════ */

export default function ColorSchemaPage() {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (mode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [mode]);

  return (
    <div className="min-h-screen bg-base text-primary transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-5 py-10 flex flex-col gap-12">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Color Schema</h1>
            <p className="text-sm text-secondary mt-1">Audit every element in both modes</p>
          </div>
          <button
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-subtle/80 hover:border-rose/40 transition-all bg-surface"
          >
            {mode === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
            <span className="text-sm font-medium">{mode === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </header>

        <Badge mode={mode} />

        {/* ═══════════════════════════════════════════════
            TEXT HIERARCHY
        ═══════════════════════════════════════════════ */}
        <Section title="Text Hierarchy">
          <Row label="H1 · font-serif · text-primary" className="text-3xl font-serif font-bold text-primary">Soul Library</Row>
          <Row label="H2 · font-serif · text-primary" className="text-2xl font-serif font-bold text-primary">Your Vault</Row>
          <Row label="H3 · font-serif · text-primary" className="text-lg font-serif font-bold text-primary">Recent Echoes</Row>
          <Row label="Body · text-primary" className="text-sm text-primary">This is primary body text used for main content.</Row>
          <Row label="Body · text-secondary" className="text-sm text-secondary">Secondary text for labels, metadata, descriptions.</Row>
          <Row label="Caption · text-secondary/50" className="text-xs text-secondary/50">Muted caption text for timestamps and footers.</Row>
          <Row label="Label · uppercase tracking-widest" className="text-[10px] font-bold uppercase tracking-widest text-secondary">Section Label</Row>
          <Row label="Placeholder" className=""><Input placeholder="Placeholder text in input..." readOnly /></Row>
          <Row label="Accent · text-rose" className="text-sm font-medium text-rose">Rose-gold accent text for links and highlights.</Row>
          <Row label="Success · text-sage" className="text-sm font-medium text-sage">Sage green for success and completion states.</Row>
          <Row label="Warning · text-amber-500" className="text-sm font-medium text-amber-500">Amber for warnings and in-progress states.</Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            BACKGROUNDS
        ═══════════════════════════════════════════════ */}
        <Section title="Backgrounds">
          <Row label="bg-base (canvas)">
            <div className="w-full h-12 rounded-xl bg-base border border-subtle/60" />
          </Row>
          <Row label="bg-surface (cards)">
            <div className="w-full h-12 rounded-xl bg-surface border border-subtle/60 flex items-center px-4 text-xs text-secondary">bg-surface</div>
          </Row>
          <Row label="bg-header">
            <div className="w-full h-12 rounded-xl bg-header border border-subtle/60 flex items-center px-4 text-xs text-secondary">bg-header</div>
          </Row>
          <Row label="bg-white/5 (dark glass)">
            <div className="w-full h-12 rounded-xl bg-white/5 border border-white/5 flex items-center px-4 text-xs text-secondary">bg-white/5</div>
          </Row>
          <Row label="bg-rose/10 (accent tint)">
            <div className="w-full h-12 rounded-xl bg-rose/10 flex items-center px-4 text-xs text-rose">bg-rose/10</div>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            BORDERS
        ═══════════════════════════════════════════════ */}
        <Section title="Borders & Outlines">
          <Row label="border-subtle/60 (ghost)">
            <div className="w-full h-12 rounded-xl border border-subtle/60 flex items-center px-4 text-xs text-secondary">border-subtle/60</div>
          </Row>
          <Row label="border-white/5 (dark ghost)">
            <div className="w-full h-12 rounded-xl border border-white/5 flex items-center px-4 text-xs text-secondary">border-white/5</div>
          </Row>
          <Row label="border-white/10">
            <div className="w-full h-12 rounded-xl border border-white/10 flex items-center px-4 text-xs text-secondary">border-white/10</div>
          </Row>
          <Row label="border-rose/40 (accent)">
            <div className="w-full h-12 rounded-xl border border-rose/40 flex items-center px-4 text-xs text-rose">border-rose/40</div>
          </Row>
          <Row label="border-dashed + subtle">
            <div className="w-full h-12 rounded-xl border-2 border-dashed border-subtle/60 flex items-center justify-center text-xs text-secondary">Dashed border</div>
          </Row>
          <Row label="focus ring (input)">
            <Input value="Focused input" readOnly className="ring-2 ring-rose/40 border-rose/30" />
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            BUTTONS
        ═══════════════════════════════════════════════ */}
        <Section title="Buttons">
          <Row label="default">
            <Button size="sm">Default</Button>
          </Row>
          <Row label="default · icon">
            <Button size="icon" aria-label="settings"><Settings size={18} /></Button>
          </Row>
          <Row label="default · w/ icon">
            <Button size="sm"><Plus size={14} /> Create</Button>
          </Row>
          <Row label="secondary">
            <Button variant="secondary" size="sm">Secondary</Button>
          </Row>
          <Row label="ghost">
            <Button variant="ghost" size="sm">Ghost</Button>
          </Row>
          <Row label="outline">
            <Button variant="outline" size="sm">Outline</Button>
          </Row>
          <Row label="disabled">
            <Button size="sm" disabled>Disabled</Button>
          </Row>
          <Row label="ghost · icon">
            <Button variant="ghost" size="icon" aria-label="delete"><Trash2 size={18} /></Button>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            ICONS
        ═══════════════════════════════════════════════ */}
        <Section title="Icons & Status">
          <Row label="text-rose (primary accent)" className="flex items-center gap-2">
            <Heart size={16} className="text-rose" /><Sparkles size={16} className="text-rose" /><Star size={16} className="text-rose" />
            <span className="text-xs text-secondary ml-2">Hearts · Sparkles · Stars</span>
          </Row>
          <Row label="text-sage (success)" className="flex items-center gap-2">
            <Check size={16} className="text-sage" />
            <span className="text-xs text-secondary ml-2">Check · Done · Complete</span>
          </Row>
          <Row label="text-secondary (muted)" className="flex items-center gap-2">
            <Settings size={16} className="text-secondary" /><Users size={16} className="text-secondary" /><Send size={16} className="text-secondary" />
            <span className="text-xs text-secondary ml-2">Settings · Users · Send</span>
          </Row>
          <Row label="text-amber-500 (warning)" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-secondary ml-2">Pulsing dot · In progress</span>
          </Row>
          <Row label="text-rose/70 (subtle accent)" className="flex items-center gap-2">
            <Camera size={16} className="text-rose/70" />
            <span className="text-xs text-secondary ml-2">Camera · Edit · Subtle</span>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            CHAT BUBBLES
        ═══════════════════════════════════════════════ */}
        <Section title="Chat Bubbles">
          <Row label="User bubble · bg-rose text-white">
            <div className="max-w-[260px] rounded-2xl rounded-tr-sm px-4 py-2 bg-stone-900 text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1A1A1A] shadow-sm">
              <p className="text-sm">Hey Mom, how was your day?</p>
              <span className="text-[10px] opacity-60">14:32</span>
            </div>
          </Row>
          <Row label="Persona bubble · bg-surface text-primary">
            <div className="max-w-[260px] rounded-2xl rounded-tl-sm px-4 py-2 bg-surface border border-subtle/60 text-primary shadow-sm">
              <span className="text-xs text-secondary block mb-1">Mom</span>
              <p className="text-sm">It was lovely! The roses are blooming 🌹</p>
              <span className="text-[10px] text-secondary/50">14:33</span>
            </div>
          </Row>
          <Row label="Reply quote · bg-white/10 border-white/30">
            <div className="max-w-[260px] rounded-2xl rounded-tr-sm px-4 py-2 bg-stone-900 text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1A1A1A] shadow-sm">
              <div className="mb-2 px-2 py-1.5 rounded-lg border-l-2 bg-white/10 border-white/30 text-white/70 text-[11px]">
                Mom: It was lovely! I went to the garden...
              </div>
              <p className="text-sm">Send me a photo!</p>
              <span className="text-[10px] opacity-60">14:34</span>
            </div>
          </Row>
          <Row label="Typing dots · opacity-70">
            <div className="flex gap-1.5 items-center h-5 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce [animation-delay:100ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce [animation-delay:200ms]" />
            </div>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            CARDS
        ═══════════════════════════════════════════════ */}
        <Section title="Cards">
          <Row label="Default Card">
            <Card className="w-full max-w-xs">
              <CardContent className="py-4">
                <p className="text-sm text-primary font-medium">Persona Card</p>
                <p className="text-xs text-secondary">Mother · Active</p>
              </CardContent>
            </Card>
          </Row>
          <Row label="Rose-tinted Card">
            <Card className="w-full max-w-xs border-rose/30 bg-rose/5">
              <CardContent className="py-4">
                <p className="text-sm text-rose font-medium">Accent Card</p>
                <p className="text-xs text-rose/70">Rose-gold tinted</p>
              </CardContent>
            </Card>
          </Row>
          <Row label="Dashed Card">
            <Card className="w-full max-w-xs border-dashed border-2 border-subtle/60 bg-transparent">
              <CardContent className="py-4 text-center">
                <Plus size={20} className="text-secondary mx-auto mb-1" />
                <p className="text-xs text-secondary">Add a loved one</p>
              </CardContent>
            </Card>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            PROGRESS BARS
        ═══════════════════════════════════════════════ */}
        <Section title="Progress Bars">
          <Row label="Rose (default)">
            <ProgressBar value={72} label="Progress" className="w-full" />
          </Row>
          <Row label="Sage (success)">
            <ProgressBar value={100} label="Complete" fillClassName="bg-gradient-to-r from-sage to-sage" className="w-full" />
          </Row>
          <Row label="Amber (warning)">
            <ProgressBar value={45} label="Processing" fillClassName="bg-gradient-to-r from-amber-400 to-amber-500" className="w-full" pulse />
          </Row>
          <Row label="Violet (info)">
            <ProgressBar value={62} label="Brain Map" fillClassName="bg-gradient-to-r from-violet-400 to-purple-500" className="w-full" />
          </Row>
          <Row label="Sky (neutral)">
            <ProgressBar value={18} label="Extracting" fillClassName="bg-gradient-to-r from-sky-400 to-blue-500" className="w-full" />
          </Row>
          <Row label="Empty (0%)">
            <ProgressBar value={0} label="Idle" className="w-full" />
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            STATS + DATA
        ═══════════════════════════════════════════════ */}
        <Section title="Data & Metrics">
          <Row label="Stat pill · bg-surface">
            <div className="rounded-2xl border border-subtle/60 bg-surface p-4 flex flex-col gap-1 w-28">
              <Users size={16} className="text-rose" />
              <p className="text-xl font-bold font-mono tabular-nums text-primary">42</p>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Personas</p>
            </div>
          </Row>
          <Row label="Mono numbers · font-mono tabular-nums">
            <p className="text-2xl font-bold font-mono tabular-nums text-primary">1,247</p>
          </Row>
          <Row label="Status pill · draft">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">Draft</span>
          </Row>
          <Row label="Status pill · distilling">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse">Distilling</span>
          </Row>
          <Row label="Status pill · ready">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Ready</span>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            INPUTS + FORMS
        ═══════════════════════════════════════════════ */}
        <Section title="Inputs & Forms">
          <Row label="Text Input · active">
            <Input placeholder="Enter your name..." className="w-full max-w-xs" />
          </Row>
          <Row label="Text Input · disabled">
            <Input placeholder="Disabled input" disabled className="w-full max-w-xs" />
          </Row>
          <Row label="Underline Input">
            <input
              className="w-full max-w-xs bg-transparent border-0 border-b border-subtle/60 px-0 py-2 font-serif text-xl text-primary focus:ring-0 focus:border-rose transition-colors"
              placeholder="Persona name"
              readOnly
            />
          </Row>
          <Row label="Chat Bar · rounded-full">
            <div className="flex items-center gap-3 bg-stone-100 dark:bg-white/5 rounded-full border border-stone-200/60 dark:border-white/5 p-2 w-full max-w-sm">
              <button className="p-2 text-secondary hover:text-rose rounded-full"><Mic size={16} /></button>
              <div className="w-px h-5 bg-subtle/60 self-center" />
              <button className="p-2 text-secondary hover:text-rose rounded-full"><Plus size={16} /></button>
              <input className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-primary placeholder:text-secondary/50 py-2" placeholder="Message..." readOnly />
              <button className="p-2 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"><Send size={16} /></button>
            </div>
          </Row>
        </Section>

        {/* ═══════════════════════════════════════════════
            NAVIGATION
        ═══════════════════════════════════════════════ */}
        <Section title="Navigation">
          <Row label="Bottom Nav">
            <div className="bg-surface border border-subtle/60 rounded-2xl p-1 flex items-center gap-1 w-full max-w-xs">
              {[
                { icon: Users, label: "Library", active: true },
                { icon: Sparkles, label: "Distill", active: false },
                { icon: Settings, label: "Settings", active: false },
              ].map(t => (
                <button key={t.label} className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-full transition-all text-[10px] ${
                  t.active ? "text-rose bg-rose/10 font-medium" : "text-secondary"
                }`}>
                  <t.icon size={16} />
                  {t.label}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Top Bar">
            <div className="bg-header border border-subtle/40 rounded-2xl px-4 py-3 flex items-center justify-between w-full max-w-xs">
              <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose/70 text-xs font-serif">T</div>
              <span className="text-sm font-serif font-bold text-primary">Soul Library</span>
              <Settings size={16} className="text-secondary" />
            </div>
          </Row>
        </Section>

        <footer className="text-center pt-8 pb-24 border-t border-subtle/60">
          <p className="text-xs text-secondary/50">Color Schema Audit · Mode: {mode}</p>
        </footer>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Helpers
   ═════════════════════════════════════════════════════════ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4 border-b border-subtle/60 pb-2">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Row({ label, children, className }: { label: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-subtle/20">
      <span className="text-[10px] font-mono text-secondary/70 w-44 flex-shrink-0 leading-tight">{label}</span>
      <div className={className || ""}>{children}</div>
    </div>
  );
}

function Badge({ mode }: { mode: string }) {
  return (
    <div className="flex items-center gap-2 self-end">
      <span className={`w-2 h-2 rounded-full ${mode === "dark" ? "bg-indigo-400" : "bg-amber-400"}`} />
      <span className="text-xs font-bold uppercase tracking-widest text-secondary">{mode} mode</span>
    </div>
  );
}
