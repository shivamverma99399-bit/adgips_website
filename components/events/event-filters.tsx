"use client";

import React from "react";
import { Search, X, Filter } from "lucide-react";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalResultsCount: number;
  stats: {
    total: number;
    upcoming: number;
    past: number;
    ongoing: number;
  };
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
  totalResultsCount,
  stats,
}: EventFiltersProps) {
  const statusTabs = [
    { id: "all", label: "All Events", count: stats.total },
    { id: "upcoming", label: "Upcoming", count: stats.upcoming },
    { id: "ongoing", label: "Ongoing", count: stats.ongoing },
    { id: "past", label: "Past & Archive", count: stats.past },
  ];

  const categories: string[] = [
    "All",
    "Technical",
    "Cultural",
    "Academic",
    "Workshops",
    "Seminars",
    "Sports",
    "Institutional",
    "Competitions",
  ];

  return (
    <div className="space-y-6 mb-10">
      {/* Top Controls Row: Status Tabs + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
        {/* Status Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 no-scrollbar">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar Input */}
        <div className="relative min-w-[260px] md:w-80 px-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, venue, or department..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 mr-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filters Clear Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{totalResultsCount}</strong> event{totalResultsCount === 1 ? "" : "s"}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
