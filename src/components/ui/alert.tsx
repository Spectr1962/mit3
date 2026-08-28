import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      className={cn(
        "relative w-full rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100",
        className,
      )}
      {...props}
    />
  );
}
