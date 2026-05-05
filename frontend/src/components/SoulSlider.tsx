"use client";

import { cn } from "@/lib/utils";
import type { SpectrumDial } from "@/lib/sliderDefinitions";
import { getFeedbackText } from "@/lib/sliderDefinitions";

interface SoulSliderProps {
  dial: SpectrumDial;
  value: number; // 0-100
  onChange: (value: number) => void;
  className?: string;
}

export function SoulSlider({ dial, value, onChange, className }: SoulSliderProps) {
  const feedback = getFeedbackText(dial, value);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
          {dial.label}
        </span>
        {dial.isQuirk && (
          <span className="text-[9px] text-rose/70 font-medium bg-rose/10 px-2 py-0.5 rounded-full">
            Quirk
          </span>
        )}
      </div>

      {/* Slider track */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            bg-stone-200 dark:bg-white/10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#C2A392]
            [&::-webkit-slider-thumb]:dark:border-[#D4B8A8]
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:shadow-lg"
          style={{
            background: `linear-gradient(to right, 
              rgb(194, 163, 146) 0%, 
              rgb(194, 163, 146) ${value}%, 
              transparent ${value}%)`,
          }}
        />
      </div>

      {/* Anchors */}
      <div className="flex items-center justify-between text-[10px] text-secondary/60">
        <span>{dial.leftAnchor}</span>
        <span>{dial.rightAnchor}</span>
      </div>

      {/* Dynamic feedback */}
      <p className="text-xs text-rose italic text-center min-h-[2rem] transition-all duration-300">
        {feedback}
      </p>
    </div>
  );
}
