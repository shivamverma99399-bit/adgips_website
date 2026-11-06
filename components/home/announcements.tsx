"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ExternalLink,
  ShieldCheck,
  Filter,
  Calendar,
  Loader2,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { AnnouncementItemComponent } from "@/components/ui/announcement-item";
import { Badge } from "@/components/ui/badge";
import { getAnnouncementsFromFirestore } from "@/lib/firebase/firestore";
import { AnnouncementItem } from "@/types";
import { sectionVariants, staggerContainer, staggerItem } from "@/lib/animations";

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", "Events", "Examination", "Placement", "Academic", "Administrative"];

  useEffect(() => {
    let isMounted = true;
    async function fetchNotices() {
      try {
        setIsLoading(true);
        const docs = await getAnnouncementsFromFirestore();
        if (isMounted) {
          // Public visibility restricted to published notices
          const published: AnnouncementItem[] = docs
            .filter((d) => d.status !== "archived" && d.status !== "draft")
            .map((d) => ({
              id: d.id,
              title: d.title,
              category: d.category,
              date: d.date,
              expiryDate: d.expiryDate,
              isUrgent: d.isUrgent,
              isDemo: false,
              summary: d.summary,
              details: d.details,
              fileSize: d.fileSize,
              fileUrl: d.fileUrl,
              storagePath: d.storagePath,
              status: d.status || "published",
              publishedBy: d.publishedBy,
            }));
          setAnnouncements(published);
        }
      } catch (err) {
        console.error("Failed to load announcements from Firestore:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeTab === "All") return true;
    return item.category === activeTab;
  });

  return (
    <section id="announcements" className="py-20 sm:py-28 bg-transparent border-b border-white/10">
      <SectionContainer>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
        >
          {/* Left Column: Editorial Notice Meta & Filters (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-xs">
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>06 / Stay Connected</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.08]">
              Official Circulars &{" "}
              <span className="font-serif italic font-normal text-blue-400">Gazette</span>{" "}
              Directives
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Direct communication from the ADGIPS Registrar, Academic Council, and Corporate Resource Centre regarding GGSIPU semester schedules, corporate drives, and collegiate guidelines.
            </p>

            {/* Filter Pills with Counts */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Dispatches by Sector</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const count =
                    cat === "All"
                      ? announcements.length
                      : announcements.filter((a) => a.category === cat).length;
                  const isActive = activeTab === cat;
                  return (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab(cat)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500"
                          : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {isLoading ? "—" : count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Institutional Verification Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg space-y-3"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Certified Registrar Feed</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All listed notices follow statutory notifications affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Primary College Domain
                </span>
                <a
                  href="https://adgips.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>adgips.ac.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Circulars List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Notices ({isLoading ? "—" : filteredAnnouncements.length})</span>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Official Feed
              </Badge>
            </div>

            {/* Notice Items with Stagger Animation or Empty State */}
            {isLoading ? (
              <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
                <p>Loading collegiate circulars...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
                <Bell className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                <p className="font-semibold text-slate-300">No official circulars published at this time.</p>
                <p className="mt-1 text-slate-500">New circulars will appear here as released by the Academic and Examination Cell.</p>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {filteredAnnouncements.map((item) => (
                  <motion.div key={item.id} variants={staggerItem}>
                    <AnnouncementItemComponent announcement={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Notice Footer Note */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Looking for historical archives? Contact the{" "}
                <span className="font-semibold text-slate-200">
                  ADGIPS Examination Cell, Block 1
                </span>{" "}
                or consult the student intranet.
              </p>
            </div>
          </div>
        </motion.div>
      </SectionContainer>
    </section>
  );
}