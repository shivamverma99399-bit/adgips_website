"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-slate-200/80 dark:bg-slate-800/80",
        shimmer ? "animate-shimmer" : "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

/**
 * ImageSkeleton: Loading placeholder for aspect-ratio responsive image containers
 */
export function ImageSkeleton({
  className,
  aspect = "video",
}: {
  className?: string;
  aspect?: "video" | "square" | "portrait" | "wide";
}) {
  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
      ? "aspect-[3/4]"
      : "aspect-[16/10]";

  return <Skeleton className={cn("w-full rounded-2xl", aspectClass, className)} />;
}

/**
 * CardSkeleton: Structured loading placeholder for cards (events, opportunities, etc.)
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs",
        className
      )}
    >
      <Skeleton className="w-full aspect-[16/10] rounded-xl" />
      <div className="space-y-2.5">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * ContentSkeleton: Loading placeholder for articles, circulars, or text blocks
 */
export function ContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-7 w-2/3 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-4/5 rounded-md" />
    </div>
  );
}

/**
 * ImageWithSkeleton: Smart wrapper that displays a shimmer skeleton until the Next.js image finishes loading
 */
export function ImageWithSkeleton({
  alt,
  className,
  wrapperClassName,
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", wrapperClassName)}>
      {!loaded && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full rounded-[inherit]" />
      )}
      <Image
        alt={alt}
        className={cn(
          "transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
}
