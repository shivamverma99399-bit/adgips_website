import { EventItem } from "@/types";

/**
 * Normalizes event status into three main lifecycle phases:
 * 'upcoming', 'ongoing', or 'past'
 */
export function getNormalizedEventStatus(event: EventItem): "upcoming" | "ongoing" | "past" {
  if (event.isPast || event.status === "past" || event.status === "completed") {
    return "past";
  }
  if (event.status === "ongoing") {
    return "ongoing";
  }
  return "upcoming";
}

/**
 * Filter events by search term, status tab, and category
 */
export interface EventFilterOptions {
  search?: string;
  status?: string; // 'all' | 'upcoming' | 'ongoing' | 'past'
  category?: string; // 'All' | EventCategory
}

export function filterEvents(
  events: EventItem[],
  options: EventFilterOptions
): EventItem[] {
  const { search = "", status = "all", category = "All" } = options;
  const q = search.trim().toLowerCase();

  return events.filter((event) => {
    // 1. Status Filter
    if (status !== "all") {
      const normalized = getNormalizedEventStatus(event);
      if (normalized !== status) {
        return false;
      }
    }

    // 2. Category Filter
    if (category !== "All") {
      if (event.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
    }

    // 3. Search Query Filter
    if (q) {
      const inTitle = event.title.toLowerCase().includes(q);
      const inSubtitle = event.subtitle?.toLowerCase().includes(q) ?? false;
      const inDesc = event.description.toLowerCase().includes(q);
      const inShortDesc = event.shortDescription?.toLowerCase().includes(q) ?? false;
      const inVenue = event.venue.toLowerCase().includes(q);
      const inDept = event.department?.toLowerCase().includes(q) ?? false;
      const inOrg = event.organizedBy.toLowerCase().includes(q);
      const inCategory = event.category.toLowerCase().includes(q);
      const inTags = event.tags.some((t) => t.toLowerCase().includes(q));
      const inActivities =
        event.activities?.some(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.tagline.toLowerCase().includes(q)
        ) ?? false;

      if (
        !inTitle &&
        !inSubtitle &&
        !inDesc &&
        !inShortDesc &&
        !inVenue &&
        !inDept &&
        !inOrg &&
        !inCategory &&
        !inTags &&
        !inActivities
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Find related events based on shared category, department, or tags
 */
export function getRelatedEvents(
  currentEvent: EventItem,
  allEvents: EventItem[],
  limit = 3
): EventItem[] {
  return allEvents
    .filter((e) => e.id !== currentEvent.id && e.slug !== currentEvent.slug)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (a.category === currentEvent.category) scoreA += 3;
      if (b.category === currentEvent.category) scoreB += 3;

      if (a.department && currentEvent.department && a.department === currentEvent.department) {
        scoreA += 2;
      }
      if (b.department && currentEvent.department && b.department === currentEvent.department) {
        scoreB += 2;
      }

      const commonTagsA = a.tags.filter((t) => currentEvent.tags.includes(t)).length;
      const commonTagsB = b.tags.filter((t) => currentEvent.tags.includes(t)).length;
      scoreA += commonTagsA;
      scoreB += commonTagsB;

      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Compute key statistics derived from the event dataset
 */
export function getEventStats(events: EventItem[]) {
  const total = events.length;
  let upcoming = 0;
  let past = 0;
  let ongoing = 0;

  events.forEach((e) => {
    const status = getNormalizedEventStatus(e);
    if (status === "upcoming") upcoming++;
    else if (status === "past") past++;
    else if (status === "ongoing") ongoing++;
  });

  const categories = Array.from(new Set(events.map((e) => e.category)));

  return {
    total,
    upcoming,
    past,
    ongoing,
    categoriesCount: categories.length,
  };
}
