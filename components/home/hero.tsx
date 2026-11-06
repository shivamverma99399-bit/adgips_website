"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  heroContainerVariants,
  heroLineVariants,
  fadeInUp,
} from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[560px] sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-between pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 border-b border-white/10 bg-transparent">
      {/* 1. AUTHENTIC CAMPUS ARCHITECTURE IMAGE BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/campus-hero.jpg"
          alt="ADGIPS Campus Architecture — Shastri Park, New Delhi"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-[1.01]"
          loading="eager"
        />
        {/* Subtle cinematic gradient overlay to ensure perfect contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/40" />
      </div>

      {/* 2. FLOATING FOREGROUND CONTENT LAYER WITH CRISP HIGH-CONTRAST TYPOGRAPHY */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Chapter 01 Marker & Institutional Identity Row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
        >
          {/* Institutional Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 text-white backdrop-blur-md shadow-lg border border-white/20 text-[11px] font-bold tracking-wider uppercase">
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
          className="my-auto py-6 sm:py-10"
        >
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>01 / Welcome to ADGIPS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
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

            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-normal"
            >
              Affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), AICTE and BCI approved. Empowering undergraduate scholars across Engineering, Moot Court Jurisprudence, and Executive Management in the heart of Delhi-NCR.
            </motion.p>

            {/* Clear Exploration CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-3 pt-3"
            >
              <Button
                variant="primary"
                size="lg"
                href="#campus-showcase"
                className="shadow-xl shadow-blue-600/30 font-bold group"
              >
                <span>Discover Your Campus</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="white"
                size="lg"
                href="/events"
                className="font-bold shadow-lg"
              >
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                <span>Explore Events & Fests</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="/resources"
                className="font-semibold text-slate-200 hover:text-white"
              >
                <BookOpen className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Knowledge Commons & PYQs</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Institutional Anchor Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/10">
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                8.08 <span className="text-xs font-sans text-blue-400">Acres</span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">Shastri Park Campus Complex</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/10">
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-300">
                44+ <span className="text-xs font-sans text-emerald-400">LPA</span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">Peak Recruitment Trajectory</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/10">
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-300">
                85,000+ <span className="text-xs font-sans text-cyan-400">Volumes</span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">Central Digital Library</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/10">
              <p className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300">
                25+ <span className="text-xs font-sans text-amber-400">Societies</span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">Active IEEE & Cultural Clubs</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
