import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  as?: React.ElementType;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

export function SectionContainer({
  id,
  as: Component = "section",
  className,
  containerClassName,
  fullWidth = false,
  children,
  ...props
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn("py-16 md:py-24 relative overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "w-full px-4 sm:px-6 lg:px-8 mx-auto",
          fullWidth ? "max-w-7xl" : "max-w-7xl",
          containerClassName
        )}
      >
        {children}
      </div>
    </Component>
  );
}
