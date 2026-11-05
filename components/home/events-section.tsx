"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Calendar, Sparkles, ChevronRight, Trophy, Shield, Scale } from "lucide-react";
import { eventsData } from "@/data/events";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  sectionVariants,
  staggerContainer,
  staggerItem,
  cardHoverTransition,
} from "@/lib/animations";

export function EventsSection() {
  const utkarshFest = eventsData.find((e) => e.id === "utkarsh-fest") || eventsData[0];
  const aiSummit = eventsData.find((e) => e.id === "industry-ai-summit") || eventsData[1];
  const mootCourt = eventsData.find((e) => e.id === "national-moot-court") || eventsData[2];
  const sportsMeet = eventsData.find((e) => e.id === "annual-sports-meet");
  const cyberWorkshop = eventsData.find((e) => e.id === "cyber-forensics-workshop");
  const legalAid = eventsData.find((e) => e.id === "legal-aid-community-conclave");

  return (
    <SectionContainer id="events" className="bg-transparent border-b border-white/10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <SectionHeading
          pill="03 / Experience Campus Life"
          pillVariant="secondary"
          title="The Pulse of Campus Life &"
          highlightText="Collegiate Fiestas"
          description="Beyond lectures and laboratories, ADGIPS thrives with student expression. Experience our flagship socio-cultural festivals, battle of the bands, national appellate mock trials, and university sports meets."
          align="split"
          action={
            <Button variant="outline" href="/events" className="group">
              <span>View Liquid Lens Carousel & Archive</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          }
        />
      </motion.div>

      {/* Primary Asymmetric Showcase with Staggered Entrance & Card Hover */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6"
      >
        {/* Left (7 cols): Large Featured Cultural Fest Card */}
        <motion.div
          variants={staggerItem}
          whileHover={{ y: -6, transition: cardHoverTransition }}
          className="lg:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
        >
          <div>
            <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative"
              >
                <Image
                  src={utkarshFest.image}
                  alt={utkarshFest.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge variant="navy" className="bg-blue-600/90 text-white backdrop-blur-xs">
                  {utkarshFest.category}
                </Badge>
                <Badge variant="secondary" className="bg-slate-900/80 text-white font-bold backdrop-blur-xs border-white/20">
                  Flagship Cultural Fest
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{utkarshFest.date} • {utkarshFest.time}</span>
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow-xs">
                  {utkarshFest.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1 text-slate-200 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  {utkarshFest.venue}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-semibold">{utkarshFest.organizedBy}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {utkarshFest.description}
              </p>

              {/* Highlights Chips */}
              {utkarshFest.highlights && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {utkarshFest.highlights.slice(0, 2).map((hl, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15 backdrop-blur-xs"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {hl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-7 pt-0">
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">{utkarshFest.eligibility}</span>
              <Button
                variant="primary"
                size="sm"
                href={`/events/${utkarshFest.slug}`}
                className="font-semibold shadow-xs"
              >
                <span>View Fest Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right (5 cols): Two Stacked Editorial Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: AI & Systems Summit */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5, transition: cardHoverTransition }}
            className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between flex-1 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="secondary">
                  {aiSummit.category}
                </Badge>
                <span className="text-xs text-blue-400 font-bold">{aiSummit.date}</span>
              </div>
              <Link href={`/events/${aiSummit.slug}`} className="block group-hover:text-blue-300 transition-colors">
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug mb-1.5">
                  {aiSummit.title}
                </h4>
              </Link>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {aiSummit.description}
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{aiSummit.time}</span>
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{aiSummit.venue}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{aiSummit.department}</span>
              <Link
                href={`/events/${aiSummit.slug}`}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group/link"
              >
                <span>Event Details</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: National Moot Court */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5, transition: cardHoverTransition }}
            className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between flex-1 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="warning">
                  {mootCourt.category}
                </Badge>
                <span className="text-xs text-amber-400 font-bold">{mootCourt.date}</span>
              </div>
              <Link href={`/events/${mootCourt.slug}`} className="block group-hover:text-amber-300 transition-colors">
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug mb-1.5">
                  {mootCourt.title}
                </h4>
              </Link>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {mootCourt.description}
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mootCourt.time}</span>
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mootCourt.venue}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">School of Law</span>
              <Link
                href={`/events/${mootCourt.slug}`}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/link"
              >
                <span>Moot Details</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Secondary Row: 3 Specialized Domain Fests with Stagger */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Sports Meet */}
        {sportsMeet && (
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5, transition: cardHoverTransition }}
            className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sportsMeet.category}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">{sportsMeet.date}</span>
              </div>
              <Link href={`/events/${sportsMeet.slug}`} className="block">
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {sportsMeet.title}
                </h4>
              </Link>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {sportsMeet.shortDescription || sportsMeet.description}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{sportsMeet.venue}</span>
              <Link
                href={`/events/${sportsMeet.slug}`}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Explore</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Cyber Forensics Workshop */}
        {cyberWorkshop && (
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5, transition: cardHoverTransition }}
            className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>{cyberWorkshop.category}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">{cyberWorkshop.date}</span>
              </div>
              <Link href={`/events/${cyberWorkshop.slug}`} className="block">
                <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                  {cyberWorkshop.title}
                </h4>
              </Link>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {cyberWorkshop.shortDescription || cyberWorkshop.description}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{cyberWorkshop.venue}</span>
              <Link
                href={`/events/${cyberWorkshop.slug}`}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Explore</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Community Legal Outreach */}
        {legalAid && (
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5, transition: cardHoverTransition }}
            className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span>{legalAid.category}</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">{legalAid.date}</span>
              </div>
              <Link href={`/events/${legalAid.slug}`} className="block">
                <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {legalAid.title}
                </h4>
              </Link>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {legalAid.shortDescription || legalAid.description}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{legalAid.venue}</span>
              <Link
                href={`/events/${legalAid.slug}`}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>Explore</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionContainer>
  );
}