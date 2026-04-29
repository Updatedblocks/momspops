"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import UnsavedModal from "@/components/UnsavedModal";

export default function EditProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);

  // ── Atomic selectors ──
  const gFullName = useSettingsStore((s) => s.profile.fullName);
  const gDisplayName = useSettingsStore((s) => s.profile.displayName);
  const gEmail = useSettingsStore((s) => s.profile.email);
  const gAvatarUrl = useSettingsStore((s) => s.profile.avatarUrl);
  const gBio = useSettingsStore((s) => s.profile.bio);
  const gEchoBalance = useSettingsStore((s) => s.profile.echo_balance);
  const gTier = useSettingsStore((s) => s.profile.tier);
  const setProfile = useSettingsStore((s) => s.setProfile);

  const [fullName, setFullName] = useState(gFullName);
  const [displayName, setDisplayName] = useState(gDisplayName);
  const [email, setEmail] = useState(gEmail);
  const [avatarUrl] = useState(gAvatarUrl);
  const [bio, setBio] = useState(gBio);

  useEffect(() => setMounted(true), []);

  const isDirty = fullName !== gFullName || displayName !== gDisplayName || email !== gEmail || bio !== gBio;

  const handleSave = () => {
    setProfile({ fullName, displayName, email, avatarUrl, bio, echo_balance: gEchoBalance, tier: gTier });
    router.back();
  };
  const handleBack = () => { if (isDirty) setShowUnsaved(true); else router.back(); };
  const handleDiscard = () => {
    setFullName(gFullName); setDisplayName(gDisplayName); setEmail(gEmail); setBio(gBio);
    setShowUnsaved(false); router.back();
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-header sticky top-0 border-b border-subtle shadow-sm z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button aria-label="Go back" onClick={handleBack}
            className="absolute left-4 flex items-center justify-center p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-300 btn-press">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">Edit Profile</h1>
        </div>
      </header>

      <main className="flex-grow pt-8 px-6 pb-4 max-w-2xl mx-auto w-full flex flex-col items-center animate-fade-in-up">
        <div className="relative mb-10">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-sm border-2 border-surface">
            {avatarUrl ? (
              <img alt="Profile" className="w-full h-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary text-5xl">
                person
              </span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-surface text-primary rounded-full p-2 shadow-md border border-subtle hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors btn-press">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
          </button>
        </div>

        <form className="w-full max-w-md space-y-8" onSubmit={(e) => e.preventDefault()}>
          {[
            { id: "fullName", label: "Full Name", val: fullName, set: setFullName },
            { id: "displayName", label: "Display Name", val: displayName, set: setDisplayName },
            { id: "emailAddress", label: "Email Address", val: email, set: setEmail, type: "email" },
          ].map((f) => (
            <div key={f.id} className="flex flex-col space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary" htmlFor={f.id}>{f.label}</label>
              <input className="w-full bg-transparent border-0 border-b border-subtle focus:border-rose focus:ring-0 px-0 py-2 text-lg text-primary placeholder-secondary transition-colors"
                id={f.id} type={f.type ?? "text"} value={f.val} onChange={(e) => f.set(e.target.value)} />
            </div>
          ))}
          <div className="flex flex-col space-y-2 pt-4">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary" htmlFor="bio">A few words about you</label>
            <textarea className="w-full bg-transparent border-0 border-b border-subtle focus:border-rose focus:ring-0 px-0 py-2 text-base text-primary placeholder-secondary transition-colors resize-none"
              id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </form>

        <button onClick={handleSave}
          className="w-full max-w-md mt-8 py-3 rounded-full font-bold transition-all bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 btn-press">
          Save
        </button>
      </main>

      <UnsavedModal isOpen={showUnsaved} onSave={() => { setShowUnsaved(false); handleSave(); }} onDiscard={handleDiscard} />
    </div>
  );
}