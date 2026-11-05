"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { PlacementRecruiter } from "@/data/institutional-highlights";

interface RecruitmentPartnerRingProps {
  partners: PlacementRecruiter[];
  autoRotateSpeed?: number; // degrees per frame
}

export function RecruitmentPartnerRing({
  partners,
  autoRotateSpeed = 0.32,
}: RecruitmentPartnerRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive geometry state
  const [dimensions, setDimensions] = useState({
    radius: 470,
    cardWidth: 230,
    cardHeight: 300,
  });

  // Track viewport width for responsive tuning
  useEffect(() => {
    function updateDimensions() {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          radius: 310,
          cardWidth: 175,
          cardHeight: 245,
        });
      } else if (width < 1024) {
        setDimensions({
          radius: 390,
          cardWidth: 205,
          cardHeight: 275,
        });
      } else {
        setDimensions({
          radius: 470,
          cardWidth: 230,
          cardHeight: 300,
        });
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Motion physics state
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startPointerXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const stepAngle = 360 / partners.length; // 36 degrees for 10 cards

  // Smooth fast continuous circular animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!isDraggingRef.current) {
        // Apply momentum friction decay if dragged/flicked
        if (Math.abs(velocityRef.current) > 0.01) {
          velocityRef.current *= 0.92;
          rotationRef.current += velocityRef.current;
        } else {
          velocityRef.current = 0;
        }

        // Fast continuous circular rotation
        if (isAutoPlaying) {
          rotationRef.current += autoRotateSpeed;
        }

        setRotation(rotationRef.current);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoPlaying, autoRotateSpeed]);

  // Pointer drag event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    startPointerXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const currentTime = performance.now();
    const deltaX = currentX - lastPointerXRef.current;
    const deltaTime = Math.max(1, currentTime - lastPointerTimeRef.current);

    // Dynamic drag sensitivity based on radius
    const sensitivity = 0.18;
    rotationRef.current += deltaX * sensitivity;
    setRotation(rotationRef.current);

    // Compute instantaneous velocity (degrees per frame approx)
    velocityRef.current = (deltaX / deltaTime) * 16 * sensitivity;

    lastPointerXRef.current = currentX;
    lastPointerTimeRef.current = currentTime;
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }

      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      isInteractingRef.current = false;
    },
    []
  );

  // Jump to specific card index smoothly
  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      isInteractingRef.current = true;

      // Calculate relative angle to target
      const currentRot = rotationRef.current;
      const targetAngle = targetIndex * stepAngle;
      const rel = ((((targetAngle - currentRot) % 360) + 540) % 360) - 180;

      // Animate smoothly using a short interpolation
      const startRot = currentRot;
      const endRot = currentRot + rel;
      const duration = 500; // ms
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const nextRot = startRot + (endRot - startRot) * ease;
        rotationRef.current = nextRot;
        setRotation(nextRot);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          velocityRef.current = 0;
          isInteractingRef.current = false;
        }
      }

      requestAnimationFrame(step);
    },
    [stepAngle]
  );

  // Step next/prev
  const handlePrev = useCallback(() => {
    const currentIndex = Math.round(rotationRef.current / stepAngle);
    rotateToIndex(currentIndex - 1);
  }, [rotateToIndex, stepAngle]);

  const handleNext = useCallback(() => {
    const currentIndex = Math.round(rotationRef.current / stepAngle);
    rotateToIndex(currentIndex + 1);
  }, [rotateToIndex, stepAngle]);

  // Compute active focused company index
  const activeIndex = useMemo(() => {
    const normalized = ((((rotation % 360) + 360) % 360) / stepAngle);
    const rounded = Math.round(normalized) % partners.length;
    return (rounded + partners.length) % partners.length;
  }, [rotation, stepAngle, partners.length]);

  const activePartner = partners[activeIndex];

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Ring Stage Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[400px] sm:h-[440px] md:h-[460px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: 1100,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Ambient Cylinder Depth Glow & Horizon Fog */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="w-[600px] h-[300px] rounded-full blur-[100px] opacity-25 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${activePartner.brandColor} 0%, rgba(30,58,138,0.2) 60%, transparent 80%)`,
            }}
          />
        </div>

        {/* Floating Concave 3D Ring Panels */}
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {partners.map((partner, index) => {
            const nominalAngle = index * stepAngle;
            // Angle relative to viewer center (0 = facing front)
            const relAngle = ((((nominalAngle - rotation) % 360) + 540) % 360) - 180;
            const isVisible = Math.abs(relAngle) <= 88;

            if (!isVisible) return null;

            // Inside-view 3D Cylindrical Geometry:
            // Center is at (0, 0, -radius)
            // Left/right panels curve forward towards the camera (Z increases from -radius toward 0)
            const rad = (relAngle * Math.PI) / 180;
            const x = dimensions.radius * Math.sin(rad);
            const z = -dimensions.radius * Math.cos(rad);
            // rotateY = -relAngle makes card face inwards toward center camera
            const rotateY = -relAngle;

            // Opacity falloff at peripheral cone
            const absRel = Math.abs(relAngle);
            const opacity = Math.max(0, 1 - Math.pow(absRel / 88, 2.2) * 0.7);

            // Stacking: panels closer to viewer (larger Z) naturally layer on top
            const zIndex = Math.round((z + dimensions.radius) * 10) + 10;
            const isFocused = activeIndex === index;

            return (
              <div
                key={partner.name}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDraggingRef.current && Math.abs(velocityRef.current) < 0.1) {
                    rotateToIndex(index);
                  }
                }}
                className="absolute pointer-events-auto transition-[filter,border-color,box-shadow,transform] duration-300 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between group overflow-hidden"
                style={{
                  width: dimensions.cardWidth,
                  height: dimensions.cardHeight,
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${
                    isFocused ? 1.05 : 0.98
                  })`,
                  transformOrigin: "center center",
                  zIndex,
                  opacity,
                  backgroundColor: "rgba(255, 255, 255, 0.96)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderColor: isFocused ? partner.brandColor : "rgba(255, 255, 255, 0.8)",
                  borderWidth: isFocused ? "2px" : "1px",
                  borderStyle: "solid",
                  boxShadow: isFocused
                    ? `0 0 36px ${partner.brandColor}55, 0 20px 45px rgba(0, 0, 0, 0.6)`
                    : "0 14px 30px rgba(0, 0, 0, 0.4)",
                  cursor: "pointer",
                  willChange: "transform, opacity",
                }}
              >
                {/* Subtle top indicator bar on focused card */}
                {isFocused && (
                  <div
                    className="absolute inset-x-0 top-0 h-1 pointer-events-none"
                    style={{ backgroundColor: partner.brandColor }}
                  />
                )}

                {/* Primary Logo Stage: Fills almost entire card surface */}
                <div className="relative w-full flex-1 flex items-center justify-center p-3 sm:p-4 min-h-0">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} authentic logo`}
                    className="w-full h-full max-h-[160px] sm:max-h-[185px] object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Prominent Clean Company Name */}
                <div className="w-full pt-2 pb-1 text-center border-t border-slate-100">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-wide">
                    {partner.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lateral Prev / Next Arrow Overlay Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous recruiter"
          className="absolute left-2 sm:left-4 z-40 p-2.5 sm:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white hover:text-blue-400 hover:border-blue-400/50 hover:bg-slate-800 transition-all shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next recruiter"
          className="absolute right-2 sm:right-4 z-40 p-2.5 sm:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white hover:text-blue-400 hover:border-blue-400/50 hover:bg-slate-800 transition-all shadow-xl hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Under-Carousel Controls Bar & Clean Active Company Info */}
      <div className="mt-3 px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Active Company Presentation & Interactive Navigation */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 bg-white/[0.95] border border-white/40 shadow-md">
            <img
              src={activePartner.logo}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-white">
                {activePartner.name}
              </span>
              <a
                href="#opportunities"
                className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                View Hiring Drives &rarr;
              </a>
            </div>
            <p className="text-xs text-slate-400">
              Institutional Tier-1 Recruitment Partner • Campus Placements
            </p>
          </div>
        </div>

        {/* Interactive Pagination Track & Play/Pause Button */}
        <div className="flex items-center gap-3">
          {/* 10 Partner Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {partners.map((partner, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={partner.name}
                  onClick={() => rotateToIndex(index)}
                  aria-label={`Jump to ${partner.name}`}
                  className="transition-all duration-300 rounded-full h-1.5"
                  style={{
                    width: isActive ? "22px" : "6px",
                    backgroundColor: isActive
                      ? partner.brandColor
                      : "rgba(255, 255, 255, 0.25)",
                    boxShadow: isActive
                      ? `0 0 10px ${partner.brandColor}`
                      : "none",
                  }}
                  title={partner.name}
                />
              );
            })}
          </div>

          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
            title={isAutoPlaying ? "Pause continuous 3D rotation" : "Resume continuous 3D rotation"}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3 h-3 text-blue-400" />
                <span className="text-[11px] hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] hidden sm:inline">Auto-Spin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
