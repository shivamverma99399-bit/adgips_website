"use client";

import React from "react";
import Link from "next/link";
import { CollegeLogo } from "@/components/ui/college-logo";
import { MapPin, Phone, Mail, Globe, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  const platformLinks = [
    { label: "Campus Events", href: "/events" },
    { label: "Utkarsh Cultural Fest", href: "/events/utkarsh-fest" },
    { label: "Student Activities & Clubs", href: "/activities" },
    { label: "Academic Resources", href: "/resources" },
    { label: "Campus Life Gallery", href: "/gallery" },
    { label: "Student Portal Login", href: "/login" },
  ];

  const academicLinks = [
    { label: "B.Tech Engineering", href: "/#programmes" },
    { label: "School of Law (B.A./B.B.A. LL.B.)", href: "/#programmes" },
    { label: "Management Studies (BBA/MBA)", href: "/#programmes" },
    { label: "Corporate Resource Centre (CRC)", href: "/#placements" },
    { label: "Central Research Library", href: "/#highlights" },
    { label: "Anti-Ragging Compliance", href: "https://adgips.ac.in", external: true },
  ];

  const officialLinks = [
    { label: "Official ADGIPS Website", href: "https://adgips.ac.in", external: true },
    { label: "GGSIPU University Portal", href: "http://www.ipu.ac.in", external: true },
    { label: "BBD Group of Education", href: "https://bbdgroup.ac.in", external: true },
    { label: "AICTE Portal", href: "https://www.aicte-india.org", external: true },
    { label: "Bar Council of India", href: "http://www.barcouncilofindia.org", external: true },
  ];

  return (
    <footer className="bg-[#040915]/85 backdrop-blur-xl text-slate-300 border-t border-white/10 relative z-10">
      {/* Top Banner: Affiliations & Accreditations */}
      <div className="border-b border-white/10 bg-[#040915]/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Affiliated with <strong>Guru Gobind Singh Indraprastha University (GGSIPU)</strong>, Delhi</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">AICTE Approved</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Bar Council of India Approved</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">BBD Group Institution</span>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1 & 2: Institutional Brand & Contacts */}
          <div className="lg:col-span-2 space-y-4">
            <CollegeLogo variant="dark" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm pt-2">
              Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS), formerly NIEC / ADGITM, is dedicated to engineering excellence, legal jurisprudence, and managerial innovation in New Delhi.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>FC-26, Panduk Shila Marg, Zero Pusta Road, Shastri Park, New Delhi - 110053</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 (011) 49905900 / 49905901</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@adgips.ac.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="https://adgips.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  adgips.ac.in
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Student Platform
            </h3>
            <ul className="space-y-2.5 text-xs">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Academics & CRC */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Academics & CRC
            </h3>
            <ul className="space-y-2.5 text-xs">
              {academicLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Statutory Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Affiliations & Bodies
            </h3>
            <ul className="space-y-2.5 text-xs">
              {officialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer & IPVERSE discrete credit */}
      <div className="border-t border-slate-800/80 bg-[#040813] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS), Delhi. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span className="text-slate-400">
              Platform Engineered for ADGIPS Students by <span className="text-slate-300 font-medium">IPVERSE</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
