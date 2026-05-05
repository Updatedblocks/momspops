"use client";

import { useState, useMemo } from "react";
import { SoulSlider } from "@/components/SoulSlider";
import { CORE_DIALS, pickQuirkDials } from "@/lib/sliderDefinitions";
import type { SpectrumDial } from "@/lib/sliderDefinitions";
import type { SliderMetrics } from "@/lib/distillationState";

interface SlidersStepProps {
  metrics: SliderMetrics;
  onChange: (metrics: Partial<SliderMetrics>) => void;
}

export function SlidersStep({ metrics, onChange }: SlidersStepProps) {
  // Pick quirks once, stable for the session
  const [quirks] = useState<SpectrumDial[]>(() => pickQuirkDials());

  // Map dial id to the correct value getter
  const getValue = (dial: SpectrumDial): number => {
    switch (dial.field) {
      case "outlook": return metrics.outlook;
      case "affection": return metrics.affection;
      case "formality": return metrics.formality;
      case "vulnerability":
        if (dial.id === metrics.quirk1_id) return metrics.quirk1_value;
        if (dial.id === metrics.quirk2_id) return metrics.quirk2_value;
        return 50;
      case "advice":
        if (dial.id === metrics.quirk1_id) return metrics.quirk1_value;
        if (dial.id === metrics.quirk2_id) return metrics.quirk2_value;
        return 50;
      default: return 50;
    }
  };

  // Map dial id to the correct onChange handler
  const makeOnChange = (dial: SpectrumDial) => (value: number) => {
    // Core dials
    if (dial.field === "outlook") onChange({ outlook: value });
    else if (dial.field === "affection") onChange({ affection: value });
    else if (dial.field === "formality") onChange({ formality: value });
    // Quirk dials
    else if (metrics.quirk1_id === dial.id) onChange({ quirk1_id: dial.id, quirk1_value: value });
    else if (metrics.quirk2_id === dial.id) onChange({ quirk2_id: dial.id, quirk2_value: value });
    // First quirk slot not filled
    else if (!metrics.quirk1_id) onChange({ quirk1_id: dial.id, quirk1_value: value });
    // Second quirk slot
    else if (!metrics.quirk2_id) onChange({ quirk2_id: dial.id, quirk2_value: value });
  };

  const allDials = useMemo(() => [...CORE_DIALS, ...quirks], [quirks]);

  return (
    <div className="flex flex-col gap-8">
      {allDials.map((dial) => (
        <SoulSlider
          key={dial.id}
          dial={dial}
          value={getValue(dial)}
          onChange={makeOnChange(dial)}
        />
      ))}
    </div>
  );
}
