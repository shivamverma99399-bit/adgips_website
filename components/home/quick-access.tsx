"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Layers,
  GraduationCap,
  Scale,
  Cpu,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { StackedCarousel, StackedCarouselItem } from "@/components/ui/stacked-carousel";
import { sectionVariants } from "@/lib/animations";

export function QuickAccess() {
  const campusShowcaseItems: StackedCarouselItem[] = [
    {
      id: "campus-main",
      title: "8.08-Acre Shastri Park Academic Complex",
      description:
        "Five interconnected academic blocks spanning over 23,636 m² of built-up infrastructure with green campus courtyards in East Delhi.",
      category: "Campus Architecture",
      image: "/images/campus-main.png",
      tag: "Shastri Park, Delhi",
      href: "/gallery",
    },
    {
      id: "engineering-labs",
      title: "Advanced Systems & Robotics Laboratories",
      description:
        "Gigabit-speed computing bays equipped with AI research workstations, robotics kits, and cloud infrastructure for B.Tech innovators.",
      category: "School of Engineering",
      image: "/images/engineering.jpg",
      tag: "AICTE Approved",
      href: "/resources",
    },
    {
      id: "law-moot-court",
      title: "Moot Court Hall & Trial Advocacy Chambers",
      description:
        "Full-scale courtroom simulation facility approved by the Bar Council of India (BCI) for national moot competitions and legal aid clinics.",
      category: "School of Law",
      image: "/images/law-moot-court.jpg",
      tag: "BCI Approved",
      href: "/activities",
    },
    {
      id: "digital-library",
      title: "Central Digital Research Library",
      description:
        "Spacious multi-tiered learning commons holding over 85,000 volumes, IEEE Xplore digital subscriptions, and quiet thesis study bays.",
      category: "Knowledge Commons",
      image: "/images/library.jpg",
      tag: "85,000+ Volumes",
      href: "/resources",
    },
    {
      id: "placement-crc",
      title: "Corporate Resource Centre & Placement Drives",
      description:
        "Active industry recruitment partnerships securing 44+ LPA peak packages with Microsoft, Oracle, Infosys, TCS, and Amazon.",
      category: "Career & Placements",
      image: "/images/campus-life.jpg",
      tag: "Corporate Trajectory",
      badge: "44+ LPA Tier-1",
      href: "#highlights",
    },
    {
      id: "cultural-fest",
      title: "Utkarsh Annual Cultural & Music Fiesta",
      description:
        "Premier collegiate fest uniting thousands of students across North India for musical concerts, choreography, theatricals, and fine arts.",
      category: "Collegiate Celebrations",
      image: "/images/cultural-fest.jpg",
      tag: "Utkarsh Fiesta",
      badge: "Annual Festival",
      href: "/events",
    },
    {
      id: "hackathons",
      title: "36-Hour Hackathons & Technical Symposiums",
      description:
        "Inter-collegiate hackathons, coding sprints, and project competitions hosted by the IEEE Student Branch and developer societies.",
      category: "Technical Societies",
      image: "/images/hackathon.jpg",
      tag: "Student Innovation",
      badge: "25+ Clubs",
      href: "/activities",
    },
    {
      id: "management-studies",
      title: "Executive Management Lecture Amphitheatre",
      description:
        "Tiered executive classrooms with digital smart-boards designed for business case studies, managerial analytics, and guest corporate lectures.",
      category: "School of Management",
      image: "/images/management.jpg",
      tag: "GGSIPU Affiliated",
      badge: "MBA & BBA",
      href: "/resources",
    },
    {
      id: "sports-arena",
      title: "Collegiate Sports Arena & Athletic Grounds",
      description:
        "Comprehensive athletic facilities for football, volleyball, badminton, and martial arts fostering collegiate fitness and sportsmanship.",
      category: "Sports & Fitness",
      image: "/images/sports.jpg",
      tag: "Athletic Excellence",
      badge: "Inter-College",
      href: "/gallery",
    },
  ];

  const campusGateways = [
    {
      title: "Engineering & AI Labs",
      desc: "Gigabit-speed computing & robotics bays",
      icon: Cpu,
      href: "/resources",
      badge: "B.Tech",
    },
    {
      title: "Moot Court Chambers",
      desc: "Full-scale courtroom trial advocacy",
      icon: Scale,
      href: "/activities",
      badge: "School of Law",
    },
    {
      title: "Central Digital Library",
      desc: "85,000+ volumes & IEEE Xplore access",
      icon: BookOpen,
      href: "/resources",
      badge: "E-Library",
    },
    {
      title: "Corporate Resource Centre",
      desc: "44+ LPA peak packages & recruitment",
      icon: Briefcase,
      href: "#highlights",
      badge: "Placements",
    },
  ];

  return (
    <SectionContainer id="campus-showcase" className="py-12 sm:py-16 bg-transparent border-b border-white/10">
      {/* Editorial Chapter Header */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2.5 backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>02 / Discover Your Campus</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Where Architecture Meets{" "}
            <span className="font-serif italic font-normal text-blue-400">Academic Rigour</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            From 8.08 acres of eco-friendly infrastructure and cutting-edge robotics laboratories to full-scale moot court trial chambers, explore the physical spaces where ADGIPS scholars learn, collaborate, and innovate.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 3D Stack View</span>
        </div>
      </motion.div>

      {/* 3D STACKED IMAGE CAROUSEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <StackedCarousel
          items={campusShowcaseItems}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </motion.div>

      {/* COMPACT INSTITUTIONAL CAMPUS HUBS RIBBON */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        {campusGateways.map((gate) => {
          const Icon = gate.icon;
          return (
            <Link
              key={gate.title}
              href={gate.href}
              className="group p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 hover:border-blue-400/40 backdrop-blur-md transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {gate.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mb-0.5">
                  {gate.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {gate.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-blue-400 font-semibold group-hover:text-blue-300 mt-2">
                <span>Explore Facility</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
}
