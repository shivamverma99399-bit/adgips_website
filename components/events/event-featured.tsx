"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Archive, Layers } from "lucide-react";
import { EventItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventFeaturedProps {
  event: EventItem;
}

export function EventFeatured({ event }: EventFeaturedProps) {
  return (
    <div className="mb-14 rounded-3xl bg-gradient-to-br from-[#040915] via-[#0a192f] to-[#142f56] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (7 cols): Event Details & Highlights */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-slate-800/90 text-slate-200 border-slate-700 font-semibold px-3 py-1">
              <Archive className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Institutional Archive & Flagship Record
            </Badge>
            <Badge variant="navy" className="bg-blue-600/30 text-blue-300 border-blue-400/30">
              {event.category}
            </Badge>
            {event.department && (
              <span className="text-xs text-slate-400 font-medium">
                {event.department}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
              {event.title}
            </h2>
            {event.subtitle && (
              <p className="text-sm sm:text-base text-blue-300 font-medium tracking-wide">
                {event.subtitle}
              </p>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {event.description}
          </p>

          {/* Meta Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-normal">Date:</span>
                <span className="font-bold text-white">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-normal">Time:</span>
                <span className="font-bold text-white">{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-normal">Venues:</span>
                <span className="font-bold text-white">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* 6 Flagship Competitions if available */}
          {event.activities && event.activities.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Featured 6 Activity Tracks:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {event.activities.map((act) => (
                  <div
                    key={act.number}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
                        {act.number}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{act.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">{act.tagline}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="white"
              size="md"
              href={`/events/${event.slug}`}
              className="shadow-lg font-bold"
            >
              <span>Explore Event Detail & Archive</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <span className="text-xs text-slate-400">
              Concluded on campus • Official proceedings preserved
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Authentic Official Event Poster */}
        <div className="lg:col-span-5 flex justify-center">
          <Link
            href={`/events/${event.slug}`}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 group block"
          >
            <Image
              src={event.poster || event.image}
              alt={`${event.title} Official Event Poster`}
              width={600}
              height={900}
              className="object-cover w-full h-auto group-hover:scale-102 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>View Full Event Archive Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
