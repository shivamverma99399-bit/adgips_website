"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  GraduationCap,
  ArrowRight,
  FileText,
  Layers,
  CheckCircle2,
  Library,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { initialResourcesData, AcademicResource } from "@/data/resources";
import { downloadAcademicResource } from "@/lib/download-resource";
import {
  sectionVariants,
  staggerContainer,
  staggerItem,
  cardHoverTransition,
} from "@/lib/animations";

export function LearnGrowSection() {
  const { toast } = useToast();
  // Select 4 high-demand flagship resources
  const featuredResources = initialResourcesData.slice(0, 4);

  const handleDownload = (res: AcademicResource) => {
    downloadAcademicResource(res);
    toast({
      title: "Handout Saved to Device",
      description: `Downloaded ${res.code} — ${res.title}. Saved in your student dashboard history.`,
      type: "success",
    });
  };

  return (
    <SectionContainer id="learn-grow" className="bg-transparent border-b border-white/10 py-16 sm:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <SectionHeading
          pill="05 / Learn & Grow"
          pillVariant="secondary"
          title="Curated Knowledge Commons &"
          highlightText="Academic Handouts"
          description="The intellectual foundation of ADGIPS. Access accredited GGSIPU examination schemas, laboratory code manuals, past five-year question papers (PYQs), and case compendiums across Engineering, Law, and Management."
          align="split"
          action={
            <Button variant="outline" href="/resources" className="group">
              <span>Explore All Academic Resources</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          }
        />
      </motion.div>

      {/* 4 Curated Resource Modules */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        {featuredResources.map((res) => (
          <motion.div
            key={res.id}
            variants={staggerItem}
            whileHover={{ y: -4, transition: cardHoverTransition }}
            className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-blue-400/40 hover:bg-slate-900/80 transition-all shadow-lg flex flex-col justify-between text-white space-y-4 group"
          >
            <div>
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/20">
                    {res.code}
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {res.type}
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {res.semester}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5">
                {res.title}
              </h3>

              {/* Department */}
              <p className="text-xs text-slate-400 font-medium mb-2">
                {res.stream} ({res.department}) • Academic Cycle {res.year}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {res.description}
              </p>
            </div>

            {/* Bottom Row: Metadata & Working Download Action */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 text-[11px]">
                {res.format} • {res.fileSize}
              </span>

              <button
                onClick={() => handleDownload(res)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                title={`Download ${res.code}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Handout</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Central E-Library Quick Link Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 shrink-0">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-sm block">
              Central Digital Library & IEEE Xplore Access
            </span>
            <span className="text-slate-400">
              85,000+ volumes, Delnet e-journal consortium, and thesis repositories.
            </span>
          </div>
        </div>

        <Button variant="white" size="sm" href="/resources" className="shrink-0 font-bold">
          <span>Search Repository</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </motion.div>
    </SectionContainer>
  );
}
