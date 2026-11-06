"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  LayoutGrid,
  Filter,
  Maximize2,
  X,
  Calendar,
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolioFlowGallery } from "@/components/ui/folio-flow-gallery";
import { getGalleryFromFirestore, GalleryItemDocument } from "@/lib/firebase/firestore";
import type { JournalPage } from "@/data/folio-gallery";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItemDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"book" | "grid">("book");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItemDocument | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        setIsLoading(true);
        const data = await getGalleryFromFirestore();
        if (isMounted) {
          setGalleryItems(data);
        }
      } catch (err) {
        console.error("Failed to load gallery items from Firestore:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGallery();

    const handleUpdate = () => {
      loadGallery();
    };

    window.addEventListener("adgips_gallery_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("adgips_gallery_updated", handleUpdate);
    };
  }, []);

  // Keyboard close for lightbox
  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    galleryItems.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCategory);
  }, [galleryItems, selectedCategory]);

  const journalPages: JournalPage[] = useMemo(() => {
    return galleryItems.map((item, index) => ({
      id: item.id,
      pageNumber: index + 1,
      title: item.title,
      subtitle: item.eventName || undefined,
      date: item.date || "2026",
      location: item.location || "ADGIPS Campus, New Delhi",
      category: (item.category as any) || "Campus",
      image: item.imageUrl,
      caption: item.description || item.title,
      tag: item.tag || item.category,
    }));
  }, [galleryItems]);

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <Breadcrumb
            items={[
              { label: "Campus Life", href: "/#gallery" },
              { label: "3D Photo Journal" },
            ]}
          />
          <div className="flex items-center gap-3">
            {galleryItems.length > 0 && (
              <div className="flex items-center rounded-xl bg-white/10 p-0.5 border border-white/10 text-xs">
                <button
                  onClick={() => setViewMode("book")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === "book"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>3D Folio</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Mosaic Grid</span>
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{galleryItems.length} Archived Photos</span>
            </div>
          </div>
        </div>

        {/* Page Editorial Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="secondary" className="mb-2 font-semibold">
            Institutional Phototheque
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Campus Chronicle & 3D Folio Journal
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Visual retrospective documenting collegiate milestones, technical symposiums, moot court proceedings, and student camaraderie across our 8.08-acre Shastri Park campus.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 text-center rounded-3xl bg-slate-900/40 border border-white/10 mb-8">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">Loading Archival Phototheque...</p>
            <p className="text-xs text-slate-400 mt-1">Retrieving verified photographs from Cloud Firestore.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && galleryItems.length === 0 && (
          <div className="p-12 sm:p-16 text-center rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md mb-8">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-xl font-bold text-white mb-2">Campus Photo Journal Empty</h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
              Curated institutional memories, fest highlights, and student achievements will appear in this interactive 3D folio once published through the administrative portal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" href="/#gallery" className="gap-2 text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>Explore Campus Architecture</span>
              </Button>
              <Button variant="white" href="/events" className="gap-2 text-xs font-bold">
                <span>View Collegiate Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* 3D FolioFlow Mode */}
        {!isLoading && galleryItems.length > 0 && viewMode === "book" && (
          <div className="w-full mt-2 mb-8">
            <FolioFlowGallery pages={journalPages} />
          </div>
        )}

        {/* Mosaic Grid Mode */}
        {!isLoading && galleryItems.length > 0 && viewMode === "grid" && (
          <div className="space-y-6 mb-8">
            {/* Category Filter Bar */}
            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-blue-400" /> Sector:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/30"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Grid of Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="group relative rounded-3xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-blue-400/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="aspect-4/3 relative w-full overflow-hidden bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/15">
                      {item.category}
                    </span>
                    <button
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-slate-900"
                      title="Inspect photo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{item.date || "2026"}</span>
                      {item.eventName && <span className="truncate max-w-[150px]">{item.eventName}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-white/15 overflow-hidden shadow-2xl space-y-4 p-5 text-white"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">
                      {lightboxItem.category} • {lightboxItem.date}
                    </span>
                    <h2 className="text-base font-bold text-white">{lightboxItem.title}</h2>
                  </div>
                  <button
                    onClick={() => setLightboxItem(null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lightboxItem.imageUrl}
                    alt={lightboxItem.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                {lightboxItem.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lightboxItem.description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionContainer>
    </div>
  );
}
