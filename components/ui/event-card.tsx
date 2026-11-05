"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Building } from "lucide-react";
import { EventItem } from "@/types";
import { Badge } from "./badge";
import { Button } from "./button";
import { getNormalizedEventStatus } from "@/lib/event-utils";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
  featured?: boolean;
  className?: string;
}

export function EventCard({ event, featured = false, className }: EventCardProps) {
  const normalizedStatus = getNormalizedEventStatus(event);

  const getStatusBadge = () => {
    switch (normalizedStatus) {
      case "past":
        return (
          <Badge variant="default" className="bg-slate-800 text-slate-200 border-slate-700">
            Concluded • Archive
          </Badge>
        );
      case "ongoing":
        return <Badge variant="accent">Happening Now</Badge>;
      case "upcoming":
        if (event.status === "registrations_open") {
          return <Badge variant="urgent">Registrations Open</Badge>;
        }
        return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  const detailUrl = `/events/${event.slug}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-white",
        featured && "md:col-span-2 lg:flex-row",
        className
      )}
    >
      {/* Event Thumbnail */}
      <Link
        href={detailUrl}
        className={cn(
          "relative overflow-hidden bg-slate-950 shrink-0 block",
          featured ? "w-full lg:w-1/2 aspect-video lg:aspect-auto min-h-[260px]" : "w-full aspect-[16/10]"
        )}
      >
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="navy" className="bg-slate-900/90 backdrop-blur-md border border-white/20">
            {event.category}
          </Badge>
          {getStatusBadge()}
        </div>
      </Link>

      {/* Content Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-medium text-slate-400 mb-2.5">
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5 truncate max-w-[180px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {event.venue}
            </span>
          </div>

          {/* Department / Organiser indicator if present */}
          {event.department && (
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" />
              <span className="truncate">{event.department}</span>
            </p>
          )}

          {/* Title with link */}
          <Link href={detailUrl} className="block group/title">
            <h3
              className={cn(
                "font-bold text-white group-hover/title:text-blue-300 transition-colors line-clamp-2 leading-snug",
                featured ? "text-xl sm:text-2xl mb-2" : "text-lg mb-2"
              )}
            >
              {event.title}
            </h3>
          </Link>

          {event.subtitle && (
            <p className="text-xs font-medium text-blue-400 mb-2 line-clamp-1">{event.subtitle}</p>
          )}

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {event.shortDescription || event.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 truncate max-w-[200px]">{event.eligibility}</span>
          <Button
            variant="outline"
            size="sm"
            href={detailUrl}
            className="shrink-0 font-semibold"
          >
            <span>{normalizedStatus === "past" ? "View Archive" : "View Details"}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
