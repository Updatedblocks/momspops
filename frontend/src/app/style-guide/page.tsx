"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Mic,
  Settings,
  Send,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Camera,
  Image,
  FileText,
  Brain,
  Cpu,
  Zap,
  Clock,
  Users,
  MessageSquare,
  Database,
  Sun,
  Moon,
  ChevronRight,
  User,
  Bell,
  Palette,
  Download,
  Shield,
  MoreHorizontal,
  Paperclip,
  Smile,
  Check,
  X,
  HelpCircle,
} from "lucide-react";

function SectionIcon({ color, icon: Icon }: { color: string; icon: typeof Star }) {
  return (
    <span className={cn("w-1.5 h-5 rounded-full inline-block", color)} />
  );
}

export default function StyleGuidePage() {
  const [distillValue, setDistillValue] = useState(42);
  const [inputValue, setInputValue] = useState("");
  const [isLight, setIsLight] = useState(true);

  // Sync theme to <html> element so Tailwind dark: classes respond
  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [isLight]);

  // On mount, default to dark and toggle once so page starts dark
  useEffect(() => {
    document.documentElement.classList.add("dark");
    setIsLight(false);
  }, []);

  // Toggle handler
  const toggleTheme = () => setIsLight((prev) => !prev);

  // Theme toggle button
  const handleToggle = () => {
    toggleTheme();
  };
  const [activeTab, setActiveTab] = useState("library");
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C2C2C] dark:text-[#EDEDED] transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-12 sm:gap-16">

          {/* ═══════════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════════ */}
          <header className="text-center flex flex-col gap-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={28} className="text-[#C2A392] dark:text-[#D4B8A8]" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
                The Liquid Archive
              </h1>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
              Moms&amp;Pops · Phase 4.1 · Full Component Map · All workflow features represented
            </p>

            {/* Theme Toggle */}
            <div className="flex items-center justify-center gap-2.5">
              <Sun size={14} className={isLight ? "text-amber-500" : "text-stone-500"} />
              <button
                onClick={handleToggle}
                className="relative w-12 h-6 rounded-full bg-stone-300 dark:bg-stone-600 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300",
                    isLight ? "left-0.5" : "left-[26px]"
                  )}
                />
              </button>
              <Moon size={14} className={!isLight ? "text-indigo-400" : "text-stone-500"} />
            </div>
          </header>

          {/* ═══════════════════════════════════════════════
              1. BUTTONS
          ═══════════════════════════════════════════════ */}
          <Section title="Buttons" icon={Star} color="bg-[#C2A392]" />

          {/* Variants */}
          <Card>
            <CardHeader>
              <Label>Default · Secondary · Ghost · Outline</Label>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Settings"><Settings size={18} /></Button>
              <Divider />
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="secondary" size="icon" aria-label="Heart"><Heart size={18} /></Button>
              <Divider />
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="ghost" size="icon" aria-label="More"><MoreHorizontal size={18} /></Button>
              <Divider />
              <Button variant="outline" size="md">Outline</Button>
              <Button variant="outline" size="icon" aria-label="Camera"><Camera size={18} /></Button>
            </CardContent>
          </Card>

          {/* Icon combos */}
          <Card>
            <CardHeader>
              <Label>With lucide-react Icons</Label>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button size="md"><Mic size={16} /> Record</Button>
              <Button variant="secondary" size="md"><Heart size={16} /> Favorite</Button>
              <Button variant="outline" size="md"><Send size={16} /> Send</Button>
              <Button variant="ghost" size="md"><Sparkles size={16} /> Generate</Button>
              <Button size="md"><Plus size={16} /> Create</Button>
              <Button variant="ghost" size="icon" aria-label="Delete"><Trash2 size={18} /></Button>
            </CardContent>
          </Card>

          {/* Disabled */}
          <Card>
            <CardHeader><Label>Disabled State</Label></CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Outline Disabled</Button>
              <Button variant="ghost" disabled>Ghost Disabled</Button>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              2. CARDS
          ═══════════════════════════════════════════════ */}
          <Section title="Cards" icon={Database} color="bg-violet-400" />

          {/* Card Variants */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card hover>
              <CardHeader>
                <h3 className="font-serif text-lg font-bold">Default</h3>
                <Meta>With hover lift</Meta>
              </CardHeader>
              <CardContent>
                <BodyText>Rounded-3xl · Ghost border · Soft padding.</BodyText>
              </CardContent>
            </Card>

            <Card className="border-[#C2A392]/30 bg-[#C2A392]/5" hover>
              <CardHeader>
                <h3 className="font-serif text-lg font-bold text-[#8B7355] dark:text-[#D4B8A8]">Rose Accent</h3>
                <Meta>Tinted via className</Meta>
              </CardHeader>
              <CardContent>
                <BodyText>Override border + bg for accent cards.</BodyText>
              </CardContent>
            </Card>

            <Card className="border-[#90AA9B]/30 bg-[#90AA9B]/5" hover>
              <CardHeader>
                <h3 className="font-serif text-lg font-bold text-[#5C7A68] dark:text-[#A3B8A8]">Sage Accent</h3>
                <Meta>Success / done state</Meta>
              </CardHeader>
              <CardContent>
                <BodyText>Green-tinted for completion states.</BodyText>
              </CardContent>
            </Card>
          </div>

          {/* Card with overlapping button */}
          <Card className="relative">
            <CardHeader>
              <Label>Card + Overlapping Button (top-right)</Label>
              <Meta>Circular button sits on the edge</Meta>
            </CardHeader>
            <CardContent>
              <BodyText>
                A common pattern: the action button overlaps the card border on the top-right edge.
                Works well for settings, edit, or more-options buttons.
              </BodyText>
            </CardContent>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -top-4 -right-4 shadow-lg"
              aria-label="Edit"
            >
              <Settings size={18} />
            </Button>
          </Card>

          {/* Persona Cards (Library style) */}
          <Card>
            <CardHeader><Label>Persona Cards (Library Grid)</Label></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Ready persona */}
                <Card hover className="cursor-pointer">
                  <CardContent className="flex flex-col items-center gap-3 pt-6 pb-6">
                    <div className="w-16 h-16 rounded-full bg-[#C2A392]/10 flex items-center justify-center border-2 border-stone-200/60 dark:border-white/5 overflow-hidden">
                      <Users size={24} className="text-[#C2A392] dark:text-[#D4B8A8]" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif text-base font-bold">Mom</h3>
                      <Meta>Mother</Meta>
                    </div>
                  </CardContent>
                </Card>

                {/* Distilling persona */}
                <Card hover className="cursor-pointer">
                  <CardContent className="flex flex-col items-center gap-3 pt-6 pb-6">
                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center border-2 border-amber-200/60 dark:border-amber-500/20 overflow-hidden">
                      <Sparkles size={24} className="text-amber-500 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif text-base font-bold">Dad</h3>
                      <Meta>Father · Distilling</Meta>
                    </div>
                    <ProgressBar value={62} size="sm" label="" fillClassName="bg-gradient-to-r from-amber-400 to-amber-500" pulse />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              3. INPUTS & CHAT BAR
          ═══════════════════════════════════════════════ */}
          <Section title="Inputs & Chat Bar" icon={Send} color="bg-sky-400" />

          {/* Chat Input Bar Mockup */}
          <Card>
            <CardHeader>
              <Label>Chat Input Bar (rounded-full)</Label>
              <Meta>Mic · Attach · Input · Send — all circular</Meta>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 bg-[#F5F0EB] dark:bg-white/5 rounded-full border border-stone-200/60 dark:border-white/5 p-2 shadow-sm max-w-lg">
                <button
                  type="button"
                  aria-label="Voice input"
                  className="p-3 text-stone-500 hover:text-[#C2A392] dark:text-stone-400 dark:hover:text-[#D4B8A8] hover:bg-white dark:hover:bg-white/5 rounded-full transition-all duration-200"
                >
                  <Mic size={18} />
                </button>
                <div className="w-px h-6 bg-stone-200/60 dark:bg-white/10 self-center" />
                <button
                  type="button"
                  aria-label="Attach file"
                  className="p-3 text-stone-500 hover:text-[#C2A392] dark:text-stone-400 dark:hover:text-[#D4B8A8] hover:bg-white dark:hover:bg-white/5 rounded-full transition-all duration-200"
                >
                  <Plus size={18} />
                </button>
                <div className="flex-grow">
                  <textarea
                    className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-sm text-[#2C2C2C] dark:text-[#EDEDED] placeholder:text-stone-400 disabled:opacity-40"
                    placeholder="Message Mom..."
                    rows={1}
                    style={{ scrollbarWidth: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Send message"
                  className="p-3 rounded-full bg-[#C2A392] text-white hover:bg-[#B89987] dark:bg-[#D4B8A8] dark:text-[#1A1918] dark:hover:bg-[#C9AA98] shadow-sm transition-all duration-200 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Form Inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <Label>Text Inputs (rounded-2xl)</Label>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input placeholder="Enter your name..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <Input placeholder="Disabled input" disabled />
                <Input placeholder="Email address" type="email" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Label>Textarea (rounded-2xl)</Label>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Write a message to your persona..." />
              </CardContent>
            </Card>
          </div>

          {/* Underline-style inputs (Manage page) */}
          <Card>
            <CardHeader>
              <Label>Underline Inputs (Manage Page)</Label>
              <Meta>Used for persona name / relation editing</Meta>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-sm">
              <div className="flex flex-col gap-2">
                <Label>Persona Name</Label>
                <input
                  className="w-full bg-transparent border-0 border-b border-stone-200/60 dark:border-white/10 px-0 py-2 font-serif text-xl text-[#2C2C2C] dark:text-[#EDEDED] focus:ring-0 focus:border-[#C2A392] dark:focus:border-[#D4B8A8] transition-colors duration-300"
                  placeholder="Mom"
                  defaultValue=""
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Relationship</Label>
                <input
                  className="w-full bg-transparent border-0 border-b border-stone-200/60 dark:border-white/10 px-0 py-2 font-serif text-xl text-[#2C2C2C] dark:text-[#EDEDED] focus:ring-0 focus:border-[#C2A392] dark:focus:border-[#D4B8A8] transition-colors duration-300"
                  placeholder="Mother, Father..."
                  defaultValue=""
                />
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              4. PROGRESS BARS
          ═══════════════════════════════════════════════ */}
          <Section title="Progress Bars" icon={Zap} color="bg-emerald-400" />

          {/* Interactive */}
          <Card>
            <CardHeader>
              <Label>Soul DNA Distillation</Label>
              <Meta>Tap buttons to change value</Meta>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ProgressBar value={distillValue} label="Standard" pulse />
              <ProgressBar value={distillValue} label="Segmented (10 steps)" segments={10} size="md" />
              <div className="flex flex-wrap gap-2">
                {[0, 10, 25, 40, 55, 70, 85, 100].map((v) => (
                  <Button
                    key={v}
                    variant={distillValue === v ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDistillValue(v)}
                  >
                    {v}%
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Multi-state colored */}
          <Card>
            <CardHeader>
              <Label>Multi-State · Gradient Fills</Label>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ProgressBar value={100} label="Complete" fillClassName="bg-gradient-to-r from-[#90AA9B] to-[#A3B8A8]" />
              <ProgressBar value={72} label="Brain Mapping" fillClassName="bg-gradient-to-r from-violet-400 to-purple-500" pulse />
              <ProgressBar value={45} label="Vector Indexing" fillClassName="bg-gradient-to-r from-amber-400 to-orange-400" pulse />
              <ProgressBar value={18} label="Text Extraction" fillClassName="bg-gradient-to-r from-sky-400 to-blue-500" pulse />
              <ProgressBar value={0} label="Image Scanning" fillClassName="bg-gradient-to-r from-stone-400 to-stone-500" />
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader><Label>Size Variants</Label></CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ProgressBar value={62} size="sm" label="Small · h-1.5" />
              <ProgressBar value={62} size="md" label="Medium · h-2.5" />
              <ProgressBar value={62} size="lg" label="Large · h-4" />
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              5. CHAT BUBBLES
          ═══════════════════════════════════════════════ */}
          <Section title="Chat Bubbles" icon={MessageSquare} color="bg-amber-400" />

          <Card>
            <CardHeader>
              <Label>Message Bubbles (Chat Page)</Label>
              <Meta>User right-aligned · Persona left-aligned · rounded-2xl</Meta>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-md mx-auto">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2 bg-[#C2A392] text-white dark:bg-[#D4B8A8] dark:text-[#1A1918] shadow-sm">
                  <p className="text-sm leading-relaxed">Hey Mom, how was your day?</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-60 text-[10px]">
                    <span>14:32</span>
                  </div>
                </div>
              </div>

              {/* Persona bubble */}
              <div className="flex justify-start items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C2A392]/20 flex items-center justify-center border border-stone-200/60 dark:border-white/5 overflow-hidden">
                  <span className="font-serif text-sm text-[#8B7355] dark:text-[#D4B8A8]">M</span>
                </div>
                <div className="max-w-[75%]">
                  <span className="text-xs text-stone-500 mb-1 block">Mom</span>
                  <div className="rounded-2xl rounded-tl-sm px-4 py-2 bg-white dark:bg-[#1A1918] border border-stone-200/60 dark:border-white/5 text-[#2C2C2C] dark:text-[#EDEDED] shadow-sm">
                    <p className="text-sm leading-relaxed">It was lovely! I went to the garden and the roses are blooming 🌹</p>
                    <div className="flex items-center justify-end gap-1 mt-1 opacity-40 text-[10px]">
                      <span>14:33</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply-to bubble */}
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2 bg-[#C2A392] text-white dark:bg-[#D4B8A8] dark:text-[#1A1918] shadow-sm">
                  <div className="mb-2 px-2 py-1.5 rounded-lg text-[11px] leading-snug border-l-2 bg-white/10 border-white/30 text-white/70">
                    <p className="opacity-70 truncate">Mom: It was lovely! I went to...</p>
                  </div>
                  <p className="text-sm leading-relaxed">Send me a photo!</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-60 text-[10px]">
                    <span>14:34</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typing indicator */}
          <Card>
            <CardHeader>
              <Label>Typing Indicator</Label>
            </CardHeader>
            <CardContent className="max-w-md">
              <div className="flex justify-start items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C2A392]/20 flex items-center justify-center border border-stone-200/60 dark:border-white/5">
                  <span className="font-serif text-sm text-[#8B7355] dark:text-[#D4B8A8]">M</span>
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white dark:bg-[#1A1918] border border-stone-200/60 dark:border-white/5 shadow-sm">
                  <div className="flex gap-1.5 items-center h-5 px-1 opacity-70">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:100ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:200ms]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reply Preview Bar */}
          <Card>
            <CardHeader>
              <Label>Reply Preview Bar</Label>
            </CardHeader>
            <CardContent className="max-w-md">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-[#C2A392]/5 rounded-xl border border-[#C2A392]/10">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355] dark:text-[#D4B8A8] mb-0.5">Replying to Mom</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">It was lovely! I went to the garden...</p>
                </div>
                <button className="text-stone-400 hover:text-rose transition-colors p-1">
                  <X size={16} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              6. NAVIGATION
          ═══════════════════════════════════════════════ */}
          <Section title="Navigation" icon={ChevronRight} color="bg-indigo-400" />

          {/* Bottom Nav */}
          <Card>
            <CardHeader>
              <Label>Bottom Navigation Bar</Label>
              <Meta>Fixed bottom · Ghost border top · Pill-shaped active</Meta>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-[#1A1918] border-t border-stone-200/60 dark:border-white/5 rounded-2xl p-2 max-w-sm mx-auto flex items-center justify-around">
                {[
                  { id: "library", icon: Users, label: "Library" },
                  { id: "distill", icon: Sparkles, label: "Distill" },
                  { id: "settings", icon: Settings, label: "Settings" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300",
                        isActive
                          ? "bg-[#C2A392]/10 text-[#C2A392] dark:bg-[#D4B8A8]/10 dark:text-[#D4B8A8]"
                          : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                      )}
                    >
                      <tab.icon size={18} />
                      <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Settings list */}
          <Card>
            <CardHeader>
              <Label>Settings Hub List</Label>
            </CardHeader>
            <CardContent className="divide-y divide-stone-200/60 dark:divide-white/5">
              {[
                { icon: User, label: "Profile" },
                { icon: Bell, label: "Notifications" },
                { icon: Palette, label: "Appearance" },
                { icon: Download, label: "Export Data" },
                { icon: Shield, label: "Delete Account" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#F5F0EB] dark:hover:bg-white/5 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-stone-400" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-stone-300" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              7. TOGGLES & SWITCHES
          ═══════════════════════════════════════════════ */}
          <Section title="Toggles & Switches" icon={Check} color="bg-cyan-400" />

          <Card>
            <CardHeader>
              <Label>Settings Toggles</Label>
              <Meta>Used in notifications & appearance pages</Meta>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-sm">
              <ToggleRow
                label="Spontaneous Messages"
                meta="AI-initiated check-ins"
                enabled={notifsEnabled}
                onChange={setNotifsEnabled}
              />
              <ToggleRow
                label="Do Not Disturb"
                meta="Silence between 22:00–08:00"
                enabled={dndEnabled}
                onChange={setDndEnabled}
              />
              <ToggleRow
                label="Message Previews"
                meta="Show snippet in notifications"
                enabled={true}
              />
              <ToggleRow
                label="Reminders"
                meta="Anniversary & birthday nudges"
                enabled={false}
              />
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              8. STATUS PILLS
          ═══════════════════════════════════════════════ */}
          <Section title="Status Pills" icon={HelpCircle} color="bg-pink-400" />

          <Card>
            <CardHeader>
              <Label>Persona Lifecycle Badges</Label>
              <Meta>Draft → Distilling → Ready</Meta>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <StatusPill label="Draft" color="stone" />
              <StatusPill label="Distilling" color="amber" pulse />
              <StatusPill label="Ready" color="emerald" />
              <StatusPill label="Archived" color="red" />
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              9. PAYWALL TIERS
          ═══════════════════════════════════════════════ */}
          <Section title="Paywall Tiers" icon={Star} color="bg-[#C2A392]" />

          <Card>
            <CardHeader>
              <Label>Tier Selector Cards</Label>
              <Meta>Interactive tier picker from paywall modal</Meta>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { name: "Echoes", price: "Free", desc: "50 echoes/mo · Basic chat · 1 persona", active: true },
                  { name: "Voice", price: "$8/mo", desc: "Voice messages · 3 personas · Priority distillation", active: false },
                  { name: "Presence", price: "$20/mo", desc: "Unlimited personas · Proactive chat · Early access", active: false },
                ].map((tier) => (
                  <Card
                    key={tier.name}
                    className={cn(
                      "cursor-pointer text-center",
                      tier.active
                        ? "border-[#C2A392] bg-[#C2A392]/5 ring-1 ring-[#C2A392]/30"
                        : "hover:border-[#C2A392]/30"
                    )}
                  >
                    <CardContent className="flex flex-col items-center gap-3 py-6">
                      <span className="text-[10px] font-bold text-[#C2A392] dark:text-[#D4B8A8] uppercase tracking-widest bg-[#C2A392]/10 px-3 py-1 rounded-full">
                        {tier.name}
                      </span>
                      <p className="text-2xl font-bold font-mono">{tier.price}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{tier.desc}</p>
                      {tier.active && (
                        <span className="text-[10px] text-[#90AA9B] font-bold uppercase tracking-widest flex items-center gap-1">
                          <Check size={12} /> Current
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              10. PERSONA VAULT METRICS
          ═══════════════════════════════════════════════ */}
          <Section title="Persona Vault" icon={Brain} color="bg-violet-400" />

          <Card className="border-[#C2A392]/20 bg-[#C2A392]/[0.03]" hover>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Database size={16} className="text-[#C2A392] dark:text-[#D4B8A8]" />
                <h3 className="font-serif text-lg font-bold">Persona Vault · Metrics</h3>
              </div>
              <Meta>Everything stored for this persona</Meta>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Image, label: "Photos", value: "24", color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
                  { icon: FileText, label: "Texts", value: "1,247", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                  { icon: Brain, label: "Vectors", value: "8,192", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
                  { icon: Cpu, label: "Brain Map", value: "98%", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                ].map((stat) => (
                  <div key={stat.label} className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl text-center", stat.bg)}>
                    <stat.icon size={20} className={stat.color} />
                    <div>
                      <p className="text-2xl font-bold font-mono tabular-nums">{stat.value}</p>
                      <Meta>{stat.label}</Meta>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#F5F0EB] dark:bg-white/5">
                  <div className="flex items-center gap-2"><Clock size={14} className="text-stone-400" /><Meta>Last Active</Meta></div>
                  <p className="text-sm font-medium">April 30, 2026 · 14:32 UTC</p>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#F5F0EB] dark:bg-white/5">
                  <div className="flex items-center gap-2"><MessageSquare size={14} className="text-stone-400" /><Meta>Messages</Meta></div>
                  <p className="text-sm font-medium">342 total · 28 this week</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <ProgressBar value={98} label="Brain Mapping Completeness" size="sm" fillClassName="bg-gradient-to-r from-amber-400 to-amber-500" />
                <ProgressBar value={72} label="Vector Index Coverage" size="sm" fillClassName="bg-gradient-to-r from-violet-400 to-violet-500" />
                <ProgressBar value={45} label="Memory Node Density" size="sm" fillClassName="bg-gradient-to-r from-[#90AA9B] to-[#A3B8A8]" />
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              11. AVATAR UPLOAD
          ═══════════════════════════════════════════════ */}
          <Section title="Avatar Upload" icon={Camera} color="bg-rose-400" />

          <Card>
            <CardHeader>
              <Label>Avatar Zone (Manage Page)</Label>
              <Meta>Tap-to-change · Circular · Hover overlay</Meta>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <button className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200/60 dark:border-white/5 hover:border-[#C2A392]/50 transition-all duration-300 bg-[#F5F0EB] dark:bg-white/5 flex items-center justify-center group">
                <Users size={28} className="text-stone-400 group-hover:text-[#C2A392] dark:group-hover:text-[#D4B8A8] transition-colors" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </button>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Tap to add photo</p>
                <Meta>Square images work best</Meta>
              </div>
            </CardContent>
          </Card>

          {/* ═══════════════════════════════════════════════
              12. EMPTY STATE
          ═══════════════════════════════════════════════ */}
          <Section title="Empty State" icon={HelpCircle} color="bg-stone-400" />

          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-10">
              <div className="w-16 h-16 rounded-full bg-[#C2A392]/10 flex items-center justify-center">
                <Sparkles size={28} className="text-[#C2A392] dark:text-[#D4B8A8]" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-lg font-bold mb-1">No personas yet</h3>
                <Meta>Distill a loved one to begin</Meta>
              </div>
              <Button size="md">
                <Plus size={16} /> Create First Persona
              </Button>
            </CardContent>
          </Card>

          {/* ── Footer ──────────────────────────────────── */}
          <footer className="text-center text-xs text-stone-400 pt-8 border-t border-stone-200/60 dark:border-white/5 flex flex-col gap-1 pb-8">
            <p className="font-serif text-sm text-stone-500 dark:text-stone-400">Moms&amp;Pops · The Liquid Archive</p>
            <p>Phase 4.1 · All workflow features mapped · Dark &amp; Light ready</p>
          </footer>
        </div>
      </div>
  );
}

/* ═════════════════════════════════════════════════════════
   INTERNAL HELPERS
   ═════════════════════════════════════════════════════════ */

function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

function Section({
  title,
  icon: Icon,
  color,
}: {
  title: string;
  icon: typeof Star;
  color: string;
}) {
  return (
    <h2 className="text-xl font-serif font-bold border-b border-stone-200/60 dark:border-white/5 pb-2 flex items-center gap-2 mt-2">
      <span className={cn("w-1.5 h-5 rounded-full inline-block flex-shrink-0", color)} />
      {title}
    </h2>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
      {children}
    </h3>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-stone-400 dark:text-stone-500">{children}</p>;
}

function BodyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{children}</p>;
}

function Divider() {
  return <span className="w-px h-8 bg-stone-200/60 dark:bg-white/5 mx-1.5" />;
}

function ToggleRow({
  label,
  meta,
  enabled,
  onChange,
}: {
  label: string;
  meta: string;
  enabled: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <Meta>{meta}</Meta>
      </div>
      <button
        onClick={() => onChange?.(!enabled)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-300",
          enabled ? "bg-[#C2A392] dark:bg-[#D4B8A8]" : "bg-stone-200 dark:bg-stone-700"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300",
            enabled ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function StatusPill({
  label,
  color,
  pulse,
}: {
  label: string;
  color: "stone" | "amber" | "emerald" | "red";
  pulse?: boolean;
}) {
  const colors = {
    stone: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
        colors[color],
        pulse && "animate-pulse"
      )}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}
