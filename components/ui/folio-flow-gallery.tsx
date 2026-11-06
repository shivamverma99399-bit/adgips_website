"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  X,
  Calendar,
  MapPin,
  Sparkles,
  BookOpen,
  Layers,
} from "lucide-react";
import { folioJournalPages, JournalPage } from "@/data/folio-gallery";

interface FolioFlowGalleryProps {
  pages?: JournalPage[];
  autoPlayInterval?: number;
}

export function FolioFlowGallery(props: FolioFlowGalleryProps) {
  const pages = props.pages || folioJournalPages;
  if (!pages || pages.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Campus Photo Journal Empty</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Curated institutional memories, fest highlights, and student achievements will appear in this 3D folio once published by the administration.
        </p>
      </div>
    );
  }

  return <FolioFlowGalleryInner {...props} pages={pages} />;
}

function FolioFlowGalleryInner({
  pages = folioJournalPages,
  autoPlayInterval = 6500,
}: FolioFlowGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 12 pages = 6 two-page spreads
  const totalSpreads = Math.ceil(pages.length / 2);
  const [currentSpread, setCurrentSpread] = useState(0);

  // 3D Turning animation state
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<"forward" | "backward">("forward");
  const [turnAngle, setTurnAngle] = useState(0);

  // Auto-play state
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive scale factor for mobile & tablet
  const [scale, setScale] = useState(1);
  const baseBookWidth = 840; // Two 380px pages + spine + stack margins
  const baseBookHeight = 485;

  // Lightbox inspection modal
  const [activeLightbox, setActiveLightbox] = useState<JournalPage | null>(null);

  // Drag interaction state
  const pointerStartX = useRef(0);
  const isDragging = useRef(false);

  // Compute responsive scale
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      // Allow padding of 24px on mobile
      const availableWidth = Math.max(300, containerWidth - 24);
      const computedScale = Math.min(1, Math.max(0.42, availableWidth / baseBookWidth));
      setScale(computedScale);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Turn to Next Spread
  const turnNext = useCallback(() => {
    if (isTurning || currentSpread >= totalSpreads - 1) return;
    setIsTurning(true);
    setTurnDirection("forward");
    setTurnAngle(0);

    const startTime = performance.now();
    const duration = 750; // ms

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic bezier easing
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setTurnAngle(-180 * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentSpread((prev) => prev + 1);
        setIsTurning(false);
        setTurnAngle(0);
      }
    }

    requestAnimationFrame(animate);
  }, [isTurning, currentSpread, totalSpreads]);

  // Turn to Previous Spread
  const turnPrev = useCallback(() => {
    if (isTurning || currentSpread <= 0) return;
    setIsTurning(true);
    setTurnDirection("backward");
    setTurnAngle(0);

    const startTime = performance.now();
    const duration = 750; // ms

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setTurnAngle(180 * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentSpread((prev) => prev - 1);
        setIsTurning(false);
        setTurnAngle(0);
      }
    }

    requestAnimationFrame(animate);
  }, [isTurning, currentSpread]);

  // Jump to specific spread
  const jumpToSpread = useCallback(
    (targetSpread: number) => {
      if (isTurning || targetSpread === currentSpread) return;
      if (targetSpread > currentSpread) {
        turnNext();
      } else {
        turnPrev();
      }
    },
    [isTurning, currentSpread, turnNext, turnPrev]
  );

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeLightbox) {
        if (e.key === "Escape") setActiveLightbox(null);
        return;
      }
      if (e.key === "ArrowRight") {
        turnNext();
      } else if (e.key === "ArrowLeft") {
        turnPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [turnNext, turnPrev, activeLightbox]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || isHovered || isTurning) return;
    const timer = setInterval(() => {
      if (currentSpread >= totalSpreads - 1) {
        setCurrentSpread(0);
      } else {
        turnNext();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, isTurning, currentSpread, totalSpreads, turnNext, autoPlayInterval]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaX = e.clientX - pointerStartX.current;
    if (deltaX < -50) {
      turnNext();
    } else if (deltaX > 50) {
      turnPrev();
    }
  };

  // Base pages for current spread
  const leftPageIndex = currentSpread * 2;
  const rightPageIndex = currentSpread * 2 + 1;
  const currentLeftPage = pages[leftPageIndex];
  const currentRightPage = pages[rightPageIndex];

  // Turning page pairs
  // When forward: turning leaf is current right page on front, next left page on back
  const forwardNextLeft = pages[leftPageIndex + 2];
  const forwardNextRight = pages[rightPageIndex + 2];

  // When backward: turning leaf is current left page on front, prev right page on back
  const backwardPrevLeft = pages[leftPageIndex - 2];
  const backwardPrevRight = pages[rightPageIndex - 2];

  // Stack calculation
  const leftStackCount = Math.min(4, currentSpread);
  const rightStackCount = Math.min(4, totalSpreads - 1 - currentSpread);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full flex flex-col items-center select-none"
    >
      {/* Photo Journal Book Header Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 px-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-0.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>ADGIPS Photo Journal</span>
            <span className="text-slate-500">•</span>
            <span>Folio Flow 3D</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Collegiate Chronicles & Heritage
          </h2>
        </div>

        {/* Floating Spread Counter Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg text-xs font-bold text-slate-200">
          <span className="text-blue-400">Spread {currentSpread + 1}</span>
          <span className="text-slate-500">/</span>
          <span>{totalSpreads}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Pages {leftPageIndex + 1}–{Math.min(pages.length, rightPageIndex + 1)} of {pages.length}</span>
        </div>
      </div>

      {/* 3D Open Book Stage Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full flex items-center justify-center overflow-visible touch-pan-y py-2 sm:py-3"
        style={{
          height: `${Math.round(baseBookHeight * scale) + 20}px`,
          perspective: 1800,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Soft Background Table Shadow & Ambient Glow */}
        <div
          className="absolute rounded-full blur-[80px] pointer-events-none opacity-30 transition-all duration-700"
          style={{
            width: `${baseBookWidth * scale}px`,
            height: `${baseBookHeight * 0.7 * scale}px`,
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(15,23,42,0.4) 60%, transparent 80%)",
          }}
        />

        {/* Scaled 3D Book Container */}
        <div
          className="relative transition-transform duration-200"
          style={{
            width: `${baseBookWidth}px`,
            height: `${baseBookHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Physical Hardcover Book Base (Dark Binding trim) */}
          <div
            className="absolute -inset-2.5 rounded-3xl pointer-events-none shadow-[0_25px_60px_rgba(0,0,0,0.7),0_10px_25px_rgba(0,0,0,0.5)] border border-white/10"
            style={{
              background: "linear-gradient(135deg, #182234 0%, #0d1522 50%, #080d16 100%)",
              transform: "translateZ(-8px)",
            }}
          >
            {/* Center Spine Stitch / Crease Line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/40 via-amber-500/10 to-black/40 shadow-inner" />
          </div>

          {/* LEFT PAGE STACK (Read pages fanned out) */}
          {leftStackCount > 0 &&
            Array.from({ length: leftStackCount }).map((_, idx) => {
              const k = idx + 1;
              const xOffset = -k * 6;
              const zOffset = -k * 2;
              const rotY = -k * 0.8;
              const targetSpreadIndex = Math.max(0, currentSpread - k);
              return (
                <div
                  key={`left-stack-${k}`}
                  onClick={() => jumpToSpread(targetSpreadIndex)}
                  title={`Jump to Spread ${targetSpreadIndex + 1}`}
                  className="absolute top-0 bottom-0 left-0 w-[380px] rounded-l-2xl border-l border-y border-amber-900/15 cursor-pointer hover:border-blue-400/50 transition-colors shadow-sm"
                  style={{
                    backgroundColor: "#f5f1e6",
                    transform: `translate3d(${xOffset}px, 0px, ${zOffset}px) rotateY(${rotY}deg)`,
                    transformOrigin: "right center",
                    zIndex: 10 - k,
                  }}
                >
                  {/* Subtle tab label on left stack edge */}
                  <div className="absolute bottom-4 left-2 text-[9px] font-bold text-amber-900/40 uppercase tracking-widest -rotate-90 origin-bottom-left">
                    P. {targetSpreadIndex * 2 + 1}
                  </div>
                </div>
              );
            })}

          {/* RIGHT PAGE STACK (Unread pages fanned out) */}
          {rightStackCount > 0 &&
            Array.from({ length: rightStackCount }).map((_, idx) => {
              const k = idx + 1;
              const xOffset = k * 7;
              const zOffset = -k * 2;
              const rotY = k * 0.8;
              const targetSpreadIndex = Math.min(totalSpreads - 1, currentSpread + k);
              const stackPageNumber = targetSpreadIndex * 2 + 1;
              return (
                <div
                  key={`right-stack-${k}`}
                  onClick={() => jumpToSpread(targetSpreadIndex)}
                  title={`Jump to Spread ${targetSpreadIndex + 1}`}
                  className="absolute top-0 bottom-0 right-0 w-[380px] rounded-r-2xl border-r border-y border-amber-900/15 cursor-pointer hover:border-blue-400/50 transition-colors shadow-sm"
                  style={{
                    backgroundColor: "#f5f1e6",
                    transform: `translate3d(${xOffset}px, 0px, ${zOffset}px) rotateY(${rotY}deg)`,
                    transformOrigin: "left center",
                    zIndex: 10 - k,
                  }}
                >
                  {/* Stepped Tab Indicator on right stack edge */}
                  <div className="absolute bottom-4 right-2 text-[9px] font-bold text-amber-900/50 uppercase tracking-wider rotate-90 origin-bottom-right">
                    P. {stackPageNumber}
                  </div>
                </div>
              );
            })}

          {/* STATIONARY LEFT PAGE (Underneath Spread) */}
          <div
            onClick={turnPrev}
            className={`absolute top-0 bottom-0 left-0 w-[380px] rounded-l-2xl border-l border-y border-stone-200/60 p-6 flex flex-col justify-between overflow-hidden cursor-pointer group ${
              currentSpread > 0 ? "hover:brightness-98" : "cursor-default"
            }`}
            style={{
              backgroundColor: "#fbf9f4",
              boxShadow: "inset -18px 0 25px -10px rgba(0,0,0,0.12), -6px 8px 18px rgba(0,0,0,0.1)",
              zIndex: 12,
            }}
          >
            {/* Center Spine Crease Gradient on Left Page */}
            <div className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none bg-gradient-to-r from-transparent via-black/[0.04] to-black/[0.16]" />

            {/* Render Content of current left page (or previous if turning backward) */}
            {currentLeftPage && (
              <JournalPageContent
                page={isTurning && turnDirection === "backward" && backwardPrevLeft ? backwardPrevLeft : currentLeftPage}
                side="left"
                onPhotoClick={(page) => setActiveLightbox(page)}
              />
            )}
          </div>

          {/* STATIONARY RIGHT PAGE (Underneath Spread) */}
          <div
            onClick={turnNext}
            className={`absolute top-0 bottom-0 right-0 w-[380px] rounded-r-2xl border-r border-y border-stone-200/60 p-6 flex flex-col justify-between overflow-hidden cursor-pointer group ${
              currentSpread < totalSpreads - 1 ? "hover:brightness-98" : "cursor-default"
            }`}
            style={{
              backgroundColor: "#fbf9f4",
              boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.12), 6px 8px 18px rgba(0,0,0,0.1)",
              zIndex: 12,
            }}
          >
            {/* Center Spine Crease Gradient on Right Page */}
            <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none bg-gradient-to-l from-transparent via-black/[0.04] to-black/[0.16]" />

            {/* Render Content of current right page (or forward next right if turning forward) */}
            {currentRightPage && (
              <JournalPageContent
                page={isTurning && turnDirection === "forward" && forwardNextRight ? forwardNextRight : currentRightPage}
                side="right"
                onPhotoClick={(page) => setActiveLightbox(page)}
              />
            )}
          </div>

          {/* 3D TURNING LEAF (Active when turning forward) */}
          {isTurning && turnDirection === "forward" && currentRightPage && forwardNextLeft && (
            <div
              className="absolute top-0 bottom-0 right-0 w-[380px] pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                transform: `rotateY(${turnAngle}deg)`,
                zIndex: 30,
              }}
            >
              {/* FRONT FACE of turning leaf (Current Right Page) */}
              <div
                className="absolute inset-0 rounded-r-2xl border-r border-y border-stone-200/80 p-6 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: "#fbf9f4",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.15), 10px 15px 30px rgba(0,0,0,0.25)",
                }}
              >
                <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none bg-gradient-to-l from-transparent to-black/[0.15]" />
                <JournalPageContent page={currentRightPage} side="right" />
                {/* Dynamic lift shadow */}
                <div
                  className="absolute inset-0 pointer-events-none bg-black transition-opacity"
                  style={{
                    opacity: Math.max(0, -turnAngle / 180) * 0.35,
                  }}
                />
              </div>

              {/* BACK FACE of turning leaf (Incoming Next Left Page) */}
              <div
                className="absolute inset-0 rounded-l-2xl border-l border-y border-stone-200/80 p-6 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: "#fbf9f4",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  boxShadow: "inset -18px 0 25px -10px rgba(0,0,0,0.15), -10px 15px 30px rgba(0,0,0,0.25)",
                }}
              >
                <div className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none bg-gradient-to-r from-transparent to-black/[0.15]" />
                <JournalPageContent page={forwardNextLeft} side="left" />
                {/* Dynamic landing shadow */}
                <div
                  className="absolute inset-0 pointer-events-none bg-black transition-opacity"
                  style={{
                    opacity: Math.max(0, (turnAngle + 180) / 180) * 0.35,
                  }}
                />
              </div>
            </div>
          )}

          {/* 3D TURNING LEAF (Active when turning backward) */}
          {isTurning && turnDirection === "backward" && currentLeftPage && backwardPrevRight && (
            <div
              className="absolute top-0 bottom-0 left-0 w-[380px] pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "right center",
                transform: `rotateY(${turnAngle}deg)`,
                zIndex: 30,
              }}
            >
              {/* FRONT FACE of turning leaf (Current Left Page) */}
              <div
                className="absolute inset-0 rounded-l-2xl border-l border-y border-stone-200/80 p-6 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: "#fbf9f4",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  boxShadow: "inset -18px 0 25px -10px rgba(0,0,0,0.15), -10px 15px 30px rgba(0,0,0,0.25)",
                }}
              >
                <div className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none bg-gradient-to-r from-transparent to-black/[0.15]" />
                <JournalPageContent page={currentLeftPage} side="left" />
                {/* Dynamic lift shadow */}
                <div
                  className="absolute inset-0 pointer-events-none bg-black transition-opacity"
                  style={{
                    opacity: Math.max(0, turnAngle / 180) * 0.35,
                  }}
                />
              </div>

              {/* BACK FACE of turning leaf (Incoming Prev Right Page) */}
              <div
                className="absolute inset-0 rounded-r-2xl border-r border-y border-stone-200/80 p-6 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: "#fbf9f4",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(-180deg)",
                  boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.15), 10px 15px 30px rgba(0,0,0,0.25)",
                }}
              >
                <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none bg-gradient-to-l from-transparent to-black/[0.15]" />
                <JournalPageContent page={backwardPrevRight} side="right" />
                {/* Dynamic landing shadow */}
                <div
                  className="absolute inset-0 pointer-events-none bg-black transition-opacity"
                  style={{
                    opacity: Math.max(0, (180 - turnAngle) / 180) * 0.35,
                  }}
                />
              </div>
            </div>
          )}

          {/* Visible Center Spine Seam Bar */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 pointer-events-none z-20 flex flex-col justify-between items-center py-3"
            style={{
              background: "linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.25) 100%)",
            }}
          >
            {/* Center spine stitching markers */}
            <div className="w-0.5 h-3 bg-amber-600/40 rounded-full" />
            <div className="w-0.5 h-3 bg-amber-600/40 rounded-full" />
            <div className="w-0.5 h-3 bg-amber-600/40 rounded-full" />
            <div className="w-0.5 h-3 bg-amber-600/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar & Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 px-4 z-20">
        {/* Previous Spread Button */}
        <button
          onClick={turnPrev}
          disabled={currentSpread === 0 || isTurning}
          aria-label="Previous page"
          className="p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white hover:text-blue-400 hover:border-blue-400/50 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Spread Navigation Dots & Counter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center gap-1.5 mr-2">
            {Array.from({ length: totalSpreads }).map((_, sIdx) => {
              const isActive = currentSpread === sIdx;
              return (
                <button
                  key={`spread-dot-${sIdx}`}
                  onClick={() => jumpToSpread(sIdx)}
                  aria-label={`Jump to Spread ${sIdx + 1}`}
                  className="transition-all duration-300 rounded-full h-1.5"
                  style={{
                    width: isActive ? "20px" : "6px",
                    backgroundColor: isActive ? "#3b82f6" : "rgba(255, 255, 255, 0.25)",
                    boxShadow: isActive ? "0 0 10px #3b82f6" : "none",
                  }}
                  title={`Spread ${sIdx + 1}`}
                />
              );
            })}
          </div>

          <span className="text-xs font-bold text-slate-300">
            {currentSpread * 2 + 1}–{Math.min(pages.length, currentSpread * 2 + 2)} / {pages.length}
          </span>
        </div>

        {/* Next Spread Button */}
        <button
          onClick={turnNext}
          disabled={currentSpread >= totalSpreads - 1 || isTurning}
          aria-label="Next page"
          className="p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white hover:text-blue-400 hover:border-blue-400/50 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Auto-Turn Toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-all shadow-md ml-1"
          title={isAutoPlay ? "Pause auto page-turn" : "Start auto page-turn"}
        >
          {isAutoPlay ? (
            <>
              <Pause className="w-3.5 h-3.5 text-blue-400" />
              <span>Auto-Play</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Turn Autoplay</span>
            </>
          )}
        </button>
      </div>

      {/* Helpful Hint */}
      <p className="mt-2 text-[11px] text-slate-400 text-center font-medium">
        Click page edges, drag horizontally, or press Left/Right arrow keys to turn pages • Click photo to enlarge
      </p>

      {/* Full-Screen Photo Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-[360px] sm:h-[460px] bg-black">
                <img
                  src={activeLightbox.image}
                  alt={activeLightbox.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 border-t border-white/10">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {activeLightbox.tag || activeLightbox.category}
                  </span>
                  <span className="text-xs text-slate-400">Page {activeLightbox.pageNumber} of {pages.length}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{activeLightbox.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">{activeLightbox.caption}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {activeLightbox.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {activeLightbox.location}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component: Individual Journal Page Content Layout
function JournalPageContent({
  page,
  side,
  onPhotoClick,
}: {
  page: JournalPage;
  side: "left" | "right";
  onPhotoClick?: (page: JournalPage) => void;
}) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Top Header: Tag Badge & Date/Location */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-900/10 pb-2.5">
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/40 uppercase tracking-wider">
          {page.tag || page.category}
        </span>
        <span className="text-[10px] font-semibold text-stone-500 truncate max-w-[170px]">
          {page.location}
        </span>
      </div>

      {/* Center Polaroid / Journal Photo with Masking Tape */}
      <div className="relative my-auto flex flex-col items-center">
        {/* Realistic Masking Washi Tape at Top */}
        <div
          className="absolute -top-3 z-10 w-20 h-5 pointer-events-none rounded-xs shadow-xs"
          style={{
            background: "rgba(254, 240, 199, 0.78)",
            borderTop: "1px dashed rgba(217, 119, 6, 0.4)",
            borderBottom: "1px dashed rgba(217, 119, 6, 0.4)",
            transform: side === "left" ? "rotate(-1.5deg)" : "rotate(1.5deg)",
          }}
        />

        {/* Polaroid Style White Frame */}
        <div
          onClick={(e) => {
            if (onPhotoClick) {
              e.stopPropagation();
              onPhotoClick(page);
            }
          }}
          className="w-full bg-white p-2.5 sm:p-3 rounded-xs shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-stone-200/90 transition-transform duration-300 group-hover:scale-[1.01] cursor-pointer"
        >
          <div className="relative w-full h-[155px] sm:h-[168px] overflow-hidden rounded-xs bg-stone-100">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover preview zoom icon cue */}
            <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Content: Title, Caption & Page Number */}
      <div className="pt-2">
        <h4 className="font-serif text-base sm:text-lg font-black text-slate-800 leading-snug tracking-tight line-clamp-1 mb-1">
          {page.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-stone-600 font-normal leading-relaxed line-clamp-2 italic mb-2.5">
          "{page.caption}"
        </p>

        <div className="flex items-center justify-between border-t border-amber-900/10 pt-2 text-[10px] font-bold text-stone-400 tracking-wider">
          <span>{page.date}</span>
          <span className="text-amber-800/60 uppercase">
            PAGE {String(page.pageNumber).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
