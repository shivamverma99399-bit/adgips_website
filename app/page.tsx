import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { EventsSection } from "@/components/home/events-section";
import { OpportunitiesSection } from "@/components/home/opportunities-section";
import { InstitutionalHighlights } from "@/components/home/institutional-highlights";
import { ProgrammesSection } from "@/components/home/programmes-section";
import { CampusGallery } from "@/components/home/campus-gallery";
import { AnnouncementsSection } from "@/components/home/announcements";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col min-w-0">
      <Hero />
      <QuickAccess />
      <EventsSection />
      <OpportunitiesSection />
      <InstitutionalHighlights />
      <ProgrammesSection />
      <CampusGallery />
      <AnnouncementsSection />
    </main>
  );
}
