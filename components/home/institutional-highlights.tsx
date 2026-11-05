"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { placementRecruiters } from "@/data/institutional-highlights";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { sectionVariants, staggerContainer, staggerItem, cardHoverTransition } from "@/lib/animations";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { RecruitmentPartnerRing } from "@/components/ui/recruitment-partner-ring";

export function InstitutionalHighlights() {
  return (
    <SectionContainer id="highlights" className="bg-transparent border-b border-white/10">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <SectionHeading
          pill="Infrastructure & Career Milestones"
          pillVariant="secondary"
          title="A Living Campus"
          highlightText="Engineered for Ambition"
          description="Established under the Babu Banarasi Das Educational Group, ADGIPS combines world-class engineering computing research bays, simulated appellate moot courts, and tier-1 corporate recruitment linkages across NCR."
          align="split"
          action={
            <a
              href="https://adgips.ac.in/about-adgips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
            >
              <span>Institutional Overview on adgips.ac.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          }
        />

        {/* Editorial Storytelling Grid: 2 Major Feature Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Story 1: The 8.08-Acre Shastri Park Campus (6 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={cardHoverTransition}
            className="lg:col-span-6 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                <Image
                  src="/images/campus-main.png"
                  alt="ADGIPS 8.08 Acre Academic Complex at Shastri Park"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-0.5">
                    Infrastructure Milestone
                  </span>
                  <h4 className="text-xl font-bold leading-tight">
                    8.08 Acres of Eco-Friendly Architecture
                  </h4>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Spanning over 23,636 square meters of built-up space across five interconnected academic blocks, the campus is equipped with 1 Gbps high-speed optical fiber connectivity, advanced computing research bays, and a Central Library holding over 85,000 learning volumes.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xl font-mono font-extrabold text-white">
                      <AnimatedCounter value={8.08} decimals={2} /> <span className="text-xs font-sans text-blue-400">Acres</span>
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Lush Green Campus</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xl font-mono font-extrabold text-white">
                      <AnimatedCounter value={1} /> <span className="text-xs font-sans text-blue-400">Gbps</span>
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Optical Fiber Backbone</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Verified: adgips.ac.in/overview</span>
                <span className="font-semibold text-blue-400">Shastri Park, Delhi</span>
              </div>
            </div>
          </motion.div>

          {/* Story 2: Corporate Resource Centre & Placement Trajectory (6 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={cardHoverTransition}
            className="lg:col-span-6 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                <Image
                  src="/images/campus-life.jpg"
                  alt="Student Career Training and Campus Recruitment at ADGIPS"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-0.5">
                    Placement & Career Exposure
                  </span>
                  <h4 className="text-xl font-bold leading-tight">
                    Tier-1 Recruiters & 44+ LPA Peak Packages
                  </h4>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  The Corporate Resource Centre (CRC) maintains active industry linkages with multinational technology firms and professional enterprises, facilitating regular recruitment from Microsoft, Oracle, Infosys, TCS, Wipro, and Accenture.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xl font-mono font-extrabold text-blue-300">
                      <AnimatedCounter value={44} suffix="+" /> <span className="text-xs font-sans text-blue-300 font-bold">LPA</span>
                    </p>
                    <p className="text-xs text-blue-300/80 font-medium">Highest Package (Product Giants)</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
                    <p className="text-xl font-mono font-extrabold text-emerald-300">
                      <AnimatedCounter value={100} suffix="%" />
                    </p>
                    <p className="text-xs text-emerald-300/80 font-medium">GGSIPU, AICTE & BCI Approved</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Verified: adgips.ac.in/placement</span>
                <a
                  href="https://adgips.ac.in/placement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Placement Disclosures</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recruiter 3D RingView Carousel */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={cardHoverTransition}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div>
              <h4 className="text-base font-extrabold text-white">
                Annual Recruitment Partners & Technology Firms
              </h4>
              <p className="text-xs text-slate-400">
                Regular campus recruiters visiting ADGIPS for Engineering, Law, and Management talent
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Corporate Resource Centre</span>
          </div>

          <RecruitmentPartnerRing partners={placementRecruiters} />
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
}
