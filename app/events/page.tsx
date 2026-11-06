"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { EventFeatured } from "@/components/events/event-featured";
import { EventFilters } from "@/components/events/event-filters";
import { EventGrid } from "@/components/events/event-grid";
import { filterEvents, getEventStats } from "@/lib/event-utils";
import { getEventsFromSupabase } from "@/lib/supabase/queries";
import { EventItem } from "@/types";
import { Loader2 } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const docs = await getEventsFromSupabase();
        if (isMounted) {
          const normalized: EventItem[] = docs.map((d) => ({
            id: d.id,
            title: d.title,
            subtitle: d.subtitle,
            slug: d.slug,
            description: d.description,
            shortDescription: d.shortDescription,
            date: d.date,
            time: d.time,
            venue: d.venue,
            category: d.category,
            status: d.status,
            image: d.image || "/images/engineering.jpg",
            poster: d.image,
            featured: d.featured,
            registrationLink: d.registrationLink,
            eligibility: d.eligibility || "Open to all GGSIPU Affiliated Students",
            organizedBy: d.organizedBy || "ADGIPS Administration",
            department: d.department,
            tags: d.tags || [],
            activities: d.activities || [],
            highlights: d.highlights || [],
            schedule: d.schedule || [],
          }));
          setEvents(normalized);
        }
      } catch (error) {
        console.error("Error loading events from Firestore:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => getEventStats(events), [events]);

  const filteredEvents = useMemo(() => {
    return filterEvents(events, {
      search: searchQuery,
      status: selectedStatus,
      category: selectedCategory,
    });
  }, [events, searchQuery, selectedStatus, selectedCategory]);

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

          {/* Quick Metrics from Firestore dataset */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg shrink-0 text-center">
            <div className="px-3 py-1">
              <p className="text-xl sm:text-2xl font-extrabold text-white">
                {isLoading ? "—" : stats.total}
              </p>
              <p className="text-[11px] font-medium text-slate-400">Documented Events</p>
            </div>
            <div className="px-3 py-1 border-x border-white/10">
              <p className="text-xl sm:text-2xl font-extrabold text-blue-400">
                {isLoading ? "—" : stats.upcoming}
              </p>
              <p className="text-[11px] font-medium text-slate-400">Upcoming Fests</p>
            </div>
            <div className="px-3 py-1">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-300">
                {isLoading ? "—" : stats.past}
              </p>
              <p className="text-[11px] font-medium text-slate-400">Concluded / Archive</p>
            </div>
          </div>
        </div>

        {/* SECTION B — FEATURED EVENT SPOTLIGHT (LIQUID LENS CAROUSEL) */}
        {isLoading ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md mb-14">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading campus events calendar...</p>
          </div>
        ) : (
          <EventFeatured events={events} />
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
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 text-slate-500 animate-spin mx-auto" />
          </div>
        ) : (
          <EventGrid
            events={filteredEvents}
            onResetFilters={handleClearFilters}
          />
        )}
      </SectionContainer>
    </div>
  );
}
