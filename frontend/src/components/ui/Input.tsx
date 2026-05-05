import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border px-4 py-3 text-sm",
        "bg-stone-50 dark:bg-white/5",
        "border-stone-200 dark:border-white/10",
        "text-stone-900 dark:text-stone-100",
        "placeholder:text-stone-400 dark:placeholder:text-secondary/50",
        "focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose/30",
        "transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
