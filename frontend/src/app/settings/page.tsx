"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Paywall from "@/components/Paywall";
import { createClient } from "@/utils/supabase/client";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function SettingsPage() {
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);
  const clearAuth = useSettingsStore((s) => s.clearAuth);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearAuth();
    router.push("/");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="bg-header sticky top-0 border-b border-subtle/60 shadow-[0_2px_10px_-3px_rgba(196,154,154,0.1)] z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            Settings
          </h1>
          <div className="absolute right-4 w-8 h-8 rounded-full overflow-hidden bg-surface border border-subtle/60 flex-shrink-0">
            {avatarUrl ? (
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary text-lg">
                person
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 py-5 flex flex-col gap-1 animate-fade-in-up">
        {/* Account */}
        <button
          onClick={() => setAccountOpen(!accountOpen)}
          className="flex items-center justify-between w-full py-3 btn-press rounded-xl px-2"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">
            Account
          </h3>
          <span
            className={`material-symbols-outlined text-secondary/60 text-lg transition-transform duration-200 ${
              accountOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {accountOpen && (
          <div className="bg-surface rounded-2xl p-5 border border-subtle/60 shadow-sm flex flex-col gap-4 mb-2 animate-slide-down">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-0.5">
                  Profile Information
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Update your name, email, and persona details.
                </p>
              </div>
              <Link href="/settings/profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-surface text-primary border border-subtle shadow-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press">
                Edit <span className="material-symbols-outlined text-sm">edit</span>
              </Link>
            </div>
            <div className="w-full h-px bg-header" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-0.5">
                  Subscription Tier
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Currently on the{" "}
                  <span className="font-medium text-primary">Legacy Plan</span>.
                </p>
              </div>
              <button
                onClick={() => setPaywallOpen(true)}
                className="bg-sand text-primary rounded-full px-6 py-2 font-label-caps text-label-caps hover:opacity-80 transition-all btn-press"
              >
                Manage
              </button>
            </div>
          </div>
        )}

        {/* Privacy */}
        <button
          onClick={() => setPrivacyOpen(!privacyOpen)}
          className="flex items-center justify-between w-full py-3 btn-press rounded-xl px-2"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">
            Privacy
          </h3>
          <span
            className={`material-symbols-outlined text-secondary/60 text-lg transition-transform duration-200 ${
              privacyOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {privacyOpen && (
          <div className="bg-surface rounded-2xl p-5 border border-subtle/60 shadow-sm flex flex-col gap-4 mb-2 animate-slide-down">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-0.5">
                  Data Export
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Download a complete archive of your journal entries and memories.
                </p>
              </div>
              <Link href="/settings/export" className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-surface text-primary border border-subtle shadow-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press">
                <span className="material-symbols-outlined text-sm">download</span>{" "}
                Export
              </Link>
            </div>
            <div className="w-full h-px bg-header" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-body-lg text-body-lg text-error mb-1">
                  Memory Deletion
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Permanently erase specific memories or your entire vault.
                </p>
              </div>
              <Link href="/settings/delete" className="text-red-700 dark:text-red-400 font-label-caps text-label-caps border border-red-200 dark:border-red-900/50 rounded-full px-6 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors btn-press">
                Delete
              </Link>
            </div>
          </div>
        )}

        {/* Appearance */}
        <button
          onClick={() => setAppearanceOpen(!appearanceOpen)}
          className="flex items-center justify-between w-full py-3 btn-press rounded-xl px-2"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">
            Appearance
          </h3>
          <span
            className={`material-symbols-outlined text-secondary/60 text-lg transition-transform duration-200 ${
              appearanceOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {appearanceOpen && (
          <div className="bg-surface rounded-2xl p-5 border border-subtle/60 shadow-sm mb-2 animate-slide-down">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-0.5">
                  Display &amp; Theme
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Customize themes, text sizes, and ambient motion.
                </p>
              </div>
              <Link href="/settings/appearance" className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-surface text-primary border border-subtle shadow-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press">
                Customize <span className="material-symbols-outlined text-sm">palette</span>
              </Link>
            </div>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="flex items-center justify-between w-full py-3 btn-press rounded-xl px-2"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">
            Notifications
          </h3>
          <span
            className={`material-symbols-outlined text-secondary/60 text-lg transition-transform duration-200 ${
              notificationsOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {notificationsOpen && (
          <div className="bg-surface rounded-2xl p-5 border border-subtle/60 shadow-sm mb-2 animate-slide-down">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-primary mb-0.5">
                  Alerts &amp; Quiet Hours
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Manage spontaneous messages, previews, and quiet hours.
                </p>
              </div>
              <Link href="/settings/notifications" className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-surface text-primary border border-subtle shadow-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press">
                Preferences <span className="material-symbols-outlined text-sm">notifications</span>
              </Link>
            </div>
          </div>
        )}

        {/* Legal */}
        <button
          onClick={() => setLegalOpen(!legalOpen)}
          className="flex items-center justify-between w-full py-3 btn-press rounded-xl px-2"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">
            Legal
          </h3>
          <span
            className={`material-symbols-outlined text-secondary/60 text-lg transition-transform duration-200 ${
              legalOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {legalOpen && (
          <div className="bg-surface rounded-2xl p-5 border border-subtle/60 shadow-sm flex flex-col gap-4 mb-2 animate-slide-down">
            {["Terms of Service", "Privacy Manifesto", "Data Ethics Policy"].map(
              (item) => (
                <div key={item}>
                  <div className="group flex items-center justify-between cursor-pointer">
                    <span className="font-body-lg text-body-lg text-primary group-hover:text-rose transition-colors">
                      {item}
                    </span>
                    <span className="material-symbols-outlined text-secondary/60 group-hover:text-rose transition-colors">
                      arrow_forward_ios
                    </span>
                  </div>
                  {item !== "Data Ethics Policy" && (
                    <div className="w-full h-px bg-header mt-6" />
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Log out */}
        <div className="flex justify-center pt-6 pb-8">
          <button
            onClick={handleLogout}
            className="font-body-md text-primary-variant hover:text-error transition-colors underline underline-offset-4"
          >
            Log Out
          </button>
        </div>
      </main>

      <BottomNav />
      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}