"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, GraduationCap, ExternalLink, X } from "lucide-react";
import { programmesData } from "@/data/programmes";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgrammeItem } from "@/types";
import {
  sectionVariants,
  cardHoverTransition,
  modalBackdropVariants,
  modalContentVariants,
} from "@/lib/animations";

export function ProgrammesSection() {
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeItem | null>(null);

  const engineeringProg = programmesData.find((p) => p.id === "school-of-engineering")!;
  const lawProg = programmesData.find((p) => p.id === "school-of-law")!;
  const managementProg = programmesData.find((p) => p.id === "school-of-management")!;

  return (
    <SectionContainer id="programmes" className="bg-transparent border-b border-white/10">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        <SectionHeading
          pill="Undergraduate & Professional"
          pillVariant="secondary"
          title="Academic Schools &"
          highlightText="Degree Programmes"
          description="Affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), ADGIPS delivers industry-aligned engineering, courtroom advocacy jurisprudence, and executive business management."
          align="split"
          action={
            <a
              href="https://adgips.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              <span>Central GGSIPU Counselling Guidelines</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          }
        />

        {/* Tier 1: Large Featured Flagship Card — School of Engineering & Technology */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={cardHoverTransition}
          className="mb-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Engineering Photo (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-950 overflow-hidden group">
              <Image
                src={engineeringProg.image}
                alt={engineeringProg.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="navy" className="bg-blue-600/90 text-xs px-3 py-1">
                  School of Engineering & Technology
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-semibold text-blue-300 block mb-0.5">
                  AICTE Approved • GGSIPU Affiliated
                </span>
                <p className="text-base font-bold">
                  Advanced Systems, AI & Robotics Laboratories
                </p>
              </div>
            </div>

            {/* Right: Engineering Content & 7 Streams (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {engineeringProg.duration}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                    {engineeringProg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {engineeringProg.description}
                  </p>
                </div>

                {/* 7 Specialized Engineering Streams Grid */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    7 Specialized B.Tech Streams:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {engineeringProg.specializations.map((spec) => (
                      <motion.div
                        key={spec}
                        whileHover={{ scale: 1.02 }}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-2xs hover:bg-white/10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{spec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-400/20 text-xs text-blue-200 leading-relaxed">
                  <strong>Admission Path:</strong> 10+2 with PCM. Admission conducted strictly through JEE Main Paper-1 via centralized GGSIPU Counselling.
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProgramme(engineeringProg)}
                  className="text-xs font-bold text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Curriculum Syllabus & Labs Overview &rarr;
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  href="https://adgips.ac.in"
                  external
                  className="font-semibold text-xs gap-1"
                >
                  <span>Admission Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tier 2: Two Complementary Cards — Law & Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: School of Legal Education */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={cardHoverTransition}
            className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <Image
                  src={lawProg.image}
                  alt={lawProg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="navy" className="bg-amber-600/90 text-xs">
                    School of Legal Education
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-amber-300 block mb-0.5">
                    5 Years Integrated Full Time • Bar Council of India Approved
                  </span>
                  <h4 className="text-xl font-bold leading-tight">
                    {lawProg.title}
                  </h4>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lawProg.description}
                </p>

                <div className="space-y-1.5">
                  {lawProg.specializations.map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedProgramme(lawProg)}
                  className="font-bold text-slate-300 hover:text-amber-300 cursor-pointer"
                >
                  Moot Court & Syllabus
                </button>
                <Button variant="outline" size="sm" href="https://adgips.ac.in" external className="text-xs">
                  Admission Portal
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Card 2: School of Management Studies */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={cardHoverTransition}
            className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <Image
                  src={managementProg.image}
                  alt={managementProg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="navy" className="bg-blue-600/90 text-xs">
                    School of Management Studies
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-blue-300 block mb-0.5">
                    Undergraduate & Postgraduate Leadership Degrees
                  </span>
                  <h4 className="text-xl font-bold leading-tight">
                    {managementProg.title}
                  </h4>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {managementProg.description}
                </p>

                <div className="space-y-1.5">
                  {managementProg.specializations.map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedProgramme(managementProg)}
                  className="font-bold text-slate-300 hover:text-blue-400 cursor-pointer"
                >
                  Specializations & Modules
                </button>
                <Button variant="outline" size="sm" href="https://adgips.ac.in" external className="text-xs">
                  Admission Portal
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Programme Details Modal with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {selectedProgramme && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setSelectedProgramme(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#071126]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-white"
            >
              <button
                onClick={() => setSelectedProgramme(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close programme modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant="navy">{selectedProgramme.school}</Badge>
                <span className="text-xs text-slate-400 font-semibold">{selectedProgramme.duration}</span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">
                {selectedProgramme.title}
              </h3>
              <p className="text-xs text-blue-400 font-semibold mb-4">{selectedProgramme.degree}</p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 mb-5 leading-relaxed">
                <strong className="block text-white mb-1">Eligibility & Selection Process:</strong>
                {selectedProgramme.eligibility}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-2.5">All Academic Streams & Focus Areas:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProgramme.specializations.map((spec) => (
                    <div key={spec} className="p-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Official GGSIPU Affiliated Course</span>
                <Button
                  variant="primary"
                  size="sm"
                  href="https://adgips.ac.in"
                  external
                >
                  <span>Visit Official College Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionContainer>
  );
}
