"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  Library,
  Search,
  BookOpen,
  FileText,
  Layers,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getResources, AcademicResource } from "@/data/resources";

export default function ResourcesPage() {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [selectedStream, setSelectedStream] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    setResources(getResources());

    const handleUpdate = () => {
      setResources(getResources());
    };

    window.addEventListener("adgips_resources_updated", handleUpdate);
    return () => window.removeEventListener("adgips_resources_updated", handleUpdate);
  }, []);

  const streams = ["All", "Engineering", "Law", "Management"];
  const types = ["All", "Syllabus Scheme", "Previous Year Paper", "Lab Manual", "Lecture Notes"];
  const semesters = ["All", "Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7 & 8"];

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchStream = selectedStream === "All" || res.stream === selectedStream;
      const matchType = selectedType === "All" || res.type === selectedType;
      const matchSem =
        selectedSemester === "All" ||
        res.semester.toLowerCase().includes(selectedSemester.toLowerCase().replace("sem ", "semester "));
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.code.toLowerCase().includes(q) ||
        res.department.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q);

      return matchStream && matchType && matchSem && matchQuery;
    });
  }, [resources, selectedStream, selectedType, selectedSemester, searchQuery]);

  const handleDownload = (res: AcademicResource) => {
    if (res.fileUrl && (res.fileUrl.startsWith("http://") || res.fileUrl.startsWith("https://") || res.fileUrl.startsWith("/"))) {
      window.open(res.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    toast({
      title: "Document Repository Link",
      description: `Official document repository link for ${res.code} will be available once uploaded to the server repository.`,
      type: "info",
    });
  };

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <Breadcrumb items={[{ label: "Academic Resources" }]} className="mb-2.5" />

        {/* Page Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="secondary" className="mb-2 font-semibold">
            Knowledge Commons
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Academic Resources & Subject Nav
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Central repository of university examination schemas, course handouts, past examination papers, and digital library e-resources affiliated with GGSIPU.
          </p>
        </div>

        {/* Digital Library Access Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md text-white border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-600 text-white shrink-0 mt-1 shadow-lg shadow-blue-600/30">
              <Library className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Central Research & E-Library Portal
                </h2>
                <Badge variant="navy" className="text-[10px]">
                  Delnet & IEEE Active
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                85,000+ volumes, Delnet subscription, and IEEE Xplore remote access. Click below to view registered textbooks or access digital handouts.
              </p>
            </div>
          </div>
          <Button
            variant="white"
            size="md"
            href="https://adgips.ac.in"
            external
            className="shrink-0 font-bold"
          >
            Access Institutional Portal &rarr;
          </Button>
        </div>

        {/* Filter Navigation Cluster */}
        <div className="space-y-4 mb-8 p-5 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg text-white">
          {/* Row 1: Search & Stream Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Stream Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {streams.map((stream) => (
                <button
                  key={stream}
                  onClick={() => setSelectedStream(stream)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedStream === stream
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/30"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code (e.g. ETCS-101), title, or branch..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Secondary Filters (Resource Type & Semester) */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Type Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-blue-400" /> Type:
              </span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedType === type
                      ? "bg-emerald-600 text-white font-semibold"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Total Results Count */}
            <span className="text-[11px] text-slate-400 font-mono">
              Showing {filteredResources.length} matching resources
            </span>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-blue-400/40 hover:bg-white/10 hover:shadow-xl transition-all group text-white space-y-4"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-400/20 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {item.type}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.semester}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5">
                  {item.title}
                </h3>

                {/* Department */}
                <p className="text-xs text-slate-400 font-medium mb-2">
                  {item.department} • Cycle {item.year}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Card Footer: Size & Working Download Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  {item.format} • {item.fileSize}
                </span>

                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                  title={`Download ${item.title}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resource</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-white/10 mb-12">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No resources found</h3>
            <p className="text-xs text-slate-400">
              No matching academic resources for your selected filters. Try broadening your criteria.
            </p>
          </div>
        )}

        {/* Bottom Curriculum Information */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 text-white text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All syllabus documents are compliant with statutory GGSIPU credit schemes.</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-blue-400">
            <a href="https://adgips.ac.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
              GGSIPU Examination Portal &rarr;
            </a>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
