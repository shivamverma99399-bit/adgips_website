"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  Scale,
  Music2,
  Trophy,
  Search,
  CheckCircle2,
  X,
  Users,
  Compass,
  Info,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";

interface ClubItem {
  id: string;
  name: string;
  category: "Technical" | "Legal" | "Cultural" | "Sports" | "Management";
  icon: any;
  leads: string;
  description: string;
  badge: string;
  members: string;
  activities: string[];
}

const clubsData: ClubItem[] = [
  {
    id: "ieee-adgips",
    name: "IEEE Student Branch — ADGIPS",
    category: "Technical",
    icon: Code2,
    leads: "Faculty Counselor & Student Execom",
    description:
      "Global engineering community hosting international hackathons, robotics challenges, research paper workshops, and IoT symposions.",
    badge: "Flagship Chapter",
    members: "250+ Members",
    activities: ["Annual Hackathon", "Robotics Bootcamp", "Paper Publishing"],
  },
  {
    id: "moot-court-society",
    name: "Moot Court Society & Legal Aid Clinic",
    category: "Legal",
    icon: Scale,
    leads: "School of Law Faculty Advisors",
    description:
      "Dedicated to grooming advocates through weekly simulated appellate courtroom trials, parliamentary debates, and pro-bono community legal aid initiatives.",
    badge: "BCI Recognized",
    members: "180+ Scholars",
    activities: ["National Moot Court", "Bail Clinic", "Legal Literacy Camps"],
  },
  {
    id: "coding-guild",
    name: "Developer & Algorithmic Coding Guild",
    category: "Technical",
    icon: Code2,
    leads: "Department of CSE & IT",
    description:
      "Competitive programming, open-source development sprints, DSA bootcamps, and organizers of collegiate hackathons and coding challenges.",
    badge: "Active",
    members: "400+ Coders",
    activities: ["Weekly LeetCode Contests", "Full-Stack Bootcamps", "Open Source Hackathons"],
  },
  {
    id: "cultural-collective",
    name: "Swar & Taal: Cultural & Performing Arts",
    category: "Cultural",
    icon: Music2,
    leads: "Student Activity Council (SAC)",
    description:
      "The heartbeat of campus expression — housing the college rock band, classical music ensembles, street theatre (Nukkad Natak), and contemporary dance troupes.",
    badge: "Utkarsh Hosts",
    members: "320+ Artists",
    activities: ["Battle of the Bands", "Street Theatre (Nukkad Natak)", "Western & Classical Dance"],
  },
  {
    id: "sports-federation",
    name: "ADGIPS Athletics & Sports Federation",
    category: "Sports",
    icon: Trophy,
    leads: "Department of Physical Education",
    description:
      "Organizers of the annual inter-departmental trophy across cricket, football, volleyball, kabaddi, table tennis, and badminton championships.",
    badge: "Competitive",
    members: "220+ Athletes",
    activities: ["Inter-Departmental Trophy", "Cricket Premier League", "Athletics Meet"],
  },
  {
    id: "ecell-incubator",
    name: "E-Cell: Entrepreneurship & Venture Incubator",
    category: "Management",
    icon: Sparkles,
    leads: "School of Management Studies",
    description:
      "Empowering student founders with angel investor pitch desks, business plan challenges, and prototype seed funding mentorship.",
    badge: "Incubation Hub",
    members: "150+ Founders",
    activities: ["Pitch Day", "Startup Showcase", "Founder Masterclasses"],
  },
];

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClubForInfo, setSelectedClubForInfo] = useState<ClubItem | null>(null);

  const categories = ["All", "Technical", "Legal", "Cultural", "Sports", "Management"];

  const filteredClubs = useMemo(() => {
    return clubsData.filter((club) => {
      const matchCat =
        selectedCategory === "All" || club.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        club.name.toLowerCase().includes(q) ||
        club.description.toLowerCase().includes(q) ||
        club.category.toLowerCase().includes(q) ||
        club.leads.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <Breadcrumb items={[{ label: "Student Activities & Clubs" }]} className="mb-2.5" />

        <div className="max-w-3xl mb-8">
          <Badge variant="secondary" className="mb-2 font-semibold">
            Campus Life & Societies
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Student Societies & Activities
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            ADGIPS fosters a vibrant collegiate environment with over 25 active student societies spanning software innovation, trial jurisprudence, performing arts, and competitive sports.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/30"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs & societies..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Societies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredClubs.map((club) => {
            const Icon = club.icon;
            return (
              <div
                key={club.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline">{club.badge}</Badge>
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                    {club.category}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                    {club.name}
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">{club.leads}</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {club.description}
                  </p>

                  {/* Highlights tag strip */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {club.activities.map((act) => (
                      <span
                        key={act}
                        className="text-[10px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {club.members}
                  </span>
                  <button
                    onClick={() => setSelectedClubForInfo(club)}
                    className="font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Society Details</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-white/10 mb-12">
            <Compass className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No societies found</h3>
            <p className="text-xs text-slate-400">
              No matching clubs found for &ldquo;{searchQuery}&rdquo;. Try another category or term.
            </p>
          </div>
        )}

        {/* Membership Info Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md text-white border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Want to start a new club or join executive committees?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inductions and executive appointments take place each academic semester under the Student Activity Council (SAC), Shastri Park campus.
            </p>
          </div>
          <Button variant="white" size="md" href="mailto:info@adgips.ac.in" className="shrink-0 font-bold">
            Contact Student Activity Council &rarr;
          </Button>
        </div>

        {/* Society Details & Induction Modal */}
        {selectedClubForInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-[#071126]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden text-white">
              <div className="p-6 border-b border-white/10 flex items-start justify-between">
                <div>
                  <Badge variant="navy" className="text-xs mb-1">
                    {selectedClubForInfo.category} • {selectedClubForInfo.badge}
                  </Badge>
                  <h3 className="text-lg font-bold text-white">
                    {selectedClubForInfo.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedClubForInfo(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-1">Faculty & Department Supervision</h4>
                  <p className="text-slate-400 leading-relaxed">{selectedClubForInfo.leads}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-300 mb-1">Overview & Objectives</h4>
                  <p className="text-slate-300 leading-relaxed">{selectedClubForInfo.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-300 mb-1.5">Flagship Activities & Initiatives</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClubForInfo.activities.map((act) => (
                      <span
                        key={act}
                        className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <Info className="w-4 h-4" />
                    <span>Cohort Induction & Membership</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Induction orientations, team registrations, and executive committee elections are held at the beginning of each semester. Visit the respective department office or email the Student Activity Council.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClubForInfo(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    href={`mailto:info@adgips.ac.in?subject=Inquiry regarding ${encodeURIComponent(selectedClubForInfo.name)}`}
                  >
                    Email Council Desk
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
