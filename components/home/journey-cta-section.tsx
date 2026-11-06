"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Calendar,
  Compass,
  BookOpen,
  ShieldCheck,
  Building2,
  MapPin,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sectionVariants } from "@/lib/animations";

export function JourneyCTASection() {
  return (
    <section className="py-20 sm:py-24 bg-transparent relative overflow-hidden">
      <SectionContainer>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          className="relative rounded-3xl bg-gradient-to-br from-[#04101e]/90 via-[#0a1e38]/90 to-[#071728]/95 backdrop-blur-2xl border border-white/15 p-8 sm:p-12 lg:p-16 text-white shadow-2xl overflow-hidden"
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            {/* Chapter 08 Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>08 / Your Campus. Your Journey.</span>
            </div>

            {/* Editorial Closing Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Step Onto the Campus.{" "}
              <span className="font-serif italic font-normal text-cyan-400">
                Build What Matters.
              </span>
            </h2>

            {/* Narrative Storytelling Copy */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Whether you are training deep learning architectures in our gigabit research labs, arguing constitutional law in the appellate moot court, or celebrating with thousands at Utkarsh, ADGIPS is your platform to lead.
            </p>

            {/* Action Grid */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                href="/resources"
                className="shadow-xl shadow-blue-600/30 font-bold group"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Knowledge Commons & PYQs</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="white"
                size="lg"
                href="/events"
                className="font-bold shadow-lg"
              >
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                <span>Explore Events & Archive</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="/activities"
                className="font-semibold text-slate-200 hover:text-white"
              >
                <Compass className="w-4 h-4 mr-2 text-amber-400" />
                <span>Student Societies & Clubs</span>
              </Button>
            </div>

            {/* Institutional Trust Footer Banner */}
            <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                GGSIPU Affiliated • AICTE & BCI Approved
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                BBD Educational Group Institution
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Shastri Park, New Delhi - 110053
              </span>
            </div>
          </div>
        </motion.div>
      </SectionContainer>
    </section>
  );
}
