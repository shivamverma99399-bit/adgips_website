import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { InstitutionalHighlights } from "@/components/home/institutional-highlights";
import { ProgrammesSection } from "@/components/home/programmes-section";
import { EventsSection } from "@/components/home/events-section";
import { OpportunitiesSection } from "@/components/home/opportunities-section";
import { LearnGrowSection } from "@/components/home/learn-grow-section";
import { AnnouncementsSection } from "@/components/home/announcements";
import { CampusGallery } from "@/components/home/campus-gallery";
import { JourneyCTASection } from "@/components/home/journey-cta-section";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col min-w-0">
      {/* 1. Welcome to ADGIPS — Cinematic Campus Hero & Institutional Identity */}
      <Hero />

      {/* 2. Discover Your Campus — 3D Stacked Carousel, Infrastructure Milestones & Academic Schools */}
      <QuickAccess />
      <InstitutionalHighlights />
      <ProgrammesSection />

      {/* 3. Experience Campus Life — Featured Cultural Fests & Event Showcase */}
      <EventsSection />

      {/* 4. Find Your Next Opportunity — National Hackathons, Fellowships & Societies */}
      <OpportunitiesSection />

      {/* 5. Learn & Grow — Curated Academic Resources, PYQs & Handout Repository */}
      <LearnGrowSection />

      {/* 6. Stay Connected — Registrar Circulars, Examination Schedules & Directives */}
      <AnnouncementsSection />

      {/* 7. Life at ADGIPS — Purpose-Built Spaces, Atmosphere & 3D Folio Photo Journal */}
      <CampusGallery />

      {/* 8. Your Campus. Your Journey. — Closing Institutional CTA & Pathway to Future */}
      <JourneyCTASection />
    </main>
  );
}
