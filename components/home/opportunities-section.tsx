"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, Bookmark, ExternalLink, Share2, Check } from "lucide-react";
import { opportunitiesData } from "@/data/opportunities";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  sectionVariants,
  staggerContainer,
  staggerItem,
  cardHoverTransition,
} from "@/lib/animations";

export function OpportunitiesSection() {
  const { toast } = useToast();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toast({
          title: "Bookmark Removed",
          description: `Removed "${title}" from your saved opportunities.`,
          type: "info",
        });
        return prev.filter((item) => item !== id);
      } else {
        toast({
          title: "Opportunity Saved",
          description: `"${title}" has been saved to your local bookmarks.`,
          type: "success",
        });
        return [...prev, id];
      }
    });
  };

  const copyLink = (id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#opportunities?id=${id}`);
      setCopiedId(id);
      toast({
        title: "Link Copied",
        description: "Opportunity URL copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const spotlightOpp = opportunitiesData[0]; // SIH 2026 Ideathon
  const listOpps = opportunitiesData.slice(1, 5);

  return (
    <SectionContainer id="opportunities" className="bg-transparent border-b border-white/10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
      >
        <SectionHeading
          pill="04 / Find Your Next Opportunity"
          pillVariant="secondary"
          title="Competitive Excellence &"
          highlightText="Career Acceleration"
          description="National hackathons, government ideathons, corporate engineering fellowships, and appellate moot contests curated to sharpen your practical skills and collegiate portfolio."
          align="split"
          action={
            <Button variant="outline" href="/activities" className="group">
              <span>Join Societies & Student Clubs</span>
              <Award className="w-4 h-4 ml-1.5 text-blue-400" />
            </Button>
          }
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Spotlight Featured Opportunity Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          whileHover={{ y: -6, transition: cardHoverTransition }}
          className="lg:col-span-5 bg-gradient-to-br from-slate-900/80 to-[#0a192f]/90 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col justify-between min-h-[440px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <Badge variant="navy" className="bg-blue-600 text-white font-bold text-xs px-3 py-1">
                Spotlight Challenge
              </Badge>
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyLink(spotlightOpp.id)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                  aria-label="Share opportunity"
                >
                  {copiedId === spotlightOpp.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleBookmark(spotlightOpp.id, spotlightOpp.title)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                  aria-label="Bookmark opportunity"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(spotlightOpp.id) ? "fill-blue-400 text-blue-400" : ""}`} />
                </motion.button>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1.5">
              {spotlightOpp.organization}
            </p>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-3">
              {spotlightOpp.title}
            </h3>

            {spotlightOpp.stipendOrPrize && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-4 backdrop-blur-xs">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{spotlightOpp.stipendOrPrize}</span>
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong>Deadline:</strong> {spotlightOpp.deadline}</span>
              </p>
              <p className="truncate"><strong>Eligibility:</strong> {spotlightOpp.eligibility}</p>
              <p><strong>Mode:</strong> {spotlightOpp.mode} • {spotlightOpp.location}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {spotlightOpp.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium bg-white/10 px-2.5 py-0.5 rounded-lg text-slate-300 border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Verified National Hackathon</span>
            <Button
              variant="white"
              size="sm"
              href={spotlightOpp.applyLink}
              external
              className="font-bold text-xs gap-1"
            >
              <span>Apply via SIH Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>

        {/* Right Column (7 cols): Editorial Stacked Opportunity List with Stagger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="lg:col-span-7 space-y-3.5"
        >
          {listOpps.map((opp) => {
            const isBookmarked = bookmarkedIds.includes(opp.id);
            return (
              <motion.div
                key={opp.id}
                variants={staggerItem}
                whileHover={{ y: -4, transition: cardHoverTransition }}
                className="group p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-slate-900/80 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[11px] font-semibold">
                      {opp.category}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">
                      {opp.organization}
                    </span>
                    {opp.stipendOrPrize && (
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        {opp.stipendOrPrize}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                    {opp.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Apply by: {opp.deadline}
                    </span>
                    <span>•</span>
                    <span className="truncate">{opp.eligibility}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleBookmark(opp.id, opp.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-400 text-blue-400" : ""}`} />
                  </motion.button>
                  <Button
                    variant="primary"
                    size="sm"
                    href={opp.applyLink}
                    external
                    className="text-xs font-semibold shadow-2xs"
                  >
                    <span>View & Apply</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionContainer>
  );
}