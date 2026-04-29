"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import UnsavedModal from "@/components/UnsavedModal";

function ToggleRow({ id, label, description, checked, onChange }: {
  id: string; label: string; description?: string; checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between px-1">
      <div className="flex-1 pr-4">
        <label htmlFor={id} className="text-sm font-medium text-primary block cursor-pointer">{label}</label>
        {description && <p className="text-xs text-secondary mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-rose transition-colors duration-300 mt-0.5 ${checked ? "bg-charcoal dark:bg-base" : "bg-stone-300 dark:bg-stone-600"}`}
        role="switch" aria-checked={checked}>
        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);

  // ── Atomic selectors (never return objects) ──
  const gSpontaneous = useSettingsStore((s) => s.spontaneousMsgs);
  const gPreviews = useSettingsStore((s) => s.messagePreviews);
  const gDnd = useSettingsStore((s) => s.dndEnabled);
  const gDndStart = useSettingsStore((s) => s.dndStart);
  const gDndEnd = useSettingsStore((s) => s.dndEnd);
  const gReminders = useSettingsStore((s) => s.reminders);
  const setSpontaneous = useSettingsStore((s) => s.setSpontaneousMsgs);
  const setPreviews = useSettingsStore((s) => s.setMessagePreviews);
  const setDnd = useSettingsStore((s) => s.setDndEnabled);
  const setDndStart = useSettingsStore((s) => s.setDndStart);
  const setDndEnd = useSettingsStore((s) => s.setDndEnd);
  const setReminders = useSettingsStore((s) => s.setReminders);

  const [spontaneous, setSpontaneousL] = useState(gSpontaneous);
  const [previews, setPreviewsL] = useState(gPreviews);
  const [dnd, setDndL] = useState(gDnd);
  const [dndStart, setDndStartL] = useState(gDndStart);
  const [dndEnd, setDndEndL] = useState(gDndEnd);
  const [reminders, setRemindersL] = useState(gReminders);

  useEffect(() => setMounted(true), []);

  const isDirty =
    spontaneous !== gSpontaneous || previews !== gPreviews ||
    dnd !== gDnd || dndStart !== gDndStart || dndEnd !== gDndEnd ||
    reminders !== gReminders;

  const handleSave = () => {
    setSpontaneous(spontaneous); setPreviews(previews); setDnd(dnd);
    setDndStart(dndStart); setDndEnd(dndEnd); setReminders(reminders);
    router.back();
  };
  const handleBack = () => { if (isDirty) setShowUnsaved(true); else router.back(); };
  const handleDiscard = () => {
    setSpontaneousL(gSpontaneous); setPreviewsL(gPreviews); setDndL(gDnd);
    setDndStartL(gDndStart); setDndEndL(gDndEnd); setRemindersL(gReminders);
    setShowUnsaved(false); router.back();
  };
  const handleSpontaneous = (on: boolean) => {
    setSpontaneousL(on);
    if (on && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-header border-b border-subtle shadow-sm sticky top-0 z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button aria-label="Go back" onClick={handleBack}
            className="absolute left-4 flex items-center justify-center p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">Notifications</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6 animate-fade-in-up">
        <section className="bg-surface rounded-3xl p-5 border border-subtle shadow-sm">
          <h2 className="text-base font-medium text-primary mb-4 px-1">Connection</h2>
          <div className="space-y-4">
            <ToggleRow id="spontaneous" label="Spontaneous Messages" description="Allow personas to reach out when they are thinking of you." checked={spontaneous} onChange={handleSpontaneous} />
            <div className="h-px bg-subtle/50 w-full" />
            <ToggleRow id="previews" label="Message Previews" description="Show message contents on your lock screen." checked={previews} onChange={setPreviewsL} />
          </div>
        </section>
        <section className="bg-surface rounded-3xl p-5 border border-subtle shadow-sm">
          <h2 className="text-base font-medium text-primary mb-4 px-1">Quiet Hours</h2>
          <div className="space-y-4">
            <ToggleRow id="dnd" label="Do Not Disturb" checked={dnd} onChange={setDndL} />
            <div className="flex gap-3 px-1 pt-1">
              <div className="flex-1 bg-stone-50 dark:bg-stone-800 rounded-xl p-3 border border-subtle/50">
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">From</label>
                <input className="w-full bg-transparent border-none p-0 text-sm text-primary focus:ring-0 cursor-pointer dark:[color-scheme:dark]" type="time" value={dndStart} onChange={(e) => setDndStartL(e.target.value)} />
              </div>
              <div className="flex-1 bg-stone-50 dark:bg-stone-800 rounded-xl p-3 border border-subtle/50">
                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">To</label>
                <input className="w-full bg-transparent border-none p-0 text-sm text-primary focus:ring-0 cursor-pointer dark:[color-scheme:dark]" type="time" value={dndEnd} onChange={(e) => setDndEndL(e.target.value)} />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-surface rounded-3xl p-5 border border-subtle shadow-sm">
          <ToggleRow id="reminders" label="Weekly Journal Reminders" checked={reminders} onChange={setRemindersL} />
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