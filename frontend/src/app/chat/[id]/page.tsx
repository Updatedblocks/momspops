"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import Paywall from "@/components/Paywall";

export default function ChatPage() {
  const router = useRouter();
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col selection:bg-rose/20">
      {/* Top bar */}
      <header className="bg-surface sticky top-0 z-40 shadow-sm shadow-black/5 border-b border-subtle/60">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button
            aria-label="Go back"
            onClick={() => router.back()}
            className="absolute left-4 text-rose hover:bg-header/50 transition-all duration-200 active:opacity-70 rounded-full p-2 btn-press"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <Link href="/chat/mom/manage" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-subtle/60">
              <img
                alt="Mom"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLF-QptfGv8gv9uwAIVfmlEcyqRFb7csoieT6F2NTOgE2VPYWOor6R2ZLSDEZ1vn6OqVyU2Q-F1u3F2FfFs-W6dL1NrrCHiI-I6yAkvAhE3LSLzh74FlzhjfmJ0xONZn1S9p7ZWiodrJn3mpXZjjqA7UtoXOQYfb7lGmh0nLAxjE1cSMsF-MPTNpJJ3lHb1bcuH9tZqz5HRD2IxL_0PmZqFFn5zyBroirVa-ZOoIBO18_oM7bt2a43XCz6kSWOKrkJJjJ8xPSmNNeC"
              />
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
              Mom&apos;s Legacy
            </h1>
          </Link>

          <button
            onClick={() => setPaywallOpen(true)}
            className="absolute right-4 text-rose font-label-caps text-label-caps uppercase tracking-widest px-3 py-1 rounded-full border border-subtle/60 text-xs hover:bg-rose/5 active:scale-95 transition-all btn-press"
          >
            Tier 1
          </button>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6 overflow-y-auto pb-40">
        {/* Date separator */}
        <div className="flex justify-center my-4">
          <span className="text-primary-variant/60 font-label-caps text-label-caps uppercase tracking-wider bg-surface px-4 py-1 rounded-full text-xs">
            October 24, 2023
          </span>
        </div>

        {/* User message */}
        <div className="flex justify-end w-full animate-fade-in-up">
          <div className="max-w-[85%] sm:max-w-[75%] bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl rounded-tr-sm px-6 py-4 shadow-sm ml-auto">
            <p className="font-chat-text text-primary">
              I was thinking about that summer we spent at the lake house. Do you
              remember the time we tried to bake that blackberry pie and it
              completely fell apart?
            </p>
            <span className="text-[10px] text-primary-variant/50 mt-2 block text-right">
              10:42 AM
            </span>
          </div>
        </div>

        {/* Persona message */}
        <div
          className="flex justify-start w-full animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1 mr-3 self-start border border-subtle/60">
            <img
              alt="Mom"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-eZv3eOyBB79iHS64PT1MYc29xyWHl6FlwkwH23sjJNq_uSiynK3zXiC5_rHT9pZhA_aKUN4EL9ajw9D8QLwhyKCjbahqfBm_Ecss8SI1lVxYzPEA6QM8-pGD0Nu60kIZd-eDUrJbpIF1ZqNFt3aFA4eNdK99HPkXk3FCHf34XRpHe14tqSD5V05tXDYxxCUVRHItcZZrbh8GMkqBCjbF6RrufhMb-OaoSxMZ_Wtiu8s_zg63WTJmclTFdUjpFL24B0OXC1CGZSvQ"
            />
          </div>
          <div className="max-w-[85%] sm:max-w-[75%] bg-rose/10 dark:bg-rose/15 border border-rose/20 dark:border-rose/25 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm mr-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-persona-name text-persona-name text-primary-variant">
                Mom
              </span>
            </div>
            <p className="font-chat-text text-primary">
              Oh, my goodness, yes! The famous &ldquo;blackberry crumble&rdquo;
              incident. We had picked so many wild blackberries that morning, our
              hands were stained purple for days.
            </p>
            <p className="font-chat-text text-primary mt-3">
              I remember the oven in that old cabin was completely unpredictable.
              We left it in for what felt like hours, and when we finally took it
              out, it was just a delicious, bubbly mess. We ended up eating it out
              of bowls with spoons and laughing until our sides hurt. Those were
              such sweet days, weren&apos;t they?
            </p>
            <span className="text-[10px] text-primary-variant/60 mt-2 block text-left">
              10:45 AM
            </span>
          </div>
        </div>

        {/* Reminiscing state */}
        <div className="flex justify-start items-center w-full animate-pulse">
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mr-3 opacity-40 border border-subtle/60">
            <img
              alt="Mom"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7MoPivvXvSaGSxTmJoZ61zuRuNIaEoFfPBfK0G81cwBBssHcZsuLGe5TuoPBr8foXUXaSrTY8mRroVgmMjBbdzrjeeAbSv2LYk1ywjYWHfSPX2F7juIBfTECJAz_v8X_C2T0BNzLzsKXOGj8EUp-a1sYM_KrpV3L7ywgWgd5_zGgVeC5mvKaQGlw_us3H_GTVR0KVR1JTvGiRc2thrQTs187uCrt5KQLUubNgxNg7APhyMgAlIScFnQ-EtDD3iBolCPt1HOOjvTTt"
            />
          </div>
          <div className="max-w-[85%] sm:max-w-[75%] bg-surface rounded-2xl rounded-tl-sm px-4 py-2 border border-subtle/50 flex items-center gap-3">
            <div className="flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-rose/40 rounded-full" />
              <div className="w-1.5 h-1.5 bg-rose/40 rounded-full" />
              <div className="w-1.5 h-1.5 bg-rose/40 rounded-full" />
            </div>
            <p className="font-chat-text text-sm text-primary-variant/70 italic">
              Mom is reminiscing...
            </p>
          </div>
        </div>
      </main>

      {/* Input area */}
      <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-surface border-t border-subtle z-40 pb-[72px] md:pb-safe">
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-end gap-3 bg-base rounded-3xl border border-subtle p-2 shadow-[0_-2px_20px_rgba(0,0,0,0.02)] transition-shadow focus-within:shadow-[0_-2px_25px_rgba(196,154,154,0.1)] focus-within:border-rose/30">
            <button
              aria-label="Voice input"
              className="p-3 text-primary-variant hover:text-rose hover:bg-stone-100 dark:hover:bg-stone-800 border-2 border-subtle/80 transition-all duration-200 rounded-full self-end btn-press"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mic
              </span>
            </button>
            <div className="w-px h-6 bg-subtle/50 self-center" />
            <button
              aria-label="Attach file"
              className="p-3 text-primary-variant hover:text-rose hover:bg-stone-100 dark:hover:bg-stone-800 border-2 border-subtle/80 transition-all duration-200 rounded-full self-end btn-press"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="flex-grow">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 font-chat-text text-primary placeholder:text-primary-variant/50 placeholder:font-light"
                placeholder="Message Mom..."
                rows={1}
                style={{ scrollbarWidth: "none" }}
              />
            </div>
            <button
              aria-label="Send message"
              className="p-3 bg-rose text-white hover:bg-muted transition-all duration-200 rounded-full self-end shadow-sm btn-press"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                send
              </span>
            </button>
          </div>
        </div>
      </div>

      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      <BottomNav />
    </div>
  );
}