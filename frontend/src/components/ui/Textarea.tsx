import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-2xl border px-4 py-3 text-sm resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
