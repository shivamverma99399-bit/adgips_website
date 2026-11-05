"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import {
  heroContainerVariants,
  heroLineVariants,
  fadeInUp,
} from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[480px] sm:min-h-[540px] md:min-h-[600px] flex flex-col justify-between pt-3 sm:pt-4 md:pt-6 pb-6 sm:pb-8 md:pb-12 border-b border-white/10 bg-transparent">
      {/* 1. AUTHENTIC CAMPUS ARCHITECTURE IMAGE BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/campus-hero.jpg"
          alt="ADGIPS Campus Infrastructure — Shastri Park, New Delhi"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-[1.01]"
          loading="eager"
        />
        {/* Subtle cinematic gradient overlay to ensure perfect contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
      </div>

      {/* 2. FLOATING FOREGROUND CONTENT LAYER WITH CRISP HIGH-CONTRAST TYPOGRAPHY */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Top Meta Row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
        >
          {/* Institutional Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 text-white backdrop-blur-md shadow-lg border border-white/20 text-[11px] font-bold tracking-wider uppercase">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shadow-xs">
              <Building2 className="w-2.5 h-2.5" />
            </span>
            <span>Dr. Akhilesh Das Gupta Institute of Professional Studies</span>
          </div>

          {/* Location Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>8.08-Acre Shastri Park Campus, New Delhi</span>
          </div>
        </motion.div>

        {/* HERO TEXT REVEAL — CRISP FLOATING EDITORIAL HEADLINE */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainerVariants}
          className="my-auto py-8 sm:py-12 md:py-16"
        >
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              <motion.span variants={heroLineVariants} className="block drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                YOUR CAMPUS.
              </motion.span>
              <motion.span
                variants={heroLineVariants}
                className="block font-serif italic font-normal text-cyan-400 lowercase tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
              >
                your opportunities.
              </motion.span>
              <motion.span variants={heroLineVariants} className="block drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                YOUR FUTURE.
              </motion.span>
            </h1>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
