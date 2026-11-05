"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Compass,
  BookOpen,
  Image as ImageIcon,
  GraduationCap,
  ArrowRight,
  Layers,
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
      href: "/events",
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

  {/*const portalGateways = [
    { title: "Campus Events", href: "/events", icon: Calendar, subtitle: "Fests & Symposiums" },
    { title: "Student Activities", href: "/activities", icon: Compass, subtitle: "25+ Clubs & IEEE" },
    { title: "Academic Resources", href: "/resources", icon: BookOpen, subtitle: "Curriculum & PYQs" },
    { title: "Campus Gallery", href: "/gallery", icon: ImageIcon, subtitle: "Visual Archives" },
    { title: "Student Portal", href: "/login", icon: GraduationCap, subtitle: "Attendance & Marks" },
  ];*/
}

  return (
    <SectionContainer id="campus-showcase" className="py-12 sm:py-16 bg-transparent border-b border-white/10">
      {/* Editorial Header */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-xs">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Campus Index • 3D Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Explore ADGIPS in{" "}
            <span className="font-serif italic font-normal text-blue-400">3D Perspective</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
          Interact with our 8.08-acre Shastri Park campus, engineering research bays, moot court chambers, and vibrant student fests through the interactive card stack.
        </p>
      </motion.div>

      {/* 3D STACKED IMAGE CAROUSEL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <StackedCarousel
          items={campusShowcaseItems}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </motion.div>

      {/* COMPACT INSTITUTIONAL PORTAL GATEWAY RIBBON
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg"
      >*/}
        {/*<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Direct Institutional Portals
          </span>
          <span className="text-[11px] text-blue-400 font-semibold">
            Select a gateway to access student services
          </span>
        </div>

        {/*<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {portalGateways.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                      {portal.title}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{portal.subtitle}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </Link>
            );
          })}
        </div>*/}

    </SectionContainer>
  );
}
