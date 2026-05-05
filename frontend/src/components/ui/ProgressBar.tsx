"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  fillClassName?: string;
  label?: string;
  /** Animated pulse glow while in progress */
  pulse?: boolean;
  /** Show segmented steps instead of continuous bar */
  segments?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  className,
  fillClassName,
  label,
  pulse = false,
  segments,
  size = "md",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const heightMap = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  const fillBase = fillClassName ||
    "bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-400";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400 tracking-wide">
            {label}
          </span>
          <span className="text-xs tabular-nums text-stone-500 dark:text-stone-500 font-mono">
            {Math.round(pct)}%
          </span>
        </div>
      )}

      {segments ? (
        /* ── Segmented bar ────────────────────────────── */
        <div className={cn("flex gap-1", heightMap[size])}>
          {Array.from({ length: segments }).map((_, i) => {
            const segmentPct = 100 / segments;
            const filled = pct >= (i + 1) * segmentPct;
            const partial = !filled && pct > i * segmentPct;
            const partialW = partial
              ? ((pct - i * segmentPct) / segmentPct) * 100
              : 0;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-full transition-all duration-500",
                  "bg-stone-200 dark:bg-white/10"
                )}
              >
                {(filled || partial) && (
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-700 ease-out",
                      fillBase,
                      pulse && "animate-pulse"
                    )}
                    style={{ width: filled ? "100%" : `${partialW}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Continuous bar ───────────────────────────── */
        <div
          className={cn(
            "w-full rounded-full overflow-hidden",
            "bg-stone-200 dark:bg-white/10",
            heightMap[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-700 ease-out",
              fillBase,
              pulse && "animate-pulse",
              pct > 0 && "shadow-[0_0_12px_-2px] shadow-rose-500/30"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
