"use client";

import React, { useState, useMemo } from "react";
import { eventsData } from "@/data/events";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { EventFeatured } from "@/components/events/event-featured";
import { EventFilters } from "@/components/events/event-filters";
import { EventGrid } from "@/components/events/event-grid";
import { filterEvents, getEventStats } from "@/lib/event-utils";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const stats = useMemo(() => getEventStats(eventsData), []);

  const featuredEvent = useMemo(
    () => eventsData.find((e) => e.featured) || eventsData[0],
    []
  );

  const filteredEvents = useMemo(() => {
    return filterEvents(eventsData, {
      search: searchQuery,
      status: selectedStatus,
      category: selectedCategory,
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== "" || selectedStatus !== "all" || selectedCategory !== "All"
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedCategory("All");
  };

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: "Campus Events & Archive" }]} className="mb-2.5" />

        {/* SECTION A — PAGE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs">
                Official Institutional Calendar
              </Badge>
              <span className="text-xs text-slate-400 font-medium">
                GGSIPU Affiliated Campus • Shastri Park
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Campus Events & Archive
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Discover the experiences, celebrations, and academic events that bring the ADGIPS community together — from flagship technical symposiums and trial court moot debates to annual cultural festivals.
            </p>
          </div>

          {/* Quick Metrics from verified dataset */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg shrink-0 text-center">
            <div className="px-3 py-1">
              <p className="text-xl sm:text-2xl font-extrabold text-white">{stats.total}</p>
              <p className="text-[11px] font-medium text-slate-400">Documented Events</p>
            </div>
            <div className="px-3 py-1 border-x border-white/10">
              <p className="text-xl sm:text-2xl font-extrabold text-blue-400">{stats.upcoming}</p>
              <p className="text-[11px] font-medium text-slate-400">Upcoming Fests</p>
            </div>
            <div className="px-3 py-1">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-300">{stats.past}</p>
              <p className="text-[11px] font-medium text-slate-400">Concluded / Archive</p>
            </div>
          </div>
        </div>

        {/* SECTION B — FEATURED EVENT SPOTLIGHT */}
        {featuredEvent && (
          <EventFeatured event={featuredEvent} />
        )}

        {/* SECTION C & D — STATUS TABS & SEARCH FILTERS */}
        <EventFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          totalResultsCount={filteredEvents.length}
          stats={stats}
        />

        {/* SECTION E & G — EVENT LISTING & ARCHIVE GRID */}
        <EventGrid
          events={filteredEvents}
          onResetFilters={handleClearFilters}
        />
      </SectionContainer>
    </div>
  );
}
