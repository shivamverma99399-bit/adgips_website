import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Code2, Scale, Music2, Trophy } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Student Activities & Societies — ADGIPS Delhi",
  description:
    "Discover student clubs, technical societies, IEEE branches, moot court committees, and cultural collectives at ADGIPS Delhi.",
};

export default function ActivitiesPage() {
  const clubs = [
    {
      name: "IEEE Student Branch — ADGIPS",
      category: "Technical",
      icon: Code2,
      leads: "Faculty Counselor & Student Execom",
      description:
        "Global engineering community hosting international hackathons, robotics challenges, research paper workshops, and IoT symposions.",
      badge: "Flagship Chapter",
      members: "250+ Members",
    },
    {
      name: "Moot Court Society & Legal Aid Clinic",
      category: "Legal Acuity",
      icon: Scale,
      leads: "School of Law Faculty Advisors",
      description:
        "Dedicated to grooming advocates through weekly simulated appellate courtroom trials, parliamentary debates, and pro-bono community legal aid initiatives.",
      badge: "BCI Recognized",
      members: "180+ Scholars",
    },
    {
      name: "Developer & Algorithmic Coding Guild",
      category: "Technical",
      icon: Code2,
      leads: "Department of CSE & IT",
      description:
        "Competitive programming, open-source development sprints, DSA bootcamps, and organizers of collegiate hackathons and coding challenges.",
      badge: "Active",
      members: "400+ Coders",
    },
    {
      name: "Swar & Taal: Cultural & Performing Arts",
      category: "Cultural",
      icon: Music2,
      leads: "Student Activity Council (SAC)",
      description:
        "The heartbeat of campus expression — housing the college rock band, classical music ensembles, street theatre (Nukkad Natak), and contemporary dance troupes.",
      badge: "Utkarsh Hosts",
      members: "320+ Artists",
    },
    {
      name: "ADGIPS Athletics & Sports Federation",
      category: "Sports",
      icon: Trophy,
      leads: "Department of Physical Education",
      description:
        "Organizers of the annual inter-departmental trophy across cricket, football, volleyball, kabaddi, table tennis, and badminton championships.",
      badge: "Competitive",
      members: "220+ Athletes",
    },
    {
      name: "E-Cell: Entrepreneurship & Venture Incubator",
      category: "Management & Startups",
      icon: Sparkles,
      leads: "School of Management Studies",
      description:
        "Empowering student founders with angel investor pitch desks, business plan challenges, and prototype seed funding mentorship.",
      badge: "Incubation Hub",
      members: "150+ Founders",
    },
  ];

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <Breadcrumb items={[{ label: "Student Activities & Clubs" }]} className="mb-2.5" />

        <div className="max-w-3xl mb-8">
          <Badge variant="secondary" className="mb-2 font-semibold">
            Campus Life & Societies
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Student Societies & Activities
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            ADGIPS fosters a vibrant collegiate environment with over 25 active student societies spanning software innovation, trial jurisprudence, performing arts, and competitive sports.
          </p>
        </div>

        {/* Societies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {clubs.map((club) => {
            const Icon = club.icon;
            return (
              <div
                key={club.name}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline">{club.badge}</Badge>
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                    {club.category}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                    {club.name}
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">{club.leads}</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {club.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">{club.members}</span>
                  <Link
                    href="/events"
                    className="font-semibold text-blue-400 hover:text-blue-300"
                  >
                    View Events &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Membership Info Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md text-white border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Want to start a new club or join executive committees?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Registrations for student society office-bearers open each academic semester under the Student Activity Council (SAC), Shastri Park campus.
            </p>
          </div>
          <Button variant="white" size="md" href="/login">
            Society Portal Login
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
}
