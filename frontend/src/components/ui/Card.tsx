import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Add a subtle hover lift effect */
  hover?: boolean;
}

export function Card({ className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border bg-white dark:bg-white/5",
        "border-stone-200 dark:border-white/5",
        "p-6 sm:p-8",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-rose/30 hover:shadow-lg hover:shadow-rose-500/5",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 mb-5", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
