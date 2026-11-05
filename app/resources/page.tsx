import { Metadata } from "next";
import { Download, Library } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Academic Resources & E-Library — ADGIPS Delhi",
  description:
    "Curated GGSIPU academic resources, past examination papers, syllabus outlines, lab manuals, and digital library journals for ADGIPS students.",
};

export default function ResourcesPage() {
  const resourceCategories = [
    {
      title: "GGSIPU Curriculum & Scheme of Examination",
      stream: "Engineering (B.Tech)",
      items: [
        { name: "First Year Applied Sciences & Programming Scheme", code: "ETCS-101", sem: "Semester 1 & 2" },
        { name: "Computer Science & Engineering (CSE) 3rd–8th Sem Scheme", code: "ETCS-200+", sem: "Semesters 3–8" },
        { name: "Artificial Intelligence & Data Science (AI&DS) Scheme", code: "ETAIDS-200+", sem: "Semesters 3–8" },
        { name: "Information Technology (IT) Scheme of Examination", code: "ETIT-200+", sem: "Semesters 3–8" },
      ],
    },
    {
      title: "School of Law Legal Compendiums",
      stream: "Law (B.A. LL.B. / B.B.A. LL.B.)",
      items: [
        { name: "Constitutional Law of India (Parts I & II) Case Compendium", code: "LLB-101", sem: "1st & 2nd Year" },
        { name: "Law of Torts, Consumer Protection & Motor Vehicles Act", code: "LLB-103", sem: "1st Year" },
        { name: "Corporate Law & Securities Regulations Manual", code: "LLB-302", sem: "3rd Year" },
        { name: "Moot Court Exercise & Internship Guidelines", code: "LLB-501", sem: "5th Year" },
      ],
    },
    {
      title: "School of Management Studies",
      stream: "Management (BBA / MBA)",
      items: [
        { name: "Managerial Economics & Quantitative Methods", code: "BBA-102", sem: "1st Year" },
        { name: "Financial Accounting & Financial Management Manual", code: "BBA-201", sem: "2nd Year" },
        { name: "Business Analytics & Spreadsheet Modeling", code: "BBA-304", sem: "3rd Year" },
      ],
    },
  ];

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <Breadcrumb items={[{ label: "Academic Resources" }]} className="mb-2.5" />

        <div className="max-w-3xl mb-8">
          <Badge variant="secondary" className="mb-2 font-semibold">
            Knowledge Commons
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Curated Academic Resources
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Central repository of university examination schemas, course handouts, past examination papers, and digital library e-resources affiliated with GGSIPU.
          </p>
        </div>

        {/* Digital Library Access Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md text-white border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-600 text-white shrink-0 mt-1">
              <Library className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Central Research & Digital Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                85,000+ volumes, Delnet subscription, and IEEE Xplore remote access. Log in with your ADGIPS institutional email to access journal archives.
              </p>
            </div>
          </div>
          <Button variant="white" size="md" href="/login" className="shrink-0">
            Access E-Library
          </Button>
        </div>

        {/* Categorized Course Modules */}
        <div className="space-y-10">
          {resourceCategories.map((cat) => (
            <div key={cat.title} className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-lg text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
                <div>
                  <Badge variant="outline" className="mb-1 text-xs">
                    {cat.stream}
                  </Badge>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {cat.title}
                  </h2>
                </div>
                <span className="text-xs text-slate-400">GGSIPU Affiliated Scheme</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition-all group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-400/20 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.sem}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                        {item.name}
                      </p>
                    </div>

                    <a
                      href="https://adgips.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/10 text-slate-300 group-hover:text-white group-hover:bg-blue-600 border border-white/10 shrink-0 transition-colors"
                      aria-label="Download course scheme"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
