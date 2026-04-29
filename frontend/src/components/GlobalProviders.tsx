"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import MaterialIconsLoader from "@/components/MaterialIconsLoader";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const textSize = useSettingsStore((s) => s.textSize);

  // ── Root rem scaling — mathematically scales every Tailwind utility ──
  useEffect(() => {
    const sizes: Record<string, string> = {
      small: "14px",
      base: "16px",
      large: "18px",
    };
    document.documentElement.style.fontSize = sizes[textSize] ?? "16px";
  }, [textSize]);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MaterialIconsLoader />
        <div className="relative z-10 max-w-md mx-auto min-h-[100dvh] bg-base shadow-2xl sm:border-x sm:border-subtle/50 overflow-x-hidden flex flex-col pb-32">
          {children}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MaterialIconsLoader />
      <div className="relative z-10 max-w-md mx-auto min-h-[100dvh] bg-base shadow-2xl sm:border-x sm:border-subtle/50 overflow-x-hidden flex flex-col pb-32">
        {children}
      </div>
    </ThemeProvider>
  );
}
