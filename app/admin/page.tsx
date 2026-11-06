"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Edit3,
  ImageIcon,
  ExternalLink,
  Archive,
  Check,
  X,
  Search,
  FileUp,
  Award,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { uploadFileToStorage, deleteFileFromStorage } from "@/lib/firebase/storage";
import {
  EventDocument,
  AcademicResourceDocument,
  AnnouncementDocument,
  RegistrationDocument,
  OpportunityDocument,
} from "@/types/backend";
import { EventCategory, OpportunityCategory } from "@/types";
import { GalleryItemDocument, getOpportunitiesFromFirestore } from "@/lib/firebase/firestore";

type AdminTab = "events" | "opportunities" | "resources" | "notices" | "gallery" | "registrations";

export default function AdminPage() {
  const { toast } = useToast();
  const { user, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("events");

  // Sub-view: "create" or "list"
  const [subView, setSubView] = useState<"create" | "list">("create");

  // Data collections state
  const [eventsList, setEventsList] = useState<EventDocument[]>([]);
  const [opportunitiesList, setOpportunitiesList] = useState<OpportunityDocument[]>([]);
  const [resourcesList, setResourcesList] = useState<AcademicResourceDocument[]>([]);
  const [noticesList, setNoticesList] = useState<AnnouncementDocument[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItemDocument[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationDocument[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Search filter inside lists
  const [filterQuery, setFilterQuery] = useState<string>("");

  // Edit modal state
  const [editingItem, setEditingItem] = useState<{
    type: "event" | "opportunity" | "resource" | "notice" | "gallery";
    data: any;
  } | null>(null);

  // Preview modal state
  const [previewItem, setPreviewItem] = useState<{
    type: "event" | "opportunity" | "resource" | "notice" | "gallery";
    data: any;
  } | null>(null);

  // File Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploadedPath, setUploadedPath] = useState<string>("");

  // ==========================================
  // Form States (Clean initial inputs, no demo records)
  // ==========================================

  // 1. Event Form
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState<EventCategory>("Technical");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("10:00 AM – 4:00 PM");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventEligibility, setEventEligibility] = useState("Open to all students");
  const [eventRegistrationLink, setEventRegistrationLink] = useState("");
  const [eventStatus, setEventStatus] = useState<"upcoming" | "ongoing" | "past">("upcoming");

  // 1b. Opportunity Form
  const [oppTitle, setOppTitle] = useState("");
  const [oppOrg, setOppOrg] = useState("");
  const [oppCategory, setOppCategory] = useState<OpportunityCategory>("Hackathon");
  const [oppDeadline, setOppDeadline] = useState("");
  const [oppEligibility, setOppEligibility] = useState("Open to all students");
  const [oppLocation, setOppLocation] = useState("Delhi NCR / Pan-India");
  const [oppMode, setOppMode] = useState<"Online" | "Offline" | "Hybrid">("Online");
  const [oppApplyLink, setOppApplyLink] = useState("");
  const [oppPrize, setOppPrize] = useState("");
  const [oppTags, setOppTags] = useState("");
  const [oppFeatured, setOppFeatured] = useState(false);

  // 2. Resource Form
  const [resCode, setResCode] = useState("");
  const [resTitle, setResTitle] = useState("");
  const [resStream, setResStream] = useState<"Engineering" | "Law" | "Management">("Engineering");
  const [resDept, setResDept] = useState("Computer Science & Engineering");
  const [resSem, setResSem] = useState("Semester 1");
  const [resType, setResType] = useState<"Syllabus Scheme" | "Previous Year Paper" | "Lab Manual" | "Lecture Notes">("Previous Year Paper");
  const [resYear, setResYear] = useState("2026");
  const [resDescription, setResDescription] = useState("");

  // 3. Notice Form
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<"Academic" | "Examination" | "Placement" | "Events" | "Administrative">("Academic");
  const [noticeDate, setNoticeDate] = useState("");
  const [noticeExpiryDate, setNoticeExpiryDate] = useState("");
  const [noticeSummary, setNoticeSummary] = useState("");
  const [noticeDetails, setNoticeDetails] = useState("");
  const [noticeLink, setNoticeLink] = useState("");
  const [isNoticeUrgent, setIsNoticeUrgent] = useState(false);

  // 4. Gallery Form
  const [galTitle, setGalTitle] = useState("");
  const [galCategory, setGalCategory] = useState("Campus Life");
  const [galEventName, setGalEventName] = useState("");
  const [galDate, setGalDate] = useState("");
  const [galDescription, setGalDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ==========================================
  // Fetch collection data on tab or subview change
  // ==========================================
  const loadTabData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      if (activeTab === "events") {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        setEventsList(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventDocument)));
      } else if (activeTab === "opportunities") {
        const opps = await getOpportunitiesFromFirestore();
        setOpportunitiesList(opps);
      } else if (activeTab === "resources") {
        const q = query(collection(db, "resources"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        setResourcesList(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AcademicResourceDocument)));
      } else if (activeTab === "notices") {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        setNoticesList(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementDocument)));
      } else if (activeTab === "gallery") {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(50));
        const snap = await getDocs(q);
        setGalleryList(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItemDocument)));
      } else if (activeTab === "registrations") {
        const q = query(collection(db, "registrations"), limit(100));
        const snap = await getDocs(q);
        setRegistrations(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RegistrationDocument)));
      }
    } catch (err: unknown) {
      console.error("Failed to load collection data from Firestore:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isAdmin) {
      loadTabData();
    }
  }, [isAdmin, activeTab, subView, loadTabData]);

  // Handle generic file upload to Firebase Storage
  const handleFileUpload = async (folder: "events" | "resources" | "announcements" | "gallery") => {
    if (!uploadFile) {
      toast({ title: "No File Selected", description: "Please pick a file to upload.", type: "info" });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const res = await uploadFileToStorage(uploadFile, folder, (percent) => {
        setUploadProgress(percent);
      });
      setUploadedUrl(res.downloadUrl);
      setUploadedPath(res.storagePath);
      toast({
        title: "File Uploaded to Storage",
        description: `${uploadFile.name} (${(uploadFile.size / 1024).toFixed(1)} KB) secured in Firebase Storage.`,
        type: "success",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Storage Upload Failed",
        description: error.message || "Failed to upload file to Firebase Storage.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ==========================================
  // Form Submit Handlers (Create in Firestore)
  // ==========================================

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim() || !eventVenue.trim()) {
      toast({ title: "Validation Error", description: "Title, date, and venue are mandatory.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const eventId = `event_${Date.now()}`;
      const slug = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const newEvent: EventDocument = {
        id: eventId,
        title: eventTitle.trim(),
        slug,
        category: eventCategory,
        date: eventDate.trim(),
        time: eventTime.trim(),
        venue: eventVenue.trim(),
        description: eventDescription.trim() || "No detailed description provided.",
        status: eventStatus,
        image: uploadedUrl || "/images/engineering.jpg",
        eligibility: eventEligibility.trim(),
        organizedBy: "ADGIPS Administration",
        registrationLink: eventRegistrationLink.trim() || undefined,
        tags: [eventCategory, "Campus"],
        registeredCount: 0,
        publishedBy: user?.email || "Administrator",
        publishedByUid: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "events", eventId), newEvent);
      toast({ title: "Event Published", description: `"${eventTitle}" is now published on the collegiate calendar.`, type: "success" });

      // Reset form
      setEventTitle("");
      setEventDate("");
      setEventVenue("");
      setEventDescription("");
      setEventRegistrationLink("");
      setUploadFile(null);
      setUploadedUrl("");
      setSubView("list");
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Publish Error", description: error.message || "Failed to publish event.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim() || !oppOrg.trim() || !oppApplyLink.trim()) {
      toast({
        title: "Validation Error",
        description: "Opportunity Title, Host Organization, and Application Link are required.",
        type: "error",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const oppId = `opp_${Date.now()}`;
      const newOpp: OpportunityDocument = {
        id: oppId,
        title: oppTitle.trim(),
        organization: oppOrg.trim(),
        category: oppCategory,
        deadline: oppDeadline.trim() || "Rolling Admission",
        eligibility: oppEligibility.trim() || "Open to all students",
        location: oppLocation.trim() || "Delhi NCR / Pan-India",
        mode: oppMode,
        applyLink: oppApplyLink.trim(),
        stipendOrPrize: oppPrize.trim() || undefined,
        tags: oppTags.trim()
          ? oppTags.split(",").map((t) => t.trim()).filter(Boolean)
          : [oppCategory, oppMode],
        featured: oppFeatured,
        verifiedExternal: true,
        status: "published",
        publishedBy: user?.email || "Corporate Resource Centre",
        publishedByUid: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "opportunities", oppId), newOpp);
      toast({
        title: "Opportunity Published",
        description: `"${oppTitle}" is now live on the collegiate opportunity portal.`,
        type: "success",
      });

      // Reset form
      setOppTitle("");
      setOppOrg("");
      setOppDeadline("");
      setOppEligibility("Open to all students");
      setOppLocation("Delhi NCR / Pan-India");
      setOppApplyLink("");
      setOppPrize("");
      setOppTags("");
      setOppFeatured(false);
      setSubView("list");
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Publish Error",
        description: error.message || "Failed to publish opportunity.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resCode.trim() || !resTitle.trim() || !resDept.trim()) {
      toast({ title: "Validation Error", description: "Subject Code, Title, and Department are required.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const id = `res_${Date.now()}`;
      const semNum = parseInt(resSem.replace(/\D/g, "")) || 1;
      const newRes: AcademicResourceDocument = {
        id,
        code: resCode.trim().toUpperCase(),
        title: resTitle.trim(),
        stream: resStream,
        department: resDept.trim(),
        semester: resSem,
        semesterNumber: semNum,
        type: resType,
        year: resYear.trim() || "2026",
        format: uploadFile ? (uploadFile.name.endsWith(".docx") ? "DOCX" : "PDF") : "PDF",
        fileSize: uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : "Official PDF",
        fileUrl: uploadedUrl || undefined,
        storagePath: uploadedPath || undefined,
        description: resDescription.trim() || "Official academic syllabus and handouts repository item.",
        status: "published",
        downloadsCount: 0,
        publishedBy: user?.email || "Faculty Administrator",
        publishedByUid: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "resources", id), newRes);
      toast({ title: "Resource Indexed", description: `${resCode} is now accessible in the Knowledge Commons.`, type: "success" });

      // Reset
      setResCode("");
      setResTitle("");
      setResDescription("");
      setUploadFile(null);
      setUploadedUrl("");
      setUploadedPath("");
      setSubView("list");
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Upload Error", description: error.message || "Failed to save resource.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeDate.trim() || !noticeSummary.trim()) {
      toast({ title: "Validation Error", description: "Title, date, and circular summary are required.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const noticeId = `notice_${Date.now()}`;
      const newNotice: AnnouncementDocument = {
        id: noticeId,
        title: noticeTitle.trim(),
        category: noticeCategory,
        date: noticeDate.trim(),
        expiryDate: noticeExpiryDate.trim() || undefined,
        summary: noticeSummary.trim(),
        details: noticeDetails.trim() || undefined,
        isUrgent: isNoticeUrgent,
        isDemo: false,
        fileUrl: uploadedUrl || noticeLink.trim() || undefined,
        storagePath: uploadedPath || undefined,
        fileSize: uploadFile ? `${(uploadFile.size / 1024).toFixed(0)} KB` : undefined,
        status: "published",
        publishedBy: user?.email || "Administrative Officer",
        publishedByUid: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "announcements", noticeId), newNotice);
      toast({ title: "Circular Broadcasted", description: `Official notice published to the campus feed.`, type: "success" });

      // Reset
      setNoticeTitle("");
      setNoticeDate("");
      setNoticeExpiryDate("");
      setNoticeSummary("");
      setNoticeDetails("");
      setNoticeLink("");
      setIsNoticeUrgent(false);
      setUploadFile(null);
      setUploadedUrl("");
      setUploadedPath("");
      setSubView("list");
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Broadcast Error", description: error.message || "Failed to publish circular.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !uploadedUrl) {
      toast({ title: "Validation Error", description: "Please provide a photo title and upload an image.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const galId = `gal_${Date.now()}`;
      const newGal: GalleryItemDocument = {
        id: galId,
        title: galTitle.trim(),
        category: galCategory,
        description: galDescription.trim() || undefined,
        imageUrl: uploadedUrl,
        storagePath: uploadedPath || undefined,
        eventName: galEventName.trim() || undefined,
        date: galDate.trim() || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        publishedBy: user?.email || "Media Cell",
        publishedByUid: user?.uid,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "gallery", galId), newGal);
      toast({ title: "Gallery Photo Published", description: `Photo added to the institutional 3D gallery archive.`, type: "success" });

      // Reset
      setGalTitle("");
      setGalEventName("");
      setGalDate("");
      setGalDescription("");
      setUploadFile(null);
      setUploadedUrl("");
      setUploadedPath("");
      setSubView("list");
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Publish Error", description: error.message || "Failed to save photo.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Delete Item Handler
  // ==========================================
  const handleDeleteItem = async (
    type: "event" | "opportunity" | "resource" | "notice" | "gallery",
    id: string,
    storagePath?: string
  ) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete this ${type}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const collectionName =
        type === "event"
          ? "events"
          : type === "opportunity"
          ? "opportunities"
          : type === "resource"
          ? "resources"
          : type === "notice"
          ? "announcements"
          : "gallery";
      await deleteDoc(doc(db, collectionName, id));

      if (storagePath) {
        await deleteFileFromStorage(storagePath);
      }

      toast({ title: "Item Deleted", description: `The ${type} has been permanently removed from Firestore.`, type: "info" });
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Deletion Failed", description: error.message || "Could not delete document.", type: "error" });
    }
  };

  // ==========================================
  // Update Item Status (Publish / Archive)
  // ==========================================
  const handleToggleStatus = async (
    type: "event" | "opportunity" | "resource" | "notice",
    id: string,
    currentStatus?: string
  ) => {
    try {
      if (type === "event") {
        const nextStatus = currentStatus === "past" ? "upcoming" : "past";
        await updateDoc(doc(db, "events", id), { status: nextStatus, updatedAt: serverTimestamp() });
        toast({ title: "Event Status Updated", description: `Event status set to ${nextStatus}.`, type: "success" });
      } else if (type === "opportunity") {
        const nextStatus = currentStatus === "archived" ? "published" : "archived";
        await updateDoc(doc(db, "opportunities", id), { status: nextStatus, updatedAt: serverTimestamp() });
        toast({ title: "Opportunity Status Updated", description: `Opportunity is now ${nextStatus}.`, type: "success" });
      } else if (type === "resource") {
        const nextStatus = currentStatus === "archived" ? "published" : "archived";
        await updateDoc(doc(db, "resources", id), { status: nextStatus, updatedAt: serverTimestamp() });
        toast({ title: "Resource Status Updated", description: `Resource is now ${nextStatus}.`, type: "success" });
      } else if (type === "notice") {
        const nextStatus = currentStatus === "archived" ? "published" : "archived";
        await updateDoc(doc(db, "announcements", id), { status: nextStatus, updatedAt: serverTimestamp() });
        toast({ title: "Notice Status Updated", description: `Circular is now ${nextStatus}.`, type: "success" });
      }
      loadTabData();
    } catch (err: unknown) {
      const error = err as Error;
      toast({ title: "Update Failed", description: error.message, type: "error" });
    }
  };

  // ==========================================
  // Export Registrations CSV
  // ==========================================
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast({ title: "No Registrations", description: "There are no registration records to export.", type: "info" });
      return;
    }
    const headers = ["Student Name", "Enrollment No", "Event Registered", "Branch", "Semester", "Email", "Status", "Timestamp"];
    const rows = registrations.map((r) => [
      `"${r.studentName || ""}"`,
      `"${r.enrollmentNo || ""}"`,
      `"${r.eventTitle || ""}"`,
      `"${r.branch || ""}"`,
      `"${r.semester || ""}"`,
      `"${r.userEmail || ""}"`,
      `"${r.status || ""}"`,
      `"${r.registeredAt ? new Date().toISOString() : ""}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ADGIPS_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "CSV Downloaded", description: `${registrations.length} registration records exported.`, type: "success" });
  };

  // ==========================================
  // 1. Loading Gate
  // ==========================================
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

  // ==========================================
  // 2. Unauthenticated Gate
  // ==========================================
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

  // ==========================================
  // 3. Unauthorized Non-Admin Gate (403 Forbidden)
  // ==========================================
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
    <div className="flex-1 bg-transparent pt-2 pb-16">
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
              Publish, edit, and manage live collegiate events, academic materials, official circulars, campus photo albums, and student registrations.
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
              className="text-xs cursor-pointer"
            >
              Sign Out
            </Button>
            <Button variant="white" size="sm" href="/">
              View Site &rarr;
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-3 mb-6 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            {[
              { id: "events", label: "Campus Events", icon: Calendar },
              { id: "opportunities", label: "Opportunities", icon: Award },
              { id: "resources", label: "Academic Resources", icon: Upload },
              { id: "notices", label: "Campus Notices", icon: FileText },
              { id: "gallery", label: "Campus Gallery", icon: ImageIcon },
              { id: "registrations", label: "Event Registrations", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                    setSubView("create");
                    setFilterQuery("");
                  }}
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

          {activeTab !== "registrations" && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
              <button
                onClick={() => setSubView("create")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  subView === "create" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                + New Item
              </button>
              <button
                onClick={() => setSubView("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  subView === "list" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Manage (
                  {activeTab === "events"
                    ? eventsList.length
                    : activeTab === "opportunities"
                    ? opportunitiesList.length
                    : activeTab === "resources"
                    ? resourcesList.length
                    : activeTab === "notices"
                    ? noticesList.length
                    : galleryList.length}
                )
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CAMPUS EVENTS */}
        {/* ========================================================================= */}
        {activeTab === "events" && subView === "create" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>Schedule & Publish Collegiate Event</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Event will be displayed on the Events page and featured Liquid Lens Carousel.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. ADGIPS Winter Tech Fest & Hackathon 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Technical" className="bg-slate-900">Technical</option>
                    <option value="Competitions" className="bg-slate-900">Competitions</option>
                    <option value="Cultural" className="bg-slate-900">Cultural</option>
                    <option value="Sports" className="bg-slate-900">Sports</option>
                    <option value="Seminars" className="bg-slate-900">Seminars</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. 15 December 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Timing</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 10:00 AM to 5:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Campus Venue *</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. Main Auditorium / Block B Computer Labs"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Registration Link (Optional)</label>
                <input
                  type="url"
                  value={eventRegistrationLink}
                  onChange={(e) => setEventRegistrationLink(e.target.value)}
                  placeholder="https://forms.gle/... or official registration portal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Description</label>
                <textarea
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Comprehensive event details, keynote speakers, competition guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Event Poster Upload */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="block font-semibold text-slate-300">
                  Event Banner / Photograph Upload (Firebase Storage)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!uploadFile || isUploading}
                    onClick={() => handleFileUpload("events")}
                    className="shrink-0 font-bold"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : "Upload to Storage"}
                  </Button>
                </div>
                {uploadedUrl && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Banner image successfully secured in Firebase Storage.</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="font-bold bg-blue-600 hover:bg-blue-500"
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{isSubmitting ? "Publishing Event..." : "Publish Event to Live Calendar"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setPreviewItem({
                      type: "event",
                      data: {
                        title: eventTitle || "Event Title Preview",
                        category: eventCategory,
                        date: eventDate || "Date TBD",
                        venue: eventVenue || "ADGIPS Campus",
                        description: eventDescription || "Event description preview...",
                        image: uploadedUrl || "/images/engineering.jpg",
                      },
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span>Preview Event Card</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 1: LIST / MANAGE EVENTS */}
        {activeTab === "events" && subView === "list" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Live Published Events ({eventsList.length})</h2>
                <p className="text-xs text-slate-400">Manage collegiate events stored in Cloud Firestore</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading events from Firestore...</div>
            ) : eventsList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-white">No campus events published yet.</p>
                <p>Click &ldquo;+ New Item&rdquo; above to publish your first collegiate event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/10 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Title & Category</th>
                      <th className="py-2.5 px-3">Date & Venue</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Publisher</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {eventsList
                      .filter((e) => !filterQuery || e.title.toLowerCase().includes(filterQuery.toLowerCase()))
                      .map((e) => (
                        <tr key={e.id}>
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{e.title}</span>
                            <span className="text-[10px] text-blue-400 uppercase">{e.category}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            <span>{e.date}</span>
                            <span className="text-slate-400 block text-[11px]">{e.venue}</span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleToggleStatus("event", e.id, e.status)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                e.status === "upcoming" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"
                              }`}
                              title="Click to toggle upcoming/past"
                            >
                              {e.status}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">{e.publishedBy || "Admin"}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteItem("event", e.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1B: OPPORTUNITIES */}
        {/* ========================================================================= */}
        {activeTab === "opportunities" && subView === "create" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span>Publish Hackathon, Internship or Student Opportunity</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Opportunity will be listed in the homepage spotlight and student opportunities feed.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  placeholder="e.g. Smart India Hackathon 2026 / Google Summer of Code"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Host Organization / Cell *</label>
                  <input
                    type="text"
                    required
                    value={oppOrg}
                    onChange={(e) => setOppOrg(e.target.value)}
                    placeholder="e.g. Ministry of Education / Microsoft / IEEE"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={oppCategory}
                    onChange={(e) => setOppCategory(e.target.value as OpportunityCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hackathon" className="bg-slate-900">Hackathon</option>
                    <option value="Internship" className="bg-slate-900">Internship</option>
                    <option value="Competition" className="bg-slate-900">Competition</option>
                    <option value="Scholarship" className="bg-slate-900">Scholarship</option>
                    <option value="Workshop" className="bg-slate-900">Workshop</option>
                    <option value="Student Programme" className="bg-slate-900">Student Programme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Participation Mode</label>
                  <select
                    value={oppMode}
                    onChange={(e) => setOppMode(e.target.value as "Online" | "Offline" | "Hybrid")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Online" className="bg-slate-900">Online</option>
                    <option value="Offline" className="bg-slate-900">Offline</option>
                    <option value="Hybrid" className="bg-slate-900">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Application Deadline</label>
                  <input
                    type="text"
                    value={oppDeadline}
                    onChange={(e) => setOppDeadline(e.target.value)}
                    placeholder="e.g. 15 March 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={oppLocation}
                    onChange={(e) => setOppLocation(e.target.value)}
                    placeholder="e.g. Virtual / New Delhi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={oppEligibility}
                    onChange={(e) => setOppEligibility(e.target.value)}
                    placeholder="e.g. Open to 2nd, 3rd & 4th year B.Tech, BCA & MCA students"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stipend / Prize Pool / Benefit</label>
                  <input
                    type="text"
                    value={oppPrize}
                    onChange={(e) => setOppPrize(e.target.value)}
                    placeholder="e.g. ₹1,00,000 Cash Prize + PPI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Application Link *</label>
                <input
                  type="url"
                  required
                  value={oppApplyLink}
                  onChange={(e) => setOppApplyLink(e.target.value)}
                  placeholder="https://sih.gov.in/ or official application portal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={oppTags}
                  onChange={(e) => setOppTags(e.target.value)}
                  placeholder="e.g. AI, Full-Stack, Web3, Fellowship"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="oppFeatured"
                  checked={oppFeatured}
                  onChange={(e) => setOppFeatured(e.target.checked)}
                  className="rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="oppFeatured" className="text-slate-300 font-medium cursor-pointer">
                  Feature in Spotlight Card on Homepage
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="font-bold bg-blue-600 hover:bg-blue-500"
                >
                  <Award className="w-4 h-4 mr-1.5" />
                  <span>{isSubmitting ? "Publishing..." : "Publish Opportunity"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setPreviewItem({
                      type: "opportunity",
                      data: {
                        title: oppTitle || "Opportunity Title Preview",
                        organization: oppOrg || "Host Organization",
                        category: oppCategory,
                        deadline: oppDeadline || "Rolling",
                        location: oppLocation || "Virtual",
                        mode: oppMode,
                        eligibility: oppEligibility || "Open to all students",
                        stipendOrPrize: oppPrize || undefined,
                      },
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span>Preview Card</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 1B: LIST / MANAGE OPPORTUNITIES */}
        {activeTab === "opportunities" && subView === "list" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Live Opportunities ({opportunitiesList.length})</h2>
                <p className="text-xs text-slate-400">Manage hackathons, internships, and competitive programmes</p>
              </div>
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter opportunities..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading opportunities from Firestore...</div>
            ) : opportunitiesList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-white">No opportunities listed in Firestore yet.</p>
                <p className="text-[11px] mt-1">Click &quot;+ New Item&quot; to publish a hackathon or internship.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/10 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Opportunity</th>
                      <th className="py-2.5 px-3">Category / Mode</th>
                      <th className="py-2.5 px-3">Deadline</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Apply Link</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {opportunitiesList
                      .filter(
                        (o) =>
                          !filterQuery ||
                          o.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          o.organization.toLowerCase().includes(filterQuery.toLowerCase())
                      )
                      .map((o) => (
                        <tr key={o.id}>
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{o.title}</span>
                            <span className="text-[11px] text-blue-300">{o.organization}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 block">{o.category}</span>
                            <span className="text-[10px] text-slate-400">{o.mode}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            <span>{o.deadline}</span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleToggleStatus("opportunity", o.id, o.status)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                o.status === "published"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-slate-700 text-slate-300"
                              }`}
                              title="Click to toggle published/archived"
                            >
                              {o.status || "published"}
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <a
                              href={o.applyLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>Apply</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteItem("opportunity", o.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete opportunity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ACADEMIC RESOURCES */}
        {/* ========================================================================= */}
        {activeTab === "resources" && subView === "create" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <span>Publish New Academic Resource or PYQ</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Resource will be indexed in Knowledge Commons and linked to official files.
              </p>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={resCode}
                    onChange={(e) => setResCode(e.target.value)}
                    placeholder="e.g. ETCS-402"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Academic Stream</label>
                  <select
                    value={resStream}
                    onChange={(e) => setResStream(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Engineering" className="bg-slate-900">Engineering</option>
                    <option value="Law" className="bg-slate-900">Law</option>
                    <option value="Management" className="bg-slate-900">Management</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject / Resource Title *</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Information & Network Security End-Term PYQ (2020-2025)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={resDept}
                    onChange={(e) => setResDept(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Semester</label>
                  <select
                    value={resSem}
                    onChange={(e) => setResSem(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"].map((s) => (
                      <option key={s} value={s} className="bg-slate-900">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Material Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Previous Year Paper" className="bg-slate-900">Previous Year Paper</option>
                    <option value="Syllabus Scheme" className="bg-slate-900">Syllabus Scheme</option>
                    <option value="Lab Manual" className="bg-slate-900">Lab Manual</option>
                    <option value="Lecture Notes" className="bg-slate-900">Lecture Notes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  placeholder="Summary of units, topics covered, GGSIPU scheme credits..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Resource Document Upload */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="block font-semibold text-slate-300">
                  Upload PDF / Syllabus Handout (Firebase Storage)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!uploadFile || isUploading}
                    onClick={() => handleFileUpload("resources")}
                    className="shrink-0 font-bold"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : "Upload to Storage"}
                  </Button>
                </div>
                {uploadedUrl && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File uploaded and ready for student downloads.</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="font-bold bg-blue-600 hover:bg-blue-500">
                  <Upload className="w-4 h-4 mr-1.5" />
                  <span>{isSubmitting ? "Publishing..." : "Publish to Knowledge Commons"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setPreviewItem({
                      type: "resource",
                      data: {
                        code: resCode || "ETCS-000",
                        title: resTitle || "Resource Title Preview",
                        stream: resStream,
                        semester: resSem,
                        type: resType,
                        description: resDescription || "Resource description preview...",
                      },
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span>Preview</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: LIST / MANAGE RESOURCES */}
        {activeTab === "resources" && subView === "list" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Indexed Academic Resources ({resourcesList.length})</h2>
                <p className="text-xs text-slate-400">Manage curriculum schemes, notes, and lab manuals in Firestore</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search code or title..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading resources from Firestore...</div>
            ) : resourcesList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Upload className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-white">No academic resources published yet.</p>
                <p>Use the form to upload and index syllabus schemes or question papers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/10 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Stream / Sem</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">File Link</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Downloads</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {resourcesList
                      .filter((r) => !filterQuery || r.title.toLowerCase().includes(filterQuery.toLowerCase()) || r.code.toLowerCase().includes(filterQuery.toLowerCase()))
                      .map((r) => (
                        <tr key={r.id}>
                          <td className="py-3 px-3">
                            <span className="font-mono text-emerald-400 font-bold block">{r.code}</span>
                            <span className="text-white font-semibold">{r.title}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            <span>{r.stream}</span>
                            <span className="text-slate-400 block text-[11px]">{r.semester}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-semibold">
                              {r.type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {r.fileUrl ? (
                              <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]">
                                <span>Download</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-500 text-[11px]">No file attached</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                r.status === "archived"
                                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              }`}
                            >
                              {r.status || "published"}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                            {r.downloadsCount || 0}
                          </td>
                          <td className="py-3 px-3 text-right space-x-1">
                            <button
                              onClick={() => setPreviewItem({ type: "resource", data: r })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                              title="Preview resource"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus("resource", r.id, r.status)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                              title={r.status === "archived" ? "Publish resource" : "Archive resource"}
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("resource", r.id, r.storagePath)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete resource"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CAMPUS NOTICES */}
        {/* ========================================================================= */}
        {activeTab === "notices" && subView === "create" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Broadcast Official Campus Circular / Notice</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Notice will be displayed on the homepage announcements ticker and circulars archive.
              </p>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Circular / Advisory Title *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Schedule for Submission of End-Term Practical Files"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Notice Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Academic" className="bg-slate-900">Academic</option>
                    <option value="Examination" className="bg-slate-900">Examination</option>
                    <option value="Placement" className="bg-slate-900">Placement</option>
                    <option value="Events" className="bg-slate-900">Events</option>
                    <option value="Administrative" className="bg-slate-900">Administrative</option>
                  </select>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNoticeUrgent}
                      onChange={(e) => setIsNoticeUrgent(e.target.checked)}
                      className="rounded text-rose-500 focus:ring-rose-500 bg-white/10 border-white/20 cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-rose-300">Mark as Priority / Urgent</span>
                  </label>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Promulgation Date *</label>
                  <input
                    type="text"
                    required
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    placeholder="e.g. 10 November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valid Until / Expiry (Optional)</label>
                  <input
                    type="text"
                    value={noticeExpiryDate}
                    onChange={(e) => setNoticeExpiryDate(e.target.value)}
                    placeholder="e.g. 30 November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={noticeSummary}
                  onChange={(e) => setNoticeSummary(e.target.value)}
                  placeholder="Key instructions, affected semesters, deadlines, and contact offices..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Circular Directives / Details (Optional)</label>
                <textarea
                  rows={3}
                  value={noticeDetails}
                  onChange={(e) => setNoticeDetails(e.target.value)}
                  placeholder="Comprehensive guidelines, schedule tables, examination hall instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Document upload for notice */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="block font-semibold text-slate-300">
                  Attach Official Signed Circular (PDF)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!uploadFile || isUploading}
                    onClick={() => handleFileUpload("announcements")}
                    className="shrink-0 font-bold"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : "Upload to Storage"}
                  </Button>
                </div>
                {uploadedUrl && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official PDF circular attached.</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="font-bold bg-blue-600 hover:bg-blue-500">
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>{isSubmitting ? "Broadcasting..." : "Broadcast Notice to Campus Feed"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setPreviewItem({
                      type: "notice",
                      data: {
                        title: noticeTitle || "Circular Title Preview",
                        category: noticeCategory,
                        date: noticeDate || "Current Date",
                        summary: noticeSummary || "Circular summary text preview...",
                      },
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  <span>Preview Notice</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LIST / MANAGE NOTICES */}
        {activeTab === "notices" && subView === "list" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Broadcasted Notices ({noticesList.length})</h2>
                <p className="text-xs text-slate-400">Manage institutional circulars stored in Firestore</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search notices..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading notices from Firestore...</div>
            ) : noticesList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-white">No active campus notices broadcasted yet.</p>
                <p>Click &ldquo;+ New Item&rdquo; above to publish an official circular.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/10 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Title & Category</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Document</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {noticesList
                      .filter((n) => !filterQuery || n.title.toLowerCase().includes(filterQuery.toLowerCase()))
                      .map((n) => (
                        <tr key={n.id}>
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{n.title}</span>
                            <span className={`text-[10px] font-bold uppercase ${n.isUrgent ? "text-rose-400" : "text-blue-400"}`}>
                              {n.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            <span>{n.date}</span>
                            {n.expiryDate && (
                              <span className="block text-[10px] text-amber-400/80">Expires: {n.expiryDate}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleToggleStatus("notice", n.id, n.status)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                n.status !== "archived"
                                  ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                              }`}
                              title="Click to toggle published / archived"
                            >
                              {n.status || "published"}
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            {n.fileUrl ? (
                              <a href={n.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]">
                                <span>Circular PDF</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Text Directive</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteItem("notice", n.id, n.storagePath)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete notice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CAMPUS GALLERY */}
        {/* ========================================================================= */}
        {activeTab === "gallery" && subView === "create" && (
          <div className="max-w-3xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <span>Publish Campus Photograph to 3D Journal</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload authentic campus photographs to the interactive FolioFlow 3D book gallery.
              </p>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  placeholder="e.g. Annual Convocation Ceremony 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Campus Life" className="bg-slate-900">Campus Life</option>
                    <option value="Infrastructure" className="bg-slate-900">Infrastructure</option>
                    <option value="Cultural" className="bg-slate-900">Cultural</option>
                    <option value="Hackathons" className="bg-slate-900">Hackathons</option>
                    <option value="Sports" className="bg-slate-900">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={galEventName}
                    onChange={(e) => setGalEventName(e.target.value)}
                    placeholder="e.g. Utkarsh Fest"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={galDate}
                    onChange={(e) => setGalDate(e.target.value)}
                    placeholder="e.g. Nov 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={galDescription}
                  onChange={(e) => setGalDescription(e.target.value)}
                  placeholder="Caption for the 3D folio journal spread..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Photo Upload */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="block font-semibold text-slate-300">
                  Upload High-Resolution Photo * (Firebase Storage)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    required={!uploadedUrl}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!uploadFile || isUploading}
                    onClick={() => handleFileUpload("gallery")}
                    className="shrink-0 font-bold"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : "Upload to Storage"}
                  </Button>
                </div>
                {uploadedUrl && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Photo uploaded and linked to storage.</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting || !uploadedUrl} className="font-bold bg-blue-600 hover:bg-blue-500">
                  <ImageIcon className="w-4 h-4 mr-1.5" />
                  <span>{isSubmitting ? "Publishing Photo..." : "Publish to Gallery"}</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: LIST / MANAGE GALLERY */}
        {activeTab === "gallery" && subView === "list" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Gallery Photos in Archive ({galleryList.length})</h2>
                <p className="text-xs text-slate-400">Manage 3D Folio Journal photographs stored in Firestore</p>
              </div>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading gallery from Firestore...</div>
            ) : galleryList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-white">No gallery photographs published yet.</p>
                <p>Upload campus photographs using the form above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryList.map((g) => (
                  <div key={g.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-white text-xs block">{g.title}</span>
                      <span className="text-[10px] text-blue-400 block">{g.category} • {g.date}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{g.publishedBy || "Admin"}</span>
                      <button
                        onClick={() => handleDeleteItem("gallery", g.id, g.storagePath)}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STUDENT REGISTRATIONS LIVE FEED */}
        {/* ========================================================================= */}
        {activeTab === "registrations" && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">Live Student Event Passes & Submissions ({registrations.length})</h2>
                <p className="text-xs text-slate-400">Incoming real-time registrations stored in Cloud Firestore</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={loadTabData} className="text-xs">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Refresh
                </Button>
                <Button variant="white" size="sm" onClick={handleExportCSV} className="text-xs font-bold">
                  Export CSV Manifest
                </Button>
              </div>
            </div>

            {isLoadingData ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading registrations from Firestore...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/10 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Enrollment No.</th>
                      <th className="py-2.5 px-3">Event Registered</th>
                      <th className="py-2.5 px-3">Stream / Sem</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {registrations.length > 0 ? (
                      registrations.map((reg) => (
                        <tr key={reg.id}>
                          <td className="py-2.5 px-3 font-semibold text-white">{reg.studentName}</td>
                          <td className="py-2.5 px-3 font-mono text-blue-300">{reg.enrollmentNo}</td>
                          <td className="py-2.5 px-3">{reg.eventTitle}</td>
                          <td className="py-2.5 px-3 text-slate-400">{reg.branch || "General"} ({reg.semester || "Current"})</td>
                          <td className="py-2.5 px-3">
                            <span className={reg.status === "confirmed" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p className="font-semibold text-white">No event registrations recorded yet.</p>
                          <p className="text-[11px]">Real student event passes will populate here as registrations are submitted.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW MODAL */}
        {/* ========================================================================= */}
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md bg-[#071126] border border-white/20 rounded-3xl p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <Badge variant="navy" className="text-xs">
                  Preview Mode
                </Badge>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {previewItem.type === "event" && (
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewItem.data.image} alt={previewItem.data.title} className="w-full h-full object-cover" />
                  </div>
                  <Badge variant="default" className="text-[10px] bg-blue-600">
                    {previewItem.data.category}
                  </Badge>
                  <h3 className="text-base font-bold text-white">{previewItem.data.title}</h3>
                  <p className="text-xs text-slate-400">{previewItem.data.date} • {previewItem.data.venue}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{previewItem.data.description}</p>
                </div>
              )}

              {previewItem.type === "opportunity" && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-[10px] bg-blue-600">
                      {previewItem.data.category}
                    </Badge>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">{previewItem.data.mode}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{previewItem.data.title}</h3>
                  <p className="text-xs text-blue-300 font-semibold">{previewItem.data.organization}</p>
                  <p className="text-xs text-slate-400">Deadline: {previewItem.data.deadline} • {previewItem.data.location}</p>
                  {previewItem.data.stipendOrPrize && (
                    <p className="text-xs text-emerald-400 font-bold">{previewItem.data.stipendOrPrize}</p>
                  )}
                  <p className="text-xs text-slate-300">{previewItem.data.eligibility}</p>
                </div>
              )}

              {previewItem.type === "resource" && (
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="font-mono text-emerald-400 text-xs font-bold block">{previewItem.data.code}</span>
                  <h3 className="text-sm font-bold text-white">{previewItem.data.title}</h3>
                  <p className="text-xs text-slate-400">{previewItem.data.stream} • {previewItem.data.semester} • {previewItem.data.type}</p>
                  <p className="text-xs text-slate-300">{previewItem.data.description}</p>
                </div>
              )}

              {previewItem.type === "notice" && (
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-blue-400">{previewItem.data.category}</span>
                  <h3 className="text-sm font-bold text-white">{previewItem.data.title}</h3>
                  <p className="text-xs text-slate-400">{previewItem.data.date}</p>
                  <p className="text-xs text-slate-300">{previewItem.data.summary}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setPreviewItem(null)}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
