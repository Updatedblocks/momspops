"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold/40 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[#C2A392] text-white hover:bg-[#B89987] dark:bg-[#D4B8A8] dark:text-[#1A1918] dark:hover:bg-[#C9AA98] shadow-sm",
        secondary:
          "bg-[#C2A392]/10 text-[#8B7355] hover:bg-[#C2A392]/20 dark:bg-[#D4B8A8]/10 dark:text-[#D4B8A8] dark:hover:bg-[#D4B8A8]/20",
        ghost:
          "bg-transparent text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-200",
        outline:
          "border-2 border-stone-200/60 dark:border-white/5 bg-transparent text-stone-600 dark:text-stone-300 hover:border-[#C2A392]/40 hover:text-[#C2A392] dark:hover:text-[#D4B8A8]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
