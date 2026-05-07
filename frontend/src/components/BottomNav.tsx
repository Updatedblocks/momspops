"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/library", icon: "menu_book", label: "Library" },
  { href: "/distill", icon: "auto_fix_high", label: "Distill" },
  { href: "/settings", icon: "settings", label: "Settings" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-base/85 backdrop-blur-xl border-t border-subtle/60 z-50 pb-safe pt-2">
      <div className="flex justify-around items-center px-4 pb-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-200 group btn-press ${
                isActive
                  ? "text-primary"
                  : "text-secondary hover:text-secondary"
              }`}
            >
              <span
                className={`material-symbols-outlined mb-0.5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110 group-active:scale-95"}`}
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-serif text-[10px] tracking-wider font-label-caps">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}