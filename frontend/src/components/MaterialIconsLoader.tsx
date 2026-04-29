"use client";

import { useEffect } from "react";

/**
 * Injects the Material Symbols font stylesheet into the document head.
 * Done client-side to avoid SSR/hydration conflicts with Next.js auto-generated <head>.
 */
export default function MaterialIconsLoader() {
  useEffect(() => {
    if (document.querySelector('link[href*="Material+Symbols"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";
    document.head.appendChild(link);
  }, []);

  return null;
}
