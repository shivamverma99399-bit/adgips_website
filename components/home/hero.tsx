"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  heroContainerVariants,
  heroLineVariants,
  fadeInUp,
} from "@/lib/animations";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative overflow-hidden min-h-[480px] sm:min-h-[540px] md:min-h-[600px] flex flex-col justify-between pt-3 sm:pt-4 md:pt-6 pb-6 sm:pb-8 md:pb-12 border-b border-white/10 bg-transparent">
      {/* 1. CRYSTAL CLEAR UNFILTERED BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-transparent">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/videos/hdr-video-quality.mp4" type="video/mp4" />
          <source src="/hdr-video-quality.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. FLOATING FOREGROUND CONTENT LAYER WITH CRISP HIGH-CONTRAST TYPOGRAPHY */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Top Meta Row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
        >
          {/* Institutional Pill */}
          {/*<motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md shadow-lg border border-white/20 text-[11px] font-bold tracking-wider uppercase transition-colors"
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shadow-xs">
              <Building2 className="w-2.5 h-2.5" />
            </span>
            <span>Dr. Akhilesh Das Gupta Institute of Professional Studies</span>
          </motion.div>*/}

          {/* Video Controls with Micro-Interactions */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause background video" : "Play background video"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 text-[10px] font-bold shadow-md transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Pause Video</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400" />
                  <span>Play Video</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-md transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </motion.button>
          </div>
        </motion.div>

        {/* HERO TEXT REVEAL — CRISP FLOATING EDITORIAL HEADLINE */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainerVariants}
          className="my-auto py-8 sm:py-12 md:py-16"
        >
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
              <motion.span variants={heroLineVariants} className="block drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                YOUR CAMPUS.
              </motion.span>
              <motion.span
                variants={heroLineVariants}
                className="block font-serif italic font-normal text-cyan-400 lowercase tracking-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              >
                your opportunities.
              </motion.span>
              <motion.span variants={heroLineVariants} className="block drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                YOUR FUTURE.
              </motion.span>
            </h1>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
