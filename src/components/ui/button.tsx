import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "~/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

export function Button({ className, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-400 px-5 text-sm font-bold text-slate-950 transition-colors hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
