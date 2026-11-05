"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search as SearchIcon, X, Calendar, Briefcase, Bell, ArrowRight } from "lucide-react";
import { eventsData } from "@/data/events";
import { opportunitiesData } from "@/data/opportunities";
import { announcementsData } from "@/data/announcements";
import { Badge } from "./badge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return eventsData.slice(0, 3);
    const q = query.toLowerCase();
    return eventsData.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const filteredOpportunities = useMemo(() => {
    if (!query.trim()) return opportunitiesData.slice(0, 3);
    const q = query.toLowerCase();
    return opportunitiesData.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const filteredAnnouncements = useMemo(() => {
    if (!query.trim()) return announcementsData.slice(0, 3);
    const q = query.toLowerCase();
    return announcementsData.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#071126]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 text-white"
        role="dialog"
        aria-modal="true"
        aria-label="Campus Search"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <SearchIcon className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campus events, hackathons, opportunities, notices..."
            autoFocus
            className="w-full text-white placeholder-slate-400 bg-transparent text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-medium text-slate-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Events Section */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Events & Competitions
                </span>
                <span>{filteredEvents.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.slug}`}
                    onClick={handleClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                          {evt.title}
                        </span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                          {evt.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{evt.venue} • {evt.date}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0 transform group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities Section */}
          {filteredOpportunities.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Student Opportunities
                </span>
                <span>{filteredOpportunities.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredOpportunities.map((opp) => (
                  <Link
                    key={opp.id}
                    href={`/#opportunities`}
                    onClick={handleClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                          {opp.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                          {opp.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{opp.organization} • Deadline: {opp.deadline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0 transform group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Section */}
          {filteredAnnouncements.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" /> Announcements & Circulars
                </span>
                <span>{filteredAnnouncements.length} found</span>
              </div>
              <div className="space-y-1.5">
                {filteredAnnouncements.map((anc) => (
                  <Link
                    key={anc.id}
                    href={`/#announcements`}
                    onClick={handleClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="min-w-0 pr-3">
                      <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors block truncate">
                        {anc.title}
                      </span>
                      <p className="text-xs text-slate-400 truncate">{anc.category} • {anc.date}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 transform group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && filteredOpportunities.length === 0 && filteredAnnouncements.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &ldquo;Cultural Fest&rdquo;, &ldquo;Hackathon&rdquo;, or &ldquo;Exam&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-slate-300 shadow-xs">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-slate-300 shadow-xs">↵</kbd> to select</span>
          </div>
          <span>ADGIPS Unified Search</span>
        </div>
      </div>
    </div>
  );
}
