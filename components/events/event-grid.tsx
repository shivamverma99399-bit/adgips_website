"use client";

import React from "react";
import { EventItem } from "@/types";
import { EventCard } from "@/components/ui/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarSearch } from "lucide-react";

interface EventGridProps {
  events: EventItem[];
  onResetFilters?: () => void;
}

export function EventGrid({ events, onResetFilters }: EventGridProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={<CalendarSearch className="w-8 h-8 text-slate-400" />}
        title="No Campus Events Found"
        description="We couldn't find any events matching your selected criteria. Try adjusting your search query, status tab, or category filters."
        actionText="Reset All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((evt) => (
        <EventCard key={evt.id} event={evt} />
      ))}
    </div>
  );
}
