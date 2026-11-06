/**
 * IPVERSE - Supabase PostgreSQL + Firebase Authentication Hybrid Verification Suite
 *
 * Validates:
 * 1. Environment variable configuration & security boundaries
 * 2. Supabase PostgreSQL connectivity across all 8 tables
 * 3. End-to-end CRUD persistence on Supabase:
 *    - Events
 *    - Opportunities
 *    - Academic Resources
 *    - Announcements / Circulars
 *    - Campus Gallery
 *    - Event Registrations
 *    - Contact Inquiries
 * 4. User profile synchronization & role resolution
 * 5. Architectural integrity: 0 application-level imports of Firestore
 */

import fs from "fs";
import path from "path";

// Load .env.local if present
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { createClient } from "@supabase/supabase-js";
import {
  getEventsFromSupabase,
  createEventInSupabase,
  updateEventInSupabase,
  deleteEventInSupabase,
  getOpportunitiesFromSupabase,
  createOpportunityInSupabase,
  updateOpportunityInSupabase,
  deleteOpportunityInSupabase,
  getResourcesFromSupabase,
  getPublishedResourcesFromSupabase,
  createResourceInSupabase,
  incrementResourceDownloadCountInSupabase,
  deleteResourceInSupabase,
  getAnnouncementsFromSupabase,
  getPublishedAnnouncementsFromSupabase,
  createAnnouncementInSupabase,
  deleteAnnouncementInSupabase,
  getGalleryFromSupabase,
  createGalleryItemInSupabase,
  deleteGalleryItemFromSupabase,
  getRegistrationsFromSupabase,
  createRegistrationInSupabase,
  createContactMessageInSupabase,
  syncUserProfileInSupabase,
  getUserProfileFromSupabase,
} from "../lib/supabase/queries";
import { supabaseAdmin } from "../lib/supabase/server";

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function record(suite: string, test: string, passed: boolean, message: string) {
  results.push({ suite, test, passed, message });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${suite}] ${test}: ${message}`);
}

async function runHybridVerification() {
  console.log("================================================================================");
  console.log("🚀 IPVERSE HYBRID BACKEND ARCHITECTURE VERIFICATION (Supabase + Firebase Auth)");
  console.log("================================================================================\n");

  // ---------------------------------------------------------------------------
  // SUITE 1: Environment & Security Key Configuration
  // ---------------------------------------------------------------------------
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  record(
    "ENV_VARS",
    "NEXT_PUBLIC_SUPABASE_URL configuration",
    Boolean(supabaseUrl && supabaseUrl.startsWith("https://")),
    supabaseUrl ? `Configured (${supabaseUrl})` : "Missing NEXT_PUBLIC_SUPABASE_URL"
  );

  record(
    "ENV_VARS",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY configuration",
    Boolean(supabaseAnonKey && supabaseAnonKey.length > 20),
    supabaseAnonKey ? "Configured and non-empty" : "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );

  record(
    "ENV_VARS",
    "SUPABASE_SERVICE_ROLE_KEY server-side configuration",
    Boolean(supabaseServiceKey && supabaseServiceKey.length > 20),
    supabaseServiceKey ? "Configured on server-only process" : "Missing SUPABASE_SERVICE_ROLE_KEY"
  );

  // ---------------------------------------------------------------------------
  // SUITE 2: Supabase PostgreSQL Table Connectivity
  // ---------------------------------------------------------------------------
  const tables = [
    "users",
    "events",
    "opportunities",
    "resources",
    "announcements",
    "gallery",
    "registrations",
    "contact_messages",
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin.from(table).select("*").limit(1);
      record(
        "TABLE_CONNECTIVITY",
        `Table '${table}' queryable`,
        !error,
        error ? `Query failed: ${error.message}` : `Success (${data?.length ?? 0} sample rows fetched)`
      );
    } catch (err: any) {
      record("TABLE_CONNECTIVITY", `Table '${table}' exception`, false, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // SUITE 3: CRUD Lifecycle - Events
  // ---------------------------------------------------------------------------
  let testEventId = "";
  try {
    const slug = `audit-test-event-${Date.now()}`;
    testEventId = await createEventInSupabase({
      title: "Automated Audit Test Symposium",
      slug,
      category: "Technical",
      date: "Nov 15, 2026",
      time: "10:00 AM",
      venue: "Main Auditorium",
      description: "Ephemeral verification record for Supabase migration.",
      status: "upcoming",
      image: "/images/engineering.jpg",
      eligibility: "All Branches",
      organizedBy: "Audit Bot",
      tags: ["Audit", "Test"],
    });

    const events = await getEventsFromSupabase();
    const found = events.find((e) => e.id === testEventId);
    record(
      "CRUD_EVENTS",
      "Create & Read Event from Supabase",
      Boolean(found && found.title === "Automated Audit Test Symposium"),
      found ? `Event created with ID: ${testEventId}` : "Event not found after insert"
    );

    await updateEventInSupabase(testEventId, { status: "past" });
    const eventsAfterUpdate = await getEventsFromSupabase();
    const updated = eventsAfterUpdate.find((e) => e.id === testEventId);
    record(
      "CRUD_EVENTS",
      "Update Event status in Supabase",
      Boolean(updated && updated.status === "past"),
      updated ? `Status successfully updated to: ${updated.status}` : "Status update failed"
    );

    await deleteEventInSupabase(testEventId);
    const eventsAfterDelete = await getEventsFromSupabase();
    const stillExists = eventsAfterDelete.some((e) => e.id === testEventId);
    record(
      "CRUD_EVENTS",
      "Delete Event from Supabase",
      !stillExists,
      !stillExists ? "Event deleted and confirmed purged" : "Event still present after delete"
    );
  } catch (err: any) {
    record("CRUD_EVENTS", "Events Lifecycle", false, err.message);
    if (testEventId) await deleteEventInSupabase(testEventId).catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // SUITE 4: CRUD Lifecycle - Opportunities
  // ---------------------------------------------------------------------------
  let testOppId = "";
  try {
    testOppId = await createOpportunityInSupabase({
      title: "Audit Research Fellowship",
      organization: "IPVERSE Labs",
      category: "Competition",
      deadline: "Dec 31, 2026",
      eligibility: "Undergraduates",
      location: "New Delhi",
      mode: "Offline",
      applyLink: "https://adgips.ac.in",
      tags: ["Audit", "Research"],
      featured: true,
      verifiedExternal: true,
      status: "published",
    });

    const opps = await getOpportunitiesFromSupabase();
    const found = opps.find((o) => o.id === testOppId);
    record(
      "CRUD_OPPORTUNITIES",
      "Create & Read Opportunity from Supabase",
      Boolean(found && found.title === "Audit Research Fellowship"),
      found ? `Opportunity created with ID: ${testOppId}` : "Opportunity not found"
    );

    await updateOpportunityInSupabase(testOppId, { status: "archived" });
    const oppsAfterUpdate = await getOpportunitiesFromSupabase();
    const updated = oppsAfterUpdate.find((o) => o.id === testOppId);
    record(
      "CRUD_OPPORTUNITIES",
      "Update Opportunity status in Supabase",
      Boolean(updated && updated.status === "archived"),
      updated ? `Status updated to: ${updated.status}` : "Update failed"
    );

    await deleteOpportunityInSupabase(testOppId);
    const oppsAfterDelete = await getOpportunitiesFromSupabase();
    const stillExists = oppsAfterDelete.some((o) => o.id === testOppId);
    record(
      "CRUD_OPPORTUNITIES",
      "Delete Opportunity from Supabase",
      !stillExists,
      !stillExists ? "Opportunity purged successfully" : "Opportunity not deleted"
    );
  } catch (err: any) {
    record("CRUD_OPPORTUNITIES", "Opportunities Lifecycle", false, err.message);
    if (testOppId) await deleteOpportunityInSupabase(testOppId).catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // SUITE 5: CRUD Lifecycle - Academic Resources
  // ---------------------------------------------------------------------------
  let testResId = "";
  try {
    testResId = await createResourceInSupabase({
      code: "AUD-999",
      title: "Verification Theory and System Design",
      stream: "Engineering",
      department: "Computer Science",
      semester: "Semester 5",
      semesterNumber: 5,
      type: "Lecture Notes",
      year: "2026",
      format: "PDF",
      fileSize: "1.2 MB",
      description: "Audit sample resource item.",
      status: "published",
    });

    const resources = await getPublishedResourcesFromSupabase();
    const found = resources.find((r) => r.id === testResId);
    record(
      "CRUD_RESOURCES",
      "Create & Read Resource from Supabase",
      Boolean(found && found.code === "AUD-999"),
      found ? `Resource created with ID: ${testResId}` : "Resource not found"
    );

    await incrementResourceDownloadCountInSupabase(testResId);
    const { data: resRow } = await supabaseAdmin.from("resources").select("downloads_count").eq("id", testResId).single();
    record(
      "CRUD_RESOURCES",
      "Increment download counter atomically",
      Boolean(resRow && resRow.downloads_count === 1),
      `Download count: ${resRow?.downloads_count}`
    );

    await deleteResourceInSupabase(testResId);
    const resourcesAfterDelete = await getResourcesFromSupabase();
    const stillExists = resourcesAfterDelete.some((r) => r.id === testResId);
    record(
      "CRUD_RESOURCES",
      "Delete Resource from Supabase",
      !stillExists,
      !stillExists ? "Resource purged successfully" : "Resource delete failed"
    );
  } catch (err: any) {
    record("CRUD_RESOURCES", "Resources Lifecycle", false, err.message);
    if (testResId) await deleteResourceInSupabase(testResId).catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // SUITE 6: CRUD Lifecycle - Announcements & Gallery
  // ---------------------------------------------------------------------------
  let testNoticeId = "";
  let testGalleryId = "";
  try {
    testNoticeId = await createAnnouncementInSupabase({
      refCode: "AUDIT-001",
      title: "Audit System Notification",
      category: "Academic",
      authority: "Administrative Officer",
      date: "Nov 07, 2026",
      summary: "Notice verifying Supabase announcements table.",
      priority: "Routine",
      status: "published",
    });

    const notices = await getPublishedAnnouncementsFromSupabase();
    const foundNotice = notices.find((n) => n.id === testNoticeId);
    record(
      "CRUD_ANNOUNCEMENTS",
      "Create & Read Announcement from Supabase",
      Boolean(foundNotice && foundNotice.title === "Audit System Notification"),
      foundNotice ? `Announcement created with ID: ${testNoticeId}` : "Announcement not found"
    );

    await deleteAnnouncementInSupabase(testNoticeId);
    const noticesAfterDelete = await getAnnouncementsFromSupabase();
    record(
      "CRUD_ANNOUNCEMENTS",
      "Delete Announcement from Supabase",
      !noticesAfterDelete.some((n) => n.id === testNoticeId),
      "Purged successfully"
    );

    testGalleryId = await createGalleryItemInSupabase({
      title: "Audit Central Library Space",
      category: "Campus Life",
      imageUrl: "/images/campus-1.jpg",
      location: "Main Campus Library",
    });

    const gallery = await getGalleryFromSupabase();
    const foundGal = gallery.find((g) => g.id === testGalleryId);
    record(
      "CRUD_GALLERY",
      "Create & Read Gallery item from Supabase",
      Boolean(foundGal && foundGal.title === "Audit Central Library Space"),
      foundGal ? `Gallery item created with ID: ${testGalleryId}` : "Gallery item not found"
    );

    await deleteGalleryItemFromSupabase(testGalleryId);
    const galleryAfterDelete = await getGalleryFromSupabase();
    record(
      "CRUD_GALLERY",
      "Delete Gallery item from Supabase",
      !galleryAfterDelete.some((g) => g.id === testGalleryId),
      "Purged successfully"
    );
  } catch (err: any) {
    record("CRUD_ANNOUNCEMENTS_GALLERY", "Announcements & Gallery Lifecycle", false, err.message);
    if (testNoticeId) await deleteAnnouncementInSupabase(testNoticeId).catch(() => {});
    if (testGalleryId) await deleteGalleryItemFromSupabase(testGalleryId).catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // SUITE 7: Student Event Registration & Contact Form
  // ---------------------------------------------------------------------------
  let testRegId = "";
  let regEventParentId = "";
  let regStudentUid = `reg_uid_${Date.now()}`;
  try {
    // 1. Create a student user profile in Supabase to satisfy foreign key
    await syncUserProfileInSupabase({
      uid: regStudentUid,
      name: "Aditya Sharma",
      email: "teststudent@adgips.ac.in",
      photoURL: null,
    });

    // 2. Create parent event in Supabase to satisfy foreign key
    regEventParentId = await createEventInSupabase({
      title: "Registration Host Event",
      slug: `reg-host-event-${Date.now()}`,
      category: "Technical",
      date: "Dec 01, 2026",
      time: "11:00 AM",
      venue: "Lab 4",
      description: "Parent event for registration foreign key test.",
      status: "upcoming",
      image: "/images/engineering.jpg",
      eligibility: "All Students",
      organizedBy: "Audit Bot",
      tags: ["Audit"],
    });

    // 3. Register student for event
    testRegId = await createRegistrationInSupabase({
      eventId: regEventParentId,
      eventTitle: "Registration Host Event",
      userId: regStudentUid,
      userEmail: "teststudent@adgips.ac.in",
      studentName: "Aditya Sharma",
      studentEmail: "teststudent@adgips.ac.in",
      enrollmentNo: "09915603126",
      branch: "CSE",
      semester: "5",
      status: "confirmed",
    });

    const regs = await getRegistrationsFromSupabase();
    const foundReg = regs.find((r) => r.id === testRegId);
    record(
      "CRUD_REGISTRATIONS",
      "Submit and retrieve student registration from Supabase",
      Boolean(foundReg && foundReg.enrollmentNo === "09915603126"),
      foundReg ? `Registration record verified: ${testRegId}` : "Registration not found"
    );

    // Clean up
    await supabaseAdmin.from("registrations").delete().eq("id", testRegId);
    await deleteEventInSupabase(regEventParentId);
    await supabaseAdmin.from("users").delete().eq("firebase_uid", regStudentUid);

    const contactMsgId = await createContactMessageInSupabase({
      name: "Prospective Student",
      email: "inquiry@adgips.ac.in",
      subject: "B.Tech Admissions Verification",
      message: "Testing contact message pipeline with Supabase PostgreSQL.",
    });

    record(
      "CRUD_CONTACT",
      "Persist contact message inquiry to Supabase",
      Boolean(contactMsgId),
      `Inquiry saved with ID: ${contactMsgId}`
    );

    await supabaseAdmin.from("contact_messages").delete().eq("id", contactMsgId);
  } catch (err: any) {
    record("CRUD_REGISTRATIONS", "Registration / Contact Exception", false, err.message);
    if (testRegId) {
      try { await supabaseAdmin.from("registrations").delete().eq("id", testRegId); } catch {}
    }
    if (regEventParentId) {
      try { await deleteEventInSupabase(regEventParentId); } catch {}
    }
    try { await supabaseAdmin.from("users").delete().eq("firebase_uid", regStudentUid); } catch {}
  }

  // ---------------------------------------------------------------------------
  // SUITE 8: User Synchronization & Role Resolution
  // ---------------------------------------------------------------------------
  const testUid = `audit_uid_${Date.now()}`;
  try {
    const profile = await syncUserProfileInSupabase({
      uid: testUid,
      email: "audit.user@adgips.ac.in",
      name: "Audit User",
      photoURL: null,
    });

    record(
      "AUTH_SYNC",
      "Synchronize Firebase Auth identity to Supabase users table",
      Boolean(profile && profile.uid === testUid && profile.role === "student"),
      `Profile synchronized with default role: ${profile.role}`
    );

    const retrieved = await getUserProfileFromSupabase(testUid);
    record(
      "AUTH_SYNC",
      "Retrieve synchronized profile from Supabase by Firebase UID",
      Boolean(retrieved && retrieved.email === "audit.user@adgips.ac.in"),
      `Retrieved user profile: ${retrieved?.email} (${retrieved?.status})`
    );

    // Clean up test user
    await supabaseAdmin.from("users").delete().eq("firebase_uid", testUid);
  } catch (err: any) {
    record("AUTH_SYNC", "Auth Sync Exception", false, err.message);
    await supabaseAdmin.from("users").delete().eq("firebase_uid", testUid);
  }

  // ---------------------------------------------------------------------------
  // SUITE 9: Codebase Architectural Boundary Check
  // ---------------------------------------------------------------------------
  function searchDir(dir: string, regex: RegExp): string[] {
    const matches: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
          matches.push(...searchDir(fullPath, regex));
        }
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (regex.test(content)) {
          matches.push(fullPath);
        }
      }
    }
    return matches;
  }

  const appDir = path.resolve(process.cwd(), "app");
  const compDir = path.resolve(process.cwd(), "components");

  const firestoreImports = [
    ...searchDir(appDir, /from\s+["']@\/lib\/firebase\/firestore["']/),
    ...searchDir(compDir, /from\s+["']@\/lib\/firebase\/firestore["']/),
  ];

  record(
    "ARCHITECTURE",
    "Zero application imports of Cloud Firestore in app/ and components/",
    firestoreImports.length === 0,
    firestoreImports.length === 0
      ? "Clean separation: 0 Firestore references in app/ and components/"
      : `Violations found: ${firestoreImports.join(", ")}`
  );

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("📊 HYBRID ARCHITECTURE TEST SUMMARY");
  console.log("================================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`Total Invariants Evaluated: ${total}`);
  console.log(`Passed:                     ${passed}`);
  console.log(`Failed:                     ${failed}`);

  if (failed > 0) {
    console.error(`\n❌ ${failed} verification checks failed!`);
    process.exit(1);
  } else {
    console.log("\n🎉 ALL SUPABASE POSTGRESQL + FIREBASE AUTH HYBRID INVARIANTS PASSED PERFECTLY!");
    process.exit(0);
  }
}

runHybridVerification().catch((err) => {
  console.error("FATAL VERIFICATION ERROR:", err);
  process.exit(1);
});
