"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Sparkles, User, MessageSquare, Sliders, Mic, FileText } from "lucide-react";
import type { DistillationState } from "@/lib/distillationState";

interface DensityMeterProps {
  density: number;
  state: DistillationState;
  hasVoice: boolean;
  hasArchives: boolean;
}

const STAGES = [
  { key: "identity", icon: User, label: "Identity", threshold: 10 },
  { key: "interview", icon: MessageSquare, label: "Interview", threshold: 30 },
  { key: "sliders", icon: Sliders, label: "Sliders", threshold: 40 },
  { key: "voice", icon: Mic, label: "Voice Story", threshold: 70 },
  { key: "archives", icon: FileText, label: "Archives", threshold: 99 },
] as const;

export function DensityMeter({ density, state, hasVoice, hasArchives }: DensityMeterProps) {
  const isComplete = density >= 99;

  // Determine which stage is "active" (the one the user is currently building)
  const activeStage = (() => {
    if (!state.identity.name) return "identity";
    if (state.qa_calibration.length < 5) return "interview";
    const sliderSum = Object.values(state.slider_metrics).reduce((a, b) => a + b, 0);
    if (sliderSum === 250) return "sliders"; // all at default
    if (!hasVoice) return "voice";
    if (!hasArchives) return "archives";
    return "review";
  })();

  // Fill color based on density
  const fillClass = (() => {
    if (density < 20) return "bg-gradient-to-r from-stone-400 to-stone-500";
    if (density < 40) return "bg-gradient-to-r from-sky-400 to-blue-500";
    if (density < 70) return "bg-gradient-to-r from-amber-400 to-amber-500";
    if (density < 99) return "bg-gradient-to-r from-rose-400 to-rose-500";
    return "bg-gradient-to-r from-emerald-400 to-emerald-500";
  })();

  return (
    <div className="flex flex-col gap-3">
      {/* Density bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar
            value={density}
            max={99}
            size="lg"
            fillClassName={fillClass}
            pulse={density > 0 && density < 99}
          />
        </div>
        <span className="text-sm font-mono tabular-nums font-bold text-primary min-w-[3ch] text-right">
          {density}%
        </span>
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isComplete ? (
            <>
              <Sparkles size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                Ready to distill
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                Soul Density
              </span>
              <span className="text-[10px] text-secondary/50">
                — {density < 30 ? "minimal" : density < 60 ? "growing" : "rich"} profile
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex gap-1.5">
        {STAGES.map((stage) => {
          const reached = density >= stage.threshold;
          const isActive = activeStage === stage.key;
          return (
            <div
              key={stage.key}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                reached
                  ? isActive
                    ? "bg-rose"
                    : "bg-rose/30"
                  : "bg-stone-200 dark:bg-white/10"
              }`}
              title={`${stage.label}: ${reached ? "complete" : "pending"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
