"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface StackedCarouselItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  tag?: string;
  href?: string;
  badge?: string;
}

export interface StackedCarouselProps {
  items: StackedCarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function StackedCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  className,
}: StackedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [windowWidth, setWindowWidth] = useState(1024);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const total = items.length;

  // Responsive spacing calibration
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSpacing = useCallback(() => {
    if (windowWidth < 640) return 95; // mobile
    if (windowWidth < 1024) return 160; // tablet
    return 220; // desktop
  }, [windowWidth]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, total, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Drag handling
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  const activeItem = items[activeIndex];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => autoPlay && setIsPaused(true)}
      onMouseLeave={() => autoPlay && setIsPaused(false)}
      className={cn("w-full flex flex-col items-center select-none", className)}
    >
      {/* 3D CAROUSEL STAGE */}
      <div
        className="relative w-full h-[380px] sm:h-[430px] md:h-[480px] flex items-center justify-center overflow-visible"
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, index) => {
          // Calculate circular offset
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isImmediate = Math.abs(offset) === 1;
          const isOuter = Math.abs(offset) === 2;
          const isVisible = Math.abs(offset) <= 2;

          const spacing = getSpacing();

          // 3D positioning calculations
          const x = shouldReduceMotion
            ? offset * (spacing * 0.9)
            : offset * spacing;

          const scale = isCenter
            ? 1
            : isImmediate
            ? 0.86
            : isOuter
            ? 0.72
            : 0.55;

          const rotateY = shouldReduceMotion
            ? 0
            : isCenter
            ? 0
            : offset > 0
            ? -24 - (Math.abs(offset) - 1) * 12
            : 24 + (Math.abs(offset) - 1) * 12;

          const zIndex = isCenter
            ? 30
            : isImmediate
            ? 20
            : isOuter
            ? 10
            : 0;

          const opacity = isCenter
            ? 1
            : isImmediate
            ? 0.88
            : isOuter
            ? 0.55
            : 0;

          return (
            <motion.div
              key={item.id}
              onClick={() => {
                if (!isCenter) setActiveIndex(index);
              }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              animate={{
                x,
                scale,
                rotateY,
                zIndex,
                opacity,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-3xl overflow-hidden cursor-pointer",
                "w-[230px] sm:w-[275px] md:w-[315px] h-[330px] sm:h-[385px] md:h-[435px]",
                "border transition-shadow duration-300",
                isCenter
                  ? "border-blue-400/40 shadow-2xl shadow-blue-950/20 ring-1 ring-white/60 cursor-default"
                  : "border-slate-200/80 shadow-lg hover:border-blue-300/60",
                !isVisible && "pointer-events-none"
              )}
            >
              {/* Card Background Image */}
              <div className="relative w-full h-full bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700 ease-out",
                    isCenter && "hover:scale-105"
                  )}
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                  priority={isCenter}
                />

                {/* Ambient Depth Vignette */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    isCenter
                      ? "bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/10"
                      : "bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-900/40 hover:opacity-90"
                  )}
                />

                {/* Top Pill on Card */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 text-white backdrop-blur-md shadow-xs border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {item.category}
                  </span>

                  {item.badge && isCenter && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* In-Card Title Preview for Side Cards */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <h4
                    className={cn(
                      "font-bold leading-snug drop-shadow-md line-clamp-2",
                      isCenter
                        ? "text-base sm:text-lg text-white"
                        : "text-xs sm:text-sm text-slate-200"
                    )}
                  >
                    {item.title}
                  </h4>
                  {isCenter && (
                    <p className="text-xs text-blue-200 font-medium mt-1 line-clamp-1 drop-shadow-xs">
                      {item.tag || "ADGIPS Campus Showcase"}
                    </p>
                  )}
                </div>

                {/* Interactive Click Prompt for non-center cards */}
                {!isCenter && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-slate-950/40">
                    <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-bold shadow-md border border-white/20">
                      Click to View
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ACTIVE CARD METADATA & CONTROLS BENEATH CAROUSEL */}
      <div className="w-full max-w-2xl px-4 mt-6 text-center space-y-4">
        {/* Animated Details */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-2">
                <Badge variant="secondary" className="text-xs px-3 py-0.5">
                  {activeItem.category}
                </Badge>
                {activeItem.tag && (
                  <span className="text-xs font-semibold text-blue-400">
                    • {activeItem.tag}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {activeItem.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                {activeItem.description}
              </p>

              {activeItem.href && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    href={activeItem.href}
                    className="gap-1.5 text-xs font-bold"
                  >
                    <span>Explore Institutional Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION CONTROLS & INDICATOR DOTS */}
        <div className="flex items-center justify-center gap-4 pt-3">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePrev}
            aria-label="Previous slide"
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 shadow-sm transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer",
                  i === activeIndex
                    ? "w-6 bg-blue-500 shadow-sm shadow-blue-500/50"
                    : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleNext}
            aria-label="Next slide"
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 shadow-sm transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Optional Autoplay Toggle */}
          {autoPlay && (
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
              className="p-2 rounded-full text-slate-400 hover:text-white transition-colors ml-1"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
