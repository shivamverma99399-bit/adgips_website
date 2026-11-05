"use client";

import React from "react";
import { EventItem } from "@/types";
import { LiquidLensCarousel } from "@/components/ui/liquid-lens-carousel";
import { eventsData } from "@/data/events";

interface EventFeaturedProps {
  event?: EventItem;
  events?: EventItem[];
}

export function EventFeatured({ event, events }: EventFeaturedProps) {
  const displayEvents =
    events && events.length > 0
      ? events
      : event
      ? [event, ...eventsData.filter((e) => e.id !== event.id)]
      : eventsData;

  return (
    <section className="mb-14" aria-label="Featured Campus Events Liquid Lens Showcase">
      <LiquidLensCarousel events={displayEvents} />
    </section>
  );
}
