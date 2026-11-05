import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "navy"
    | "accent"
    | "success"
    | "warning"
    | "urgent"
    | "demo";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white/10 text-slate-200 border-white/15 backdrop-blur-xs",
    secondary: "bg-blue-500/20 text-blue-300 border-blue-400/30 backdrop-blur-xs",
    outline: "bg-white/5 text-slate-200 border-white/20",
    navy: "bg-slate-900/80 text-white border-white/10",
    accent: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    urgent: "bg-red-600 text-white border-red-500 font-semibold animate-pulse shadow-md shadow-red-900/50",
    demo: "bg-violet-500/20 text-violet-300 border-violet-400/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
