"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  const hasFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return hasFinePointer && !prefersReducedMotion;
}

function getServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const isEnabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer follower ring spring physics
  const ringSpringConfig = { damping: 26, stiffness: 320, mass: 0.5 };
  const followerX = useSpring(cursorX, ringSpringConfig);
  const followerY = useSpring(cursorY, ringSpringConfig);

  // Subtle trailing dot spring physics (slightly softer & lagged for organic fluid trailing)
  const trailSpringConfig = { damping: 30, stiffness: 200, mass: 0.75 };
  const trailX = useSpring(cursorX, trailSpringConfig);
  const trailY = useSpring(cursorY, trailSpringConfig);

  useEffect(() => {
    if (!isEnabled) return;

    const handleTouch = () => {
      setIsTouchDevice(true);
      setIsVisible(false);
    };

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible && !isTouchDevice) {
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest('[role="button"]') ||
        target?.closest("input") ||
        target?.closest("textarea") ||
        target?.closest("select") ||
        target?.closest("label") ||
        target?.closest(".cursor-pointer") ||
        target?.closest(".interactive-element")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isEnabled, isVisible, isTouchDevice, cursorX, cursorY]);

  if (!isEnabled || isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Follower Ring with scale-up interaction over clickable elements */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-blue-500/60"
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 48 : 26,
          height: isHovered ? 48 : 26,
          backgroundColor: isHovered ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.02)",
          borderColor: isHovered ? "rgba(37, 99, 235, 0.75)" : "rgba(37, 99, 235, 0.35)",
        }}
        transition={{
          duration: 0.18,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Subtle Trailing Glow Particle */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-blue-400/40"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 8 : 4,
          height: isHovered ? 8 : 4,
          opacity: isHovered ? 0.6 : 0.4,
        }}
        transition={{
          duration: 0.2,
        }}
      />

      {/* Precise Center Pointer Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-blue-600 shadow-sm"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 6 : 4,
          height: isHovered ? 6 : 4,
        }}
        transition={{
          duration: 0.12,
        }}
      />
    </>
  );
}
