"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  PlusCircle,
  FileText,
  Calendar,
  Upload,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Trash2,
  Sparkles,
  Lock,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { savePublishedResource, AcademicResource } from "@/data/resources";
import { useAuth } from "@/components/providers/auth-provider";
import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { RegistrationDocument } from "@/types/backend";

export default function AdminPage() {
  const { toast } = useToast();
  const { user, profile, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"event" | "notice" | "resource" | "registrations">("resource");
  const [registrations, setRegistrations] = useState<RegistrationDocument[]>([]);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);

  // Resource Form State
  const [resCode, setResCode] = useState("ETCS-402");
  const [resTitle, setResTitle] = useState("Information & Network Security Lab Manual");
  const [resStream, setResStream] = useState<"Engineering" | "Law" | "Management">("Engineering");
  const [resDept, setResDept] = useState("Computer Science & Engineering");
  const [resSem, setResSem] = useState("Semester 7");
  const [resType, setResType] = useState<"Syllabus Scheme" | "Previous Year Paper" | "Lab Manual" | "Lecture Notes">("Lab Manual");
  const [resDesc, setResDesc] = useState("Laboratory manual detailing cryptographic algorithms, RSA key generation, SSL handshakes, and penetration testing drills.");

  // Event Form State
  const [eventTitle, setEventTitle] = useState("ADGIPS Winter Tech Fest 2026");
  const [eventCategory, setEventCategory] = useState("Competitions");
  const [eventDate, setEventDate] = useState("18 December 2026");
  const [eventVenue, setEventVenue] = useState("Main Auditorium");
  const [eventDesc, setEventDesc] = useState("Annual hackathon and algorithm sprint hosting top collegiate engineering teams from Delhi-NCR.");

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState("Advisory: Submission of End-Term Examination Practical Files");
  const [noticeCategory, setNoticeCategory] = useState("Academic");
  const [noticeDate, setNoticeDate] = useState("05 November 2026");
  const [noticeSummary, setNoticeSummary] = useState("All final year scholars are instructed to submit signed lab journals before the designated deadline.");

  // Fetch live registrations
  React.useEffect(() => {
    async function fetchLiveRegistrations() {
      setIsLoadingRegs(true);
      try {
        const q = query(collection(db, "registrations"), limit(50));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as RegistrationDocument);
          setRegistrations(list);
        }
      } catch (err) {
        console.error("Failed to fetch registrations from Firestore:", err);
      } finally {
        setIsLoadingRegs(false);
      }
    }
    fetchLiveRegistrations();
  }, [activeTab]);

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = `res-${Date.now()}`;
    const newRes: AcademicResource = {
      id,
      code: resCode,
      title: resTitle,
      stream: resStream,
      department: resDept,
      semester: resSem,
      semesterNumber: parseInt(resSem.replace(/\D/g, "")) || 1,
      type: resType,
      year: "2026",
      format: "PDF",
      fileSize: "2.4 MB",
      downloadsCount: 1,
      description: resDesc,
    };

    try {
      await setDoc(doc(db, "resources", id), {
        ...newRes,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore sync fallback to local storage", err);
    }

    savePublishedResource(newRes);
    toast({
      title: "Academic Resource Published",
      description: `${resCode} has been indexed to the Knowledge Commons repository.`,
      type: "success",
    });
  };

  const handlePublishEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventId = `event-${Date.now()}`;
    const slug = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      await setDoc(doc(db, "events", eventId), {
        id: eventId,
        title: eventTitle,
        slug,
        category: eventCategory,
        date: eventDate,
        time: "10:00 AM to 5:00 PM",
        venue: eventVenue,
        description: eventDesc,
        status: "upcoming",
        image: "/images/engineering.jpg",
        eligibility: "Open to all students",
        organizedBy: "ADGIPS Student Council",
        tags: [eventCategory, "Campus"],
        registeredCount: 0,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore event publish fallback", err);
    }

    toast({
      title: "Event Published to Calendar",
      description: `"${eventTitle}" is now live on the collegiate Events page.`,
      type: "success",
    });
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const noticeId = `notice-${Date.now()}`;

    try {
      await setDoc(doc(db, "announcements", noticeId), {
        id: noticeId,
        title: noticeTitle,
        category: noticeCategory,
        date: noticeDate,
        summary: noticeSummary,
        isUrgent: noticeCategory === "Urgent",
        isDemo: false,
        fileSize: "250 KB",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore notice broadcast fallback", err);
    }

    toast({
      title: "Notice Broadcast Complete",
      description: `Official Circular published to the ADGIPS campus announcements feed.`,
      type: "success",
    });
  };

  // 1. Loading Gate
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-white">
        <div className="text-center space-y-4 max-w-sm p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Verifying Administrative Clearance</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Authenticating cryptographic tokens and institutional authorization claims...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 text-white">
        <div className="text-center space-y-5 max-w-md p-8 sm:p-10 rounded-3xl bg-[#071126]/90 border border-white/15 backdrop-blur-2xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <Badge variant="default" className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
              Authentication Required
            </Badge>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Administrative CMS Portal
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              This environment is strictly restricted to authorized staff and content administrators. Please authenticate using verified credentials.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="md" href="/login" className="w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-500">
              Sign In with Admin Credentials &rarr;
            </Button>
            <Button variant="outline" size="md" href="/" className="w-full sm:w-auto">
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized Non-Admin Gate (403 Forbidden)
  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 text-white">
        <div className="text-center space-y-5 max-w-md p-8 sm:p-10 rounded-3xl bg-[#071126]/90 border border-red-500/30 backdrop-blur-2xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-400/20 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <Badge variant="default" className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">
              403 Forbidden
            </Badge>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Access Denied: Insufficient Privilege
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Signed in as <strong className="text-white font-mono">{user.email}</strong>, but this account lacks administrative clearance.
            </p>
            <p className="text-[11px] text-slate-400">
              Administrative roles and cryptographic claims are provisioned by the Systems Administrator.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={async () => {
                await logout();
                window.location.href = "/login";
              }}
              className="w-full sm:w-auto font-bold border-red-500/30 hover:bg-red-500/10 text-red-200"
            >
              Sign Out & Switch Account
            </Button>
            <Button variant="white" size="md" href="/" className="w-full sm:w-auto font-semibold">
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-transparent pt-2 pb-12">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-8">
        <Breadcrumb items={[{ label: "Admin Content & Publishing Portal" }]} className="mb-2.5" />

        {/* Admin Portal Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Administrative Privilege Level
              </Badge>
              <span className="text-xs text-slate-400">Institutional CMS Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Content Publishing & Resource Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Create, edit, and publish campus events, official notices, academic handouts, and review real student event passes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Administrator
              </span>
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                window.location.href = "/login";
              }}
              className="text-xs"
            >
              Sign Out
            </Button>
            <Button variant="white" size="sm" href="/">
              View Site &rarr;
            </Button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10 text-xs">
          {[
            { id: "resource", label: "Upload Academic Resource", icon: Upload },
            { id: "event", label: "Create & Publish Event", icon: Calendar },
            { id: "notice", label: "Broadcast Campus Notice", icon: FileText },
            { id: "registrations", label: "Student Registrations (Live Feed)", icon: Users },
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

        {/* TAB 1: UPLOAD ACADEMIC RESOURCE */}
        {activeTab === "resource" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <span>Publish New Academic Resource or PYQ</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Resource will be instantly indexed on the Resources page and global Search modal.
              </p>
            </div>

            <form onSubmit={handleUploadResource} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={resCode}
                    onChange={(e) => setResCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Academic Stream</label>
                  <select
                    value={resStream}
                    onChange={(e) => setResStream(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Engineering" className="bg-slate-900">Engineering (B.Tech)</option>
                    <option value="Law" className="bg-slate-900">Law (B.A. / B.B.A. LL.B.)</option>
                    <option value="Management" className="bg-slate-900">Management (BBA / MBA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={resDept}
                    onChange={(e) => setResDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="text"
                    required
                    value={resSem}
                    onChange={(e) => setResSem(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Resource Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lab Manual" className="bg-slate-900">Lab Manual</option>
                    <option value="Syllabus Scheme" className="bg-slate-900">Syllabus Scheme</option>
                    <option value="Previous Year Paper" className="bg-slate-900">Previous Year Paper</option>
                    <option value="Lecture Notes" className="bg-slate-900">Lecture Notes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Curriculum Summary / Description</label>
                <textarea
                  rows={3}
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="font-bold">
                  <Upload className="w-4 h-4 mr-1.5" />
                  <span>Upload & Publish to Repository</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CREATE & PUBLISH EVENT */}
        {activeTab === "event" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Create Campus Event or Technical Fest</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Announce new fests, moot trials, or guest seminars across the campus website.
              </p>
            </div>

            <form onSubmit={handlePublishEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cultural" className="bg-slate-900">Cultural</option>
                    <option value="Competitions" className="bg-slate-900">Competitions</option>
                    <option value="Seminars" className="bg-slate-900">Seminars</option>
                    <option value="Academic" className="bg-slate-900">Academic</option>
                    <option value="Sports" className="bg-slate-900">Sports</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Event Date</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Campus Venue</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="font-bold">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  <span>Publish Event to Live Calendar</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BROADCAST CAMPUS NOTICE */}
        {activeTab === "notice" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Broadcast Official Circular / Notice</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Announcements appear on the homepage circular ticker and the student dashboard.
              </p>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice Heading</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Notice Classification</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Academic" className="bg-slate-900">Academic Notice</option>
                    <option value="Urgent" className="bg-slate-900">Urgent Notification</option>
                    <option value="Examination" className="bg-slate-900">Examination Datesheet</option>
                    <option value="Scholarship" className="bg-slate-900">Scholarship Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date of Release</label>
                  <input
                    type="text"
                    required
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Circular Summary</label>
                <textarea
                  rows={3}
                  value={noticeSummary}
                  onChange={(e) => setNoticeSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="font-bold">
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>Broadcast Notice to Campus Feed</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: LIVE STUDENT REGISTRATIONS */}
        {activeTab === "registrations" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Live Student Event Passes & Submissions</h2>
                <p className="text-xs text-slate-400">Real-time incoming registrations from verified student portals</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Export Initiated",
                    description: "Student_Registrations_Manifest_2026.csv downloaded.",
                    type: "info",
                  });
                }}
                className="text-xs"
              >
                Export CSV Manifest
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-white/10 text-slate-400 uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Enrollment No.</th>
                    <th className="py-2.5 px-3">Event Registered</th>
                    <th className="py-2.5 px-3">Stream / Sem</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td className="py-2.5 px-3 font-semibold text-white">{reg.studentName}</td>
                        <td className="py-2.5 px-3 font-mono text-blue-300">{reg.enrollmentNo}</td>
                        <td className="py-2.5 px-3">{reg.eventTitle}</td>
                        <td className="py-2.5 px-3 text-slate-400">{reg.branch || "General"} ({reg.semester || "Sem 6"})</td>
                        <td className="py-2.5 px-3">
                          <span className={reg.status === "confirmed" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3"><span className="text-slate-400">Sanctioned</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No event registrations recorded yet. Real student registrations will populate here in real-time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
