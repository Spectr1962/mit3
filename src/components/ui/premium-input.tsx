import * as React from "react";
import { cn } from "~/lib/utils";

export interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, type, label, ...props }, ref) => (
    <div className="group relative w-full">
      <input
        ref={ref}
        type={type}
        placeholder={label}
        className={cn("peer flex h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 pb-1 pt-4 text-sm shadow-sm transition-all duration-200 placeholder:text-transparent focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300/30 disabled:cursor-not-allowed disabled:opacity-50", className)}
        {...props}
      />
      <label className="pointer-events-none absolute left-3 top-1.5 text-[10px] font-medium text-slate-400 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-sky-300">{label}</label>
    </div>
  ),
);
PremiumInput.displayName = "PremiumInput";
