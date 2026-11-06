"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  FileText,
  LogOut,
  ShieldCheck,
  Ticket,
  Clock,
  MapPin,
  Download,
  AlertTriangle,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedProgressBar, AnimatedProgressRing } from "@/components/ui/animated-progress";
import { DEFAULT_STUDENT, StudentProfile } from "@/lib/auth";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile: authProfile, loading, logout, isAdmin } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_STUDENT);
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "societies" | "resources" | "exams"
  >("overview");

  useEffect(() => {
    if (authProfile) {
      setProfile({
        ...DEFAULT_STUDENT,
        ...authProfile,
        id: authProfile.uid,
        name: authProfile.name || (user?.displayName || "Student Scholar"),
        email: authProfile.email || (user?.email || "student@gmail.com"),
        role: authProfile.role === "admin" ? "admin" : "student",
        registeredEvents: (authProfile.registeredEvents && authProfile.registeredEvents.length > 0)
          ? authProfile.registeredEvents
          : DEFAULT_STUDENT.registeredEvents,
        clubMemberships: (authProfile.clubMemberships && authProfile.clubMemberships.length > 0)
          ? authProfile.clubMemberships
          : DEFAULT_STUDENT.clubMemberships,
      });
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Student Scholar",
        email: user.email || "student@gmail.com",
      }));
    }
  }, [authProfile, user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You have been logged out of your session.",
        type: "info",
      });
      router.push("/login");
    } catch (err: any) {
      toast({
        title: "Logout Error",
        description: err.message,
        type: "error",
      });
    }
  };

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <Breadcrumb items={[{ label: "Student Experience Dashboard" }]} className="mb-2.5" />

        {/* Top Profile Header Bar */}
        <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-2xl mb-8 text-white overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Student Identity */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-xl shadow-blue-600/30 border border-white/20 shrink-0">
                {profile.name[0]}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {profile.name}
                  </h1>
                  <Badge variant="navy" className="text-xs bg-blue-600/30 border-blue-400/30">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                    Verified Student
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Enrollment: <span className="font-mono text-white font-bold">{profile.enrollmentNo}</span> • {profile.programme}
                </p>
                <p className="text-xs text-slate-400">
                  {profile.department} • {profile.batch} (Semester {profile.semester})
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
              <Button
                variant="outline"
                size="sm"
                href="/admin"
                className="gap-1.5 text-xs border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Content CMS</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-xs cursor-pointer hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Animated Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-white">
            <div className="flex items-center justify-between text-blue-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Current CGPA</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-3xl font-mono font-extrabold text-white">
              <AnimatedCounter value={profile.cgpa} decimals={2} />
            </p>
            <p className="text-[11px] text-blue-300 font-medium mt-1">
              Top 5% of AI & Data Science
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-white">
            <div className="flex items-center justify-between text-emerald-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Compliance</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-3xl font-mono font-extrabold text-white">
              <AnimatedCounter value={profile.attendancePercent} decimals={1} suffix="%" />
            </p>
            <p className="text-[11px] text-emerald-300 font-medium mt-1">
              Statutory cutoff &ge; 75% met
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Credits Earned</span>
              <GraduationCap className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-3xl font-mono font-extrabold text-white">
              <AnimatedCounter value={profile.creditsEarned} />{" "}
              <span className="text-sm text-slate-400 font-normal">/ {profile.totalCredits}</span>
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Year 3 of 4 on schedule
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-white">
            <div className="flex items-center justify-between text-amber-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Event Passes</span>
              <Ticket className="w-4 h-4" />
            </div>
            <p className="text-3xl font-mono font-extrabold text-white">
              <AnimatedCounter value={profile.registeredEvents.length} />
            </p>
            <p className="text-[11px] text-amber-300 font-medium mt-1">
              Confirmed Campus Passes
            </p>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10 text-xs">
          {[
            { id: "overview", label: "Academic Overview & Attendance", icon: BookOpen },
            { id: "events", label: `Registered Events (${profile.registeredEvents.length})`, icon: Ticket },
            { id: "societies", label: `Societies & Clubs (${profile.clubMemberships.length})`, icon: Compass },
            { id: "resources", label: `Downloaded Handouts (${profile.downloadedResources.length})`, icon: Download },
            { id: "exams", label: "Admit Card & Assessment", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACADEMIC OVERVIEW & ATTENDANCE */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radial Progress Ring (4 cols) */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center flex flex-col items-center justify-center text-white">
                <AnimatedProgressRing
                  value={profile.attendancePercent}
                  size={130}
                  strokeWidth={11}
                  color="emerald"
                  label="Statutory Attendance Compliance"
                  sublabel="Verified"
                />
                <h4 className="font-bold text-base text-white mt-4">
                  GGSIPU Examination Clearance
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Your aggregate attendance across all theory & laboratory subjects satisfies statutory GGSIPU ordinance.
                </p>
              </div>

              {/* Subject Breakdown (8 cols) */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-4 text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Subject-Wise Attendance Breakdown
                  </h3>
                  <span className="text-xs text-slate-400">Semester 6 (Current)</span>
                </div>

                <div className="space-y-4">
                  {profile.subjectAttendance.map((sub) => (
                    <div key={sub.code} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          {sub.subject} <span className="font-mono text-slate-400">({sub.code})</span>
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            sub.percentage >= 85
                              ? "text-emerald-400"
                              : sub.percentage >= 75
                              ? "text-blue-400"
                              : "text-amber-400"
                          }`}
                        >
                          {sub.attended}/{sub.total} ({sub.percentage}%)
                        </span>
                      </div>
                      <AnimatedProgressBar
                        value={sub.percentage}
                        color={sub.percentage >= 85 ? "emerald" : sub.percentage >= 75 ? "blue" : "amber"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Semester-Wise SGPA Progression */}
            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Semester-by-Semester SGPA Progression
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {[
                  { sem: "Sem 1", sgpa: "8.42", credits: "24", status: "Completed" },
                  { sem: "Sem 2", sgpa: "8.75", credits: "24", status: "Completed" },
                  { sem: "Sem 3", sgpa: "8.90", credits: "22", status: "Completed" },
                  { sem: "Sem 4", sgpa: "9.12", credits: "22", status: "Completed" },
                  { sem: "Sem 5", sgpa: "9.30", credits: "22", status: "Completed" },
                ].map((item) => (
                  <div
                    key={item.sem}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      {item.sem}
                    </span>
                    <p className="text-xl font-mono font-bold text-blue-300">{item.sgpa}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      {item.credits} Credits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED EVENTS */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Active Event Registrations & E-Passes
              </h3>
              <Button variant="outline" size="sm" href="/events" className="text-xs">
                Browse Campus Events &rarr;
              </Button>
            </div>

            {profile.registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.registeredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-3xl bg-slate-900/70 border border-white/15 text-white space-y-3 relative overflow-hidden shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="navy" className="text-[10px]">
                            {evt.category}
                          </Badge>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> E-Pass Active
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{evt.title}</h4>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{evt.venue}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">
                        Pass ID: ADG-{evt.id.slice(0, 6).toUpperCase()}
                      </span>
                      <Button
                        variant="white"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "E-Pass Ready",
                            description: `QR Entry Pass for ${evt.title} saved to gallery.`,
                            type: "success",
                          });
                        }}
                        className="text-xs py-1 px-3"
                      >
                        Download Pass
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 text-white">
                <Ticket className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h4 className="text-base font-bold">No event registrations yet</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Explore flagship fests and hackathons on the Events page to register.
                </p>
                <Button variant="primary" size="sm" href="/events" className="mt-4">
                  Explore Events
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SOCIETIES & CLUBS */}
        {activeTab === "societies" && (
          <div className="space-y-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Student Society Memberships
              </h3>
              <Button variant="outline" size="sm" href="/activities" className="text-xs">
                Explore Societies &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.clubMemberships.map((club) => (
                <div
                  key={club.clubName}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="text-[10px] mb-1">
                        {club.category}
                      </Badge>
                      <h4 className="text-base font-bold text-white">{club.clubName}</h4>
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/20">
                      {club.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Active member since {club.joinedDate} • Verified by SAC Council
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DOWNLOADED HANDOUTS */}
        {activeTab === "resources" && (
          <div className="space-y-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Downloaded Course Handouts & PYQs
              </h3>
              <Button variant="outline" size="sm" href="/resources" className="text-xs">
                Open Resource Repository &rarr;
              </Button>
            </div>

            <div className="space-y-3">
              {profile.downloadedResources.map((res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-400/20">
                        {res.code}
                      </span>
                      <span className="text-sm font-semibold text-white truncate">
                        {res.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {res.type} • Downloaded {res.downloadedAt}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      toast({
                        title: "Re-downloading",
                        description: `Retrieving fresh copy of ${res.code}.`,
                        type: "success",
                      });
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Re-download Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EXAMINATIONS & ADMIT CARD */}
        {activeTab === "exams" && (
          <div className="space-y-6 text-white">
            {/* Admit Card Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 border border-blue-400/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5">
                <Badge variant="urgent" className="text-xs">
                  Active Admit Card Issued
                </Badge>
                <h3 className="text-xl font-bold text-white">
                  GGSIPU End-Term Theory Examination Hall Ticket
                </h3>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  Admit card for Semester 6 examinations has been sanctioned by the Institutional Controller of Examinations.
                </p>
              </div>

              <Button
                variant="white"
                size="md"
                onClick={() => {
                  toast({
                    title: "Downloading Admit Card",
                    description: "Admit_Card_04215602722_Sem6.pdf downloaded successfully.",
                    type: "success",
                  });
                }}
                className="font-bold shrink-0 shadow-lg"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download Admit Card (PDF)</span>
              </Button>
            </div>

            {/* Mid-Term Internal Marks Table */}
            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Continuous Internal Assessment (CIA) - Minor Exam Scorecard
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/10 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Subject Code</th>
                      <th className="py-2.5 px-3">Subject Title</th>
                      <th className="py-2.5 px-3">Max Marks</th>
                      <th className="py-2.5 px-3">Marks Obtained</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-blue-300">ETCS-302</td>
                      <td className="py-2.5 px-3">Data Mining & Business Intelligence</td>
                      <td className="py-2.5 px-3 text-slate-400">25</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">23 / 25</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Distinction</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-blue-300">ETAIDS-304</td>
                      <td className="py-2.5 px-3">Artificial Neural Networks & Deep Learning</td>
                      <td className="py-2.5 px-3 text-slate-400">25</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">24 / 25</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Distinction</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-blue-300">ETIT-306</td>
                      <td className="py-2.5 px-3">Cloud Computing & Microservices Architecture</td>
                      <td className="py-2.5 px-3 text-slate-400">25</td>
                      <td className="py-2.5 px-3 font-bold text-blue-400">21 / 25</td>
                      <td className="py-2.5 px-3"><span className="text-blue-400 font-semibold">First Class</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-blue-300">HVPE-102</td>
                      <td className="py-2.5 px-3">Universal Human Values & Professional Ethics</td>
                      <td className="py-2.5 px-3 text-slate-400">25</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">22 / 25</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-400 font-semibold">Distinction</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
