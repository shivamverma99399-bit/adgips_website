"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { GalleryItem } from "@/types";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import {
  cardHoverTransition,
  modalBackdropVariants,
  modalContentVariants,
} from "@/lib/animations";

interface ImageCardProps {
  item: GalleryItem;
  className?: string;
  priority?: boolean;
}

export function ImageCard({ item, className, priority = false }: ImageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <motion.div
        whileHover={{ y: -6, transition: cardHoverTransition }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-slate-950 border border-white/10 cursor-pointer shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300",
          item.aspect === "wide" && "md:col-span-2 aspect-[16/9]",
          item.aspect === "tall" && "md:row-span-2 aspect-[3/4]",
          (!item.aspect || item.aspect === "square") && "aspect-square",
          className
        )}
      >
        {/* Crisp Image Container with Image Hover Zoom */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Natural gradient vignette strictly in lower 35% for caption readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

        {/* Floating Category Pill in Top Left */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {item.category}
          </span>
        </div>

        {/* Expand Icon in Top Right with Spring Hover */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md shadow-xs scale-90 group-hover:scale-100 border border-white/20"
        >
          <Maximize2 className="w-4 h-4" />
        </motion.div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 text-white">
          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1 mb-1 group-hover:text-blue-300 transition-colors drop-shadow-xs">
            {item.title}
          </h3>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal drop-shadow-xs">
            {item.description}
          </p>
        </div>
      </motion.div>

      {/* High-Resolution Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalBackdropVariants}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] bg-[#071126]/95 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col text-white"
            >
              {/* Modal Image Area */}
              <div className="relative flex-1 min-h-[340px] sm:min-h-[520px] w-full bg-slate-950">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                  priority
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors backdrop-blur-sm z-20 cursor-pointer border border-white/10"
                  aria-label="Close image modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Metadata Footer */}
              <div className="p-5 sm:p-6 bg-transparent border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="navy" className="text-xs">
                      {item.category}
                    </Badge>
                    {item.date && (
                      <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Dr. Akhilesh Das Gupta Institute of Professional Studies
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{item.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}