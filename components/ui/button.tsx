"use client";

import * as React from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "navy" | "accent" | "white";
  size?: "sm" | "md" | "lg" | "icon";
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 border border-blue-500/80",
      navy:
        "bg-slate-900/90 text-white hover:bg-slate-800 shadow-sm border border-white/10",
      secondary:
        "bg-white/10 text-slate-100 hover:bg-white/20 border border-white/15 backdrop-blur-sm",
      outline:
        "border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white backdrop-blur-sm shadow-xs",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/10",
      accent:
        "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 border border-rose-500",
      white:
        "bg-white text-slate-950 hover:bg-slate-100 shadow-md font-semibold border border-white",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5 font-semibold",
      icon: "h-10 w-10 rounded-xl p-0",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      if (external) {
        return (
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {children}
          </motion.a>
        );
      }
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="inline-block"
        >
          <Link href={href} className={combinedClassName}>
            {children}
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        ref={ref}
        className={combinedClassName}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";