import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface SectionHeadingProps {
  pill?: string;
  pillVariant?: "default" | "secondary" | "navy" | "accent" | "demo";
  title: string;
  highlightText?: string;
  description?: string;
  align?: "left" | "center" | "split";
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  dark?: boolean;
}

export function SectionHeading({
  pill,
  pillVariant = "secondary",
  title,
  highlightText,
  description,
  align = "left",
  action,
  className,
  titleClassName,
  dark = true,
}: SectionHeadingProps) {
  const content = (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "max-w-2xl",
        align === "split" && "max-w-2xl"
      )}
    >
      {pill && (
        <div>
          <Badge variant={pillVariant} className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            {pill}
          </Badge>
        </div>
      )}
      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight",
          dark ? "text-white" : "text-[#0a192f]",
          titleClassName
        )}
      >
        {title}{" "}
        {highlightText && (
          <span className="text-blue-400 font-extrabold">
            {highlightText}
          </span>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed",
            dark ? "text-slate-300" : "text-slate-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (align === "split") {
    return (
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12",
          className
        )}
      >
        {content}
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className={cn("mb-12", align === "center" && "flex flex-col items-center", className)}>
      {content}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
