import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Layers,
  Archive,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/ui/event-card";
import { EventActionButton } from "@/components/events/event-action-button";
import { getNormalizedEventStatus, getRelatedEvents } from "@/lib/event-utils";
import { getEventBySlugFromSupabase, getEventsFromSupabase } from "@/lib/supabase/queries";
import { EventItem } from "@/types";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const instant = false;

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const eventDoc = await getEventBySlugFromSupabase(slug);

  if (!eventDoc) {
    return {
      title: "Event Not Found — ADGIPS Delhi",
    };
  }

  return {
    title: `${eventDoc.title} — ADGIPS Campus Events`,
    description: eventDoc.shortDescription || eventDoc.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const [eventDoc, allDocs] = await Promise.all([
    getEventBySlugFromSupabase(slug),
    getEventsFromSupabase(),
  ]);

  if (!eventDoc) {
    notFound();
  }

  const event: EventItem = {
    id: eventDoc.id,
    title: eventDoc.title,
    subtitle: eventDoc.subtitle,
    slug: eventDoc.slug,
    description: eventDoc.description,
    shortDescription: eventDoc.shortDescription,
    date: eventDoc.date,
    time: eventDoc.time,
    venue: eventDoc.venue,
    category: eventDoc.category,
    status: eventDoc.status,
    image: eventDoc.image || "/images/engineering.jpg",
    poster: eventDoc.image || "/images/engineering.jpg",
    featured: eventDoc.featured,
    registrationLink: eventDoc.registrationLink,
    eligibility: eventDoc.eligibility || "Open to all GGSIPU Affiliated Students",
    organizedBy: eventDoc.organizedBy || "ADGIPS Administration",
    department: eventDoc.department,
    tags: eventDoc.tags || [],
    activities: eventDoc.activities || [],
    highlights: eventDoc.highlights || [],
    schedule: eventDoc.schedule || [],
  };

  const allEvents: EventItem[] = allDocs.map((d) => ({
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
    poster: d.image || "/images/engineering.jpg",
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

  const normalizedStatus = getNormalizedEventStatus(event);
  const isPast = normalizedStatus === "past";
  const relatedEvents = getRelatedEvents(event, allEvents, 3);

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <Breadcrumb
            items={[
              { label: "Campus Events", href: "/events" },
              { label: event.title },
            ]}
          />
          <Link
            href="/events"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* Event Header Hero */}
        <div className="relative rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden mb-12 text-white">
          {/* Top Banner Image Composition */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-950">
            <Image
              src={event.poster || event.image}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Badges on Banner */}
            <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2 z-10">
              <Badge variant="navy" className="bg-slate-900/90 backdrop-blur-md px-3 py-1 text-xs border border-white/20">
                {event.category}
              </Badge>
              {isPast ? (
                <Badge variant="default" className="bg-slate-900/90 text-slate-200 border-white/20 px-3 py-1 text-xs">
                  <Archive className="w-3 h-3 mr-1 text-blue-400" />
                  Concluded • Archive
                </Badge>
              ) : event.status === "registrations_open" ? (
                <Badge variant="urgent" className="px-3 py-1 text-xs">
                  Registrations Open
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-3 py-1 text-xs">
                  Upcoming Event
                </Badge>
              )}
            </div>

            {/* Title & Metadata inside bottom of Banner */}
            <div className="absolute bottom-6 left-6 right-6 text-white max-w-4xl">
              {event.department && (
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{event.department}</span>
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                {event.title}
              </h1>
              {event.subtitle && (
                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  {event.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Meta Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Date:
              </span>
              <p className="font-bold text-white text-sm">{event.date}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> Time:
              </span>
              <p className="font-bold text-white text-sm">{event.time}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Venue:
              </span>
              <p className="font-bold text-white text-sm truncate">{event.venue}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-400" /> Eligibility:
              </span>
              <p className="font-bold text-white text-sm truncate">{event.eligibility}</p>
            </div>
          </div>
        </div>

        {/* Content Layout: Main (8 cols) + Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event Overview */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-lg text-white space-y-4">
              <h2 className="text-xl font-bold text-white">About the Event</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {event.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post-Event Archive & Recap Box (if past event) */}
            {isPast && event.recap && (
              <div className="bg-gradient-to-br from-slate-900 to-[#0a192f] text-white rounded-3xl border border-white/15 p-6 sm:p-8 shadow-xl space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Event Proceedings & Archive</h3>
                    <p className="text-xs text-slate-400">Official Institutional Retrospective</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {event.recap.summary}
                </p>

                {event.recap.participantCount && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Participation Turnout:</p>
                      <p className="text-sm font-bold text-white">{event.recap.participantCount}</p>
                    </div>
                  </div>
                )}

                {event.recap.keyTakeaways && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Key Outcomes & Milestone Takeaways:
                    </h4>
                    <ul className="space-y-1.5">
                      {event.recap.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Activities List (Multi-Track Fests & Symposiums) */}
            {event.activities && event.activities.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-lg text-white space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Competition Tracks & Activities
                    </h2>
                    <p className="text-xs text-slate-400">
                      Detailed event tracks and guidelines
                    </p>
                  </div>
                  <Badge variant="navy">
                    <Layers className="w-3.5 h-3.5 mr-1" />
                    {event.activities.length} Tracks
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.activities.map((act) => (
                    <div
                      key={act.number}
                      className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-md transition-all space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {act.number}
                        </span>
                        <h3 className="font-bold text-white text-sm">{act.title}</h3>
                      </div>
                      <p className="text-xs font-semibold text-blue-400">{act.tagline}</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>

                      <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{act.date}</span>
                        <span className="font-semibold text-slate-200">{act.venue}</span>
                      </div>

                      {act.guidelines && (
                        <ul className="pt-1 space-y-1">
                          {act.guidelines.map((g, i) => (
                            <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                              <span className="text-blue-400">•</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-lg text-white space-y-4">
                <h2 className="text-xl font-bold text-white">Institutional Highlights</h2>
                <ul className="space-y-2.5">
                  {event.highlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schedule Section if present */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-lg text-white space-y-4">
                <h2 className="text-xl font-bold text-white">Event Timetable & Schedule</h2>
                <div className="space-y-3">
                  {event.schedule.map((slot, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded border border-blue-400/20">
                          {slot.time}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {slot.activity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        {slot.venue && <span>{slot.venue}</span>}
                        {slot.speakerOrLead && (
                          <span className="font-medium text-slate-300">({slot.speakerOrLead})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Event Organization Card */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-lg text-white space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Host Department
              </h3>
              <div>
                <p className="text-base font-bold text-white">{event.organizedBy}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dr. Akhilesh Das Gupta Institute of Professional Studies
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Approved GGSIPU Campus Event</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Shastri Park, New Delhi</span>
                </div>
              </div>

              {/* Status Action CTA */}
              <div className="pt-3 border-t border-white/10">
                <EventActionButton event={event} isPast={isPast} />
              </div>
            </div>

            {/* Poster Preview Card if poster is attached */}
            {event.poster && (
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-4 shadow-lg text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                  Official Poster Notice
                </p>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xs">
                  <Image
                    src={event.poster}
                    alt={`${event.title} Poster`}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION H — RELATED EVENTS */}
        {relatedEvents.length > 0 && (
          <div className="pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Related Campus Events
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  More institutional programmes in {event.category} and related departments
                </p>
              </div>
              <Button variant="outline" size="sm" href="/events">
                View All Events &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <EventCard key={rel.id} event={rel} />
              ))}
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
