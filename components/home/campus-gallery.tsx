"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Maximize2,
  X,
  Compass,
  BookOpen,
  Cpu,
  Scale,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { galleryData } from "@/data/gallery";
import { SectionContainer } from "@/components/ui/section-container";
import { Badge } from "@/components/ui/badge";
import { GalleryItem } from "@/types";
import {
  cardHoverTransition,
  modalBackdropVariants,
  modalContentVariants,
  sectionVariants,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

export function CampusGallery() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!activeItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  // Key campus visual items from official gallery dataset
  const libraryItem = galleryData.find((g) => g.id === "gal-03") || galleryData[2];
  const computingItem = galleryData.find((g) => g.id === "gal-02") || galleryData[1];
  const mootCourtItem = galleryData.find((g) => g.id === "gal-04") || galleryData[3];
  const culturalItem = galleryData.find((g) => g.id === "gal-05") || galleryData[4];
  const sportsItem = galleryData.find((g) => g.id === "gal-06") || galleryData[5];
  const hackathonItem = galleryData.find((g) => g.id === "gal-08") || galleryData[7];

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-transparent border-b border-white/10">
      <SectionContainer>
        {/* Editorial Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>06 / Architecture & Atmosphere</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.08] mb-4">
              Spaces Engineered for{" "}
              <span className="font-serif italic font-normal text-blue-400">Discovery,</span>{" "}
              Advocacy & Fellowship
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Spanning 8.08 acres along the Shastri Park institutional corridor, our purpose-built campus balances high-density research laboratories with quiet study commons, trial courts, and vibrant student venues.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all shadow-xs group cursor-pointer backdrop-blur-sm"
            >
              <span>Explore All 8 Spaces</span>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Asymmetric Editorial Mosaic Layout with Staggered Entrance & Card Hover */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Top Row: 7/12 Anchor Feature + 5/12 Stacked Duo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Anchor: Central Research & Digital Library (7 cols) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, transition: cardHoverTransition }}
              onClick={() => setActiveItem(libraryItem)}
              className="lg:col-span-7 group relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-500 cursor-pointer min-h-[420px] sm:min-h-[480px] flex flex-col justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full absolute inset-0"
              >
                <Image
                  src={libraryItem.image}
                  alt={libraryItem.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </motion.div>

              {/* Natural bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Top Floating Badge & Action with Hover Pop */}
              <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md shadow-xs border border-white/20">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Flagship Academic Commons</span>
                </span>
                <motion.span
                  whileHover={{ scale: 1.15 }}
                  className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md border border-white/20"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.span>
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-10 p-6 sm:p-8 text-white space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-200">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-900/60 border border-blue-400/30">
                    85,000+ Volumes
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-xs border border-white/20">
                    DELNET & IEEE Xplore bays
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-xs border border-white/20">
                    Open 8:00 AM – 8:00 PM
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug group-hover:text-blue-200 transition-colors">
                  {libraryItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                  {libraryItem.description}
                </p>
              </div>
            </motion.div>

            {/* Right Stacked Duo: 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Computing Labs */}
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -5, transition: cardHoverTransition }}
                onClick={() => setActiveItem(computingItem)}
                className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 cursor-pointer flex-1 min-h-[220px] flex flex-col justify-end"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full absolute inset-0"
                >
                  <Image
                    src={computingItem.image}
                    alt={computingItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md shadow-xs border border-white/20">
                    <Cpu className="w-3 h-3 text-blue-400" />
                    <span>High-Performance Cluster</span>
                  </span>
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className="p-2 rounded-xl bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </motion.span>
                </div>

                <div className="relative z-10 p-5 sm:p-6 text-white space-y-1.5">
                  <span className="text-[11px] font-semibold tracking-wider text-blue-300 uppercase">
                    1 Gbps Fiber • AI & Systems Engineering
                  </span>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                    {computingItem.title}
                  </h4>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {computingItem.description}
                  </p>
                </div>
              </motion.div>

              {/* Law Moot Court */}
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -5, transition: cardHoverTransition }}
                onClick={() => setActiveItem(mootCourtItem)}
                className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 cursor-pointer flex-1 min-h-[220px] flex flex-col justify-end"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full absolute inset-0"
                >
                  <Image
                    src={mootCourtItem.image}
                    alt={mootCourtItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md shadow-xs border border-white/20">
                    <Scale className="w-3 h-3 text-amber-400" />
                    <span>Trial Simulation Chamber</span>
                  </span>
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className="p-2 rounded-xl bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </motion.span>
                </div>

                <div className="relative z-10 p-5 sm:p-6 text-white space-y-1.5">
                  <span className="text-[11px] font-semibold tracking-wider text-amber-200 uppercase">
                    Bar Council of India Approved Standard
                  </span>
                  <h4 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                    {mootCourtItem.title}
                  </h4>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {mootCourtItem.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Row: 3-Panel Triptych with Image Zoom & Hover */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cultural Festival & OAT */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, transition: cardHoverTransition }}
              onClick={() => setActiveItem(culturalItem)}
              className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 cursor-pointer min-h-[260px] flex flex-col justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full absolute inset-0"
              >
                <Image
                  src={culturalItem.image}
                  alt={culturalItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-purple-300 backdrop-blur-md shadow-xs border border-white/20">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Cultural Celebrations</span>
                </span>
                <span className="p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>

              <div className="relative z-10 p-5 text-white space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                  {culturalItem.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {culturalItem.description}
                </p>
              </div>
            </motion.div>

            {/* Campus Sports Complex */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, transition: cardHoverTransition }}
              onClick={() => setActiveItem(sportsItem)}
              className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 cursor-pointer min-h-[260px] flex flex-col justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full absolute inset-0"
              >
                <Image
                  src={sportsItem.image}
                  alt={sportsItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-emerald-300 backdrop-blur-md shadow-xs border border-white/20">
                  <Trophy className="w-3 h-3 text-emerald-400" />
                  <span>Sports Arena</span>
                </span>
                <span className="p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>

              <div className="relative z-10 p-5 text-white space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                  {sportsItem.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {sportsItem.description}
                </p>
              </div>
            </motion.div>

            {/* Innovation Hackathon Sprints */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, transition: cardHoverTransition }}
              onClick={() => setActiveItem(hackathonItem)}
              className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 cursor-pointer min-h-[260px] flex flex-col justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full absolute inset-0"
              >
                <Image
                  src={hackathonItem.image}
                  alt={hackathonItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-cyan-300 backdrop-blur-md shadow-xs border border-white/20">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>Innovation Hub</span>
                </span>
                <span className="p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>

              <div className="relative z-10 p-5 text-white space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {hackathonItem.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {hackathonItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </SectionContainer>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdropVariants}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] bg-[#071126]/95 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col text-white"
            >
              <div className="relative flex-1 min-h-[340px] sm:min-h-[520px] w-full bg-slate-950">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                  priority
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors backdrop-blur-sm z-20 cursor-pointer border border-white/10"
                  aria-label="Close image modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-5 sm:p-6 bg-transparent border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <Badge variant="navy" className="text-xs">
                    {activeItem.category}
                  </Badge>
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    ADGIPS Shastri Park Campus Archive
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {activeItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}