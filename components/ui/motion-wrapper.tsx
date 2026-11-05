"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import {
  staggerItem,
  cardHoverTransition,
  floatingBackgroundVariants,
  imageEntranceVariants,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

/**
 * SectionReveal: Wraps a section to reveal smoothly as it enters the viewport
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"section"> & { delay?: number }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/**
 * StaggerList: Container that staggers the appearance of child items
 */
export function StaggerList({
  children,
  className,
  staggerDelay = 0.08,
  ...props
}: HTMLMotionProps<"div"> & { staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem: An individual item inside a StaggerList
 */
export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * CardHover: Wraps any card with smooth hover lift and spring physics
 */
export function CardHover({
  children,
  className,
  yOffset = -6,
  ...props
}: HTMLMotionProps<"div"> & { yOffset?: number }) {
  return (
    <motion.div
      whileHover={{
        y: yOffset,
        transition: cardHoverTransition,
      }}
      whileTap={{ scale: 0.99 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ImageEntrance: Smooth image entrance scale + fade-in
 */
export function ImageEntrance({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={imageEntranceVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * FloatingAmbientBlob: Subtle drifting ambient glow for background movement
 */
export function FloatingAmbientBlob({
  className,
}: {
  className?: string;
}) {
  return (
    <motion.div
      variants={floatingBackgroundVariants}
      animate="animate"
      className={cn(
        "absolute rounded-full blur-3xl pointer-events-none opacity-40 mix-blend-multiply",
        className
      )}
    />
  );
}
