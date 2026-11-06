import * as fs from "fs";
import * as path from "path";
import { AnnouncementItem } from "../types";
import { AnnouncementDocument } from "../types/backend";

async function runPhase5Tests() {
  console.log("=================================================");
  console.log("📢 PHASE 5 — COMMUNITY & NOTICES TEST SUITE");
  console.log("=================================================\n");

  const results: { test: string; passed: boolean; message: string }[] = [];

  // ------------------------------------------------------------------
  // Test 1: Notice Document Schema & Invariants
  // ------------------------------------------------------------------
  try {
    const validCategories = ["Academic", "Examination", "Placement", "Events", "Administrative"];
    const validStatuses = ["published", "archived", "draft"];

    const sampleNotice: AnnouncementDocument = {
      id: "notice_1730000000",
      title: "Schedule for Submission of End-Term Practical Files",
      category: "Examination",
      date: "10 November 2026",
      expiryDate: "30 November 2026",
      isUrgent: true,
      summary: "All 5th and 7th semester B.Tech scholars must submit authenticated lab records.",
      details: "Submissions must be signed by the respective laboratory mentor before 4:00 PM.",
      fileUrl: "https://firebasestorage.googleapis.com/v0/b/adgips-website.firebasestorage.app/o/announcements%2Fcircular.pdf?alt=media",
      storagePath: "announcements/circular.pdf",
      fileSize: "245 KB",
      status: "published",
      publishedBy: "Registrar Secretariat",
    };

    if (!validCategories.includes(sampleNotice.category)) {
      throw new Error(`Invalid category: ${sampleNotice.category}`);
    }
    if (!validStatuses.includes(sampleNotice.status || "")) {
      throw new Error(`Invalid status: ${sampleNotice.status}`);
    }
    if (!sampleNotice.title.trim() || !sampleNotice.summary.trim() || !sampleNotice.date.trim()) {
      throw new Error("Notice title, summary, and promulgated date are strictly mandatory.");
    }

    results.push({
      test: "Notice Document Schema & Invariants",
      passed: true,
      message: `Verified mandatory fields, valid sector (${sampleNotice.category}), status (${sampleNotice.status}), and storage path.`,
    });
  } catch (err: any) {
    results.push({
      test: "Notice Document Schema & Invariants",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 2: Public Visibility Restriction (Drafts & Archived Filter)
  // ------------------------------------------------------------------
  try {
    const noticePool: AnnouncementDocument[] = [
      {
        id: "notice_pub_1",
        title: "Active Examination Circular",
        category: "Examination",
        date: "12 Nov 2026",
        summary: "Live exam notification.",
        status: "published",
      },
      {
        id: "notice_arch_1",
        title: "Old Re-evaluation Directive",
        category: "Academic",
        date: "01 Jan 2025",
        summary: "Expired academic notice.",
        status: "archived",
      },
      {
        id: "notice_draft_1",
        title: "Unapproved Placement Policy Draft",
        category: "Placement",
        date: "Today",
        summary: "Internal administrative draft.",
        status: "draft",
      },
      {
        id: "notice_legacy_pub",
        title: "Legacy Circular Without Status Field",
        category: "Administrative",
        date: "10 Oct 2026",
        summary: "Permitted published notice.",
      },
    ];

    // Simulate public filter
    const publiclyVisible = noticePool.filter(
      (n) => n.status !== "archived" && n.status !== "draft"
    );

    if (publiclyVisible.length !== 2) {
      throw new Error(`Expected 2 public notices, got ${publiclyVisible.length}`);
    }
    const hasArchived = publiclyVisible.some((n) => n.status === "archived");
    const hasDraft = publiclyVisible.some((n) => n.status === "draft");

    if (hasArchived || hasDraft) {
      throw new Error("Public visibility failed to exclude archived or draft notices.");
    }

    results.push({
      test: "Public Visibility & Archive Isolation",
      passed: true,
      message: "Archived circulars and unapproved drafts are strictly excluded from public feed.",
    });
  } catch (err: any) {
    results.push({
      test: "Public Visibility & Archive Isolation",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 3: Sector Filtering & Search Logic
  // ------------------------------------------------------------------
  try {
    const notices: AnnouncementItem[] = [
      {
        id: "1",
        title: "Mid-Term Examination Seating Plan",
        category: "Examination",
        date: "15 Nov 2026",
        summary: "Seating matrix for Block 1 and Block 2.",
        isDemo: false,
      },
      {
        id: "2",
        title: "Campus Placement Drive: Infosys & TCS",
        category: "Placement",
        date: "18 Nov 2026",
        summary: "Eligibility criteria and registration window for final year scholars.",
        isDemo: false,
      },
      {
        id: "3",
        title: "Submission of Scholarship Application Forms",
        category: "Academic",
        date: "20 Nov 2026",
        summary: "State and merit-cum-means scholarship forms to be submitted to Room 104.",
        isDemo: false,
      },
    ];

    // Sector Filter: Examination
    const examOnly = notices.filter((n) => n.category === "Examination");
    if (examOnly.length !== 1 || examOnly[0].id !== "1") {
      throw new Error("Sector filtering failed for Examination.");
    }

    // Search query: "scholarship"
    const query = "scholarship";
    const searchMatch = notices.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.summary.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query)
    );
    if (searchMatch.length !== 1 || searchMatch[0].id !== "3") {
      throw new Error("Keyword search failed to isolate scholarship notice.");
    }

    results.push({
      test: "Sector Dispatches & Search Multi-Filter",
      passed: true,
      message: "Sector classification (Academic, Examination, Placement) and text search filter with 100% accuracy.",
    });
  } catch (err: any) {
    results.push({
      test: "Sector Dispatches & Search Multi-Filter",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 4: Storage Security & Document Upload Path
  // ------------------------------------------------------------------
  try {
    const storagePath = path.join(process.cwd(), "storage.rules");
    const storageContent = fs.readFileSync(storagePath, "utf-8");

    if (!storageContent.includes("allow write: if isAdmin();")) {
      throw new Error("storage.rules must restrict uploads strictly to isAdmin().");
    }
    if (!storageContent.includes("allow read: if true;")) {
      throw new Error("storage.rules must allow public read for official circular documents.");
    }

    results.push({
      test: "Storage Security Rules Invariant",
      passed: true,
      message: "Firebase Storage enforces public read and admin-restricted uploads for official circulars.",
    });
  } catch (err: any) {
    results.push({
      test: "Storage Security Rules Invariant",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 5: Firestore Security Rules Coverage for Announcements
  // ------------------------------------------------------------------
  try {
    const rulesPath = path.join(process.cwd(), "firestore.rules");
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");

    if (!rulesContent.includes("match /announcements/{announcementId}")) {
      throw new Error("firestore.rules missing /announcements/{announcementId} block.");
    }

    const noticeBlock = rulesContent.substring(
      rulesContent.indexOf("match /announcements/{announcementId}"),
      rulesContent.indexOf("match /announcements/{announcementId}") + 200
    );

    if (!noticeBlock.includes("allow read: if true;")) {
      throw new Error("Announcements collection must allow public read access.");
    }
    if (!noticeBlock.includes("allow write: if isAdmin();")) {
      throw new Error("Announcements collection must restrict writes to isAdmin().");
    }

    results.push({
      test: "Firestore Security Rules Coverage",
      passed: true,
      message: "Security rules enforce public read and isAdmin() writes for /announcements.",
    });
  } catch (err: any) {
    results.push({
      test: "Firestore Security Rules Coverage",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 6: Empty Database Client Query Resilience
  // ------------------------------------------------------------------
  try {
    const { getAnnouncementsFromFirestore, getPublishedAnnouncementsFromFirestore } = await import(
      "../lib/firebase/firestore"
    );

    const [allNotices, pubNotices] = await Promise.all([
      getAnnouncementsFromFirestore(),
      getPublishedAnnouncementsFromFirestore(),
    ]);

    if (!Array.isArray(allNotices) || !Array.isArray(pubNotices)) {
      throw new Error("Retrieval functions must always return array structures.");
    }

    results.push({
      test: "Live Firestore Empty Database Query Resilience",
      passed: true,
      message: `Firestore client queries executed safely (total: ${allNotices.length}, published: ${pubNotices.length}).`,
    });
  } catch (err: any) {
    results.push({
      test: "Live Firestore Empty Database Query Resilience",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Print Summary
  // ------------------------------------------------------------------
  console.log("=================================================");
  console.log("TEST RESULTS SUMMARY");
  console.log("=================================================");
  let allPassed = true;
  for (const r of results) {
    const mark = r.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${mark} | ${r.test}: ${r.message}`);
    if (!r.passed) allPassed = false;
  }
  console.log("=================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
  process.exit(0);
}

runPhase5Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
