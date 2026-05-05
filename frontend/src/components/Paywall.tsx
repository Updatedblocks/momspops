"use client";

import { useEffect, useState } from "react";

interface PaywallProps {
  open: boolean;
  onClose: () => void;
}

const TIERS = [
  {
    name: "Echoes",
    price: "$9",
    tagline: "Begin preserving",
    features: [
      "AI-powered chat with 1 persona",
      "Full distillation wizard",
      "Chat history & memory",
      "Text-based legacy building",
    ],
    accent: "from-sand/20 to-sand/5",
    border: "border-sand/30 hover:border-sand/60",
    glow: "hover:shadow-sand/15",
    icon: "edit_note",
  },
  {
    name: "Voice",
    price: "$19",
    tagline: "Hear them again",
    popular: true,
    features: [
      "Everything in Echoes",
      "3 personas / loved ones",
      "Voice tone calibration",
      "Priority AI responses",
      "Early access to audio features",
    ],
    accent: "from-rose/20 to-rose/5",
    border: "border-rose/40 hover:border-rose/70",
    glow: "hover:shadow-rose/20",
    icon: "mic",
  },
  {
    name: "Presence",
    price: "$39",
    tagline: "The complete archive",
    features: [
      "Everything in Voice",
      "Unlimited personas",
      "Dedicated family vault",
      "Photo & video memories",
      "Priority legacy access",
      "Founding member badge",
    ],
    accent: "from-sage/20 to-sage/5",
    border: "border-sage/30 hover:border-sage/60",
    glow: "hover:shadow-sage/15",
    icon: "auto_awesome",
  },
];

export default function Paywall({ open, onClose }: PaywallProps) {
  const [selectedTier, setSelectedTier] = useState(1);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setSelectedTier(1);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* ── Close button — OUTSIDE the card, always clickable ── */}
      <button
        onClick={onClose}
        className="fixed right-8 top-10 z-[110] w-10 h-10 rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/60 hover:border-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 shadow-lg"
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      {/* ── Backdrop tap target ── */}
      <div className="flex min-h-screen items-start justify-center p-4 pb-32" onClick={onClose}>
        <div
          className="relative w-full max-w-4xl rounded-3xl bg-base p-6 sm:p-8 shadow-2xl my-4 animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-gradient-to-b from-rose/8 to-transparent rounded-full blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-rose/70 mb-3">
              <span className="block w-6 h-px bg-rose/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Choose your chapter</span>
              <span className="block w-6 h-px bg-rose/40" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-primary tracking-tight mb-2">
              An Invitation
            </h2>
            <p className="text-sm text-secondary max-w-sm mx-auto leading-relaxed">
              Every family has a story worth preserving. Choose the plan that best honors yours.
            </p>
          </div>

          {/* Tiers */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center mb-8 relative z-10">
            {TIERS.map((tier, i) => {
              const isSelected = selectedTier === i;
              return (
                <button
                  key={tier.name}
                  onClick={() => setSelectedTier(i)}
                  className={`flex-1 rounded-3xl p-6 flex flex-col text-left relative overflow-hidden
                    transition-all duration-500 ease-out cursor-pointer group
                    animate-fade-in-up stagger-${i + 1}
                    ${isSelected
                      ? `bg-surface border-2 ${tier.border} shadow-lg ${tier.glow} shadow-xl -translate-y-1 md:hover:-translate-y-1.5 md:hover:shadow-2xl`
                      : "bg-surface/60 border border-subtle/40 shadow-sm md:hover:shadow-lg md:hover:-translate-y-1 md:hover:scale-[1.02] md:hover:border-rose/30"
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${tier.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`} />

                  {tier.popular && (
                    <span className="relative z-10 inline-block px-3 py-1 bg-rose/10 text-rose rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 self-start border border-rose/20">
                      ✦ Most Popular
                    </span>
                  )}

                  <div className="relative z-10 flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isSelected ? "bg-rose/10 text-rose scale-110" : "bg-surface-high text-secondary group-hover:text-primary group-hover:scale-105"
                    }`}>
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {tier.icon}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-wider uppercase text-secondary block">{tier.name}</span>
                      <span className="text-[11px] text-secondary/70 italic">{tier.tagline}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-baseline gap-1 mb-4">
                    <span className={`text-4xl font-serif transition-colors duration-300 ${isSelected ? "text-primary" : "text-primary/80"}`}>
                      {tier.price}
                    </span>
                    <span className="text-xs text-secondary">/month</span>
                  </div>

                  <div className={`relative z-10 w-full h-px mb-4 transition-all duration-500 ${
                    isSelected ? "bg-gradient-to-r from-transparent via-rose/30 to-transparent" : "bg-subtle/60"
                  }`} />

                  <ul className="relative z-10 flex flex-col gap-2.5 mt-auto">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <span className={`material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                          isSelected ? "text-rose" : "text-secondary/50 group-hover:text-secondary"
                        }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span className={`transition-colors duration-300 ${isSelected ? "text-primary" : "text-secondary"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ${
                    isSelected ? "bg-gradient-to-r from-transparent via-rose/50 to-transparent opacity-100" : "opacity-0"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center flex flex-col items-center gap-3 relative z-10 animate-fade-in-up stagger-4">
            <button className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium transition-all duration-300 shadow-sm btn-press hover:shadow-lg hover:gap-3">
              <span>Begin with {TIERS[selectedTier].name}</span>
              <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </button>
            <p className="text-[11px] text-secondary/60 mt-1">Cancel anytime · No commitments</p>
            <div className="mt-4 px-4 py-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 max-w-md">
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed text-center">
                <span className="font-bold">Early Access —</span> Features above are in active development and depend on the success of our launch. 
                Pricing reflects our pre-scale phase and will increase as we grow. By subscribing now, you are directly fueling the infra, training, and stress testing that make this possible.
              </p>
            </div>
            <button className="text-xs text-secondary hover:text-primary transition-colors duration-200 underline underline-offset-4 mt-1">
              Restore Purchases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
