"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  color?: "blue" | "emerald" | "amber" | "indigo";
  className?: string;
}

export function AnimatedProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  color = "blue",
  className,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorMap = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    indigo: "bg-[#0a192f]",
  };

  return (
    <div ref={ref} className={cn("w-full space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-semibold text-slate-700">{label}</span>}
          {showPercentage && (
            <span className="font-mono font-bold text-slate-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <motion.div
          className={cn("h-full rounded-full", colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: isInView || shouldReduceMotion ? `${percentage}%` : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {sublabel && (
        <p className="text-[11px] text-slate-400 font-medium">{sublabel}</p>
      )}
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: "blue" | "emerald" | "amber";
  className?: string;
}

export function AnimatedProgressRing({
  value,
  max = 100,
  size = 88,
  strokeWidth = 8,
  label,
  sublabel,
  color = "blue",
  className,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColorMap = {
    blue: "#2563eb",
    emerald: "#059669",
    amber: "#d97706",
  };

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex flex-col items-center justify-center", className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Animated Value Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColorMap[color]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: isInView || shouldReduceMotion ? strokeDashoffset : circumference,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-bold text-slate-900 font-mono leading-tight">
            {Math.round(percentage)}%
          </span>
          {sublabel && (
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold text-slate-700 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
