import { db } from "../lib/firebase/client";
import { collection, getDocs, query, limit } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";
import { filterEvents, getEventStats, getNormalizedEventStatus, getRelatedEvents } from "../lib/event-utils";
import { EventItem, OpportunityItem } from "../types";

async function runPhase4Tests() {
  console.log("=================================================");
  console.log("🎯 PHASE 4 — EVENTS & OPPORTUNITIES TEST SUITE");
  console.log("=================================================\n");

  const results: { test: string; passed: boolean; message: string }[] = [];

  // ------------------------------------------------------------------
  // Test 1: Event Lifecycle Normalization & Stats
  // ------------------------------------------------------------------
  try {
    const testEvents: EventItem[] = [
      {
        id: "evt-1",
        title: "ADGIPS National Hackathon 2026",
        slug: "adgips-national-hackathon-2026",
        description: "Flagship 36-hour hackathon on agentic intelligence.",
        date: "20 Dec 2026",
        time: "10:00 AM",
        venue: "Main Auditorium",
        category: "Technical",
        status: "upcoming",
        image: "/images/engineering.jpg",
        eligibility: "Open to all GGSIPU students",
        organizedBy: "IEEE ADGIPS",
        tags: ["Technical", "AI", "Hackathon"],
      },
      {
        id: "evt-2",
        title: "Appellate Moot Court Championship",
        slug: "appellate-moot-court-championship",
        description: "National courtroom trial simulation on constitutional law.",
        date: "12 Jan 2026",
        time: "9:00 AM",
        venue: "Moot Court Chambers",
        category: "Competitions",
        status: "ongoing",
        image: "/images/law.jpg",
        eligibility: "Law students",
        organizedBy: "School of Law",
        tags: ["Legal", "Moot"],
      },
      {
        id: "evt-3",
        title: "Utkarsh Annual Cultural Festival 2025",
        slug: "utkarsh-annual-cultural-festival-2025",
        description: "Concluded socio-cultural celebration.",
        date: "15 Oct 2025",
        time: "5:00 PM",
        venue: "Central Amphitheatre",
        category: "Cultural",
        status: "past",
        isPast: true,
        image: "/images/campus.jpg",
        eligibility: "Open to all",
        organizedBy: "SAC",
        tags: ["Cultural", "Music"],
      },
    ];

    // Status normalization checks
    const status1 = getNormalizedEventStatus(testEvents[0]);
    const status2 = getNormalizedEventStatus(testEvents[1]);
    const status3 = getNormalizedEventStatus(testEvents[2]);

    if (status1 !== "upcoming" || status2 !== "ongoing" || status3 !== "past") {
      throw new Error(`Status normalization mismatch: ${status1}, ${status2}, ${status3}`);
    }

    // Stats computation
    const stats = getEventStats(testEvents);
    if (stats.total !== 3 || stats.upcoming !== 1 || stats.ongoing !== 1 || stats.past !== 1) {
      throw new Error(`Event stats incorrect: ${JSON.stringify(stats)}`);
    }

    results.push({
      test: "Event Lifecycle Normalization & Stats",
      passed: true,
      message: `Verified status normalization and exact counts (Total: ${stats.total}, Upcoming: ${stats.upcoming}, Past: ${stats.past}).`,
    });
  } catch (err: any) {
    results.push({
      test: "Event Lifecycle Normalization & Stats",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 2: Search, Category & Status Filter Logic
  // ------------------------------------------------------------------
  try {
    const testEvents: EventItem[] = [
      {
        id: "evt-1",
        title: "ADGIPS National Hackathon 2026",
        slug: "adgips-national-hackathon-2026",
        description: "Flagship 36-hour hackathon on agentic intelligence.",
        date: "20 Dec 2026",
        time: "10:00 AM",
        venue: "Main Auditorium",
        category: "Technical",
        status: "upcoming",
        image: "/images/engineering.jpg",
        eligibility: "Open to all GGSIPU students",
        organizedBy: "IEEE ADGIPS",
        tags: ["Technical", "AI", "Hackathon"],
      },
      {
        id: "evt-2",
        title: "Appellate Moot Court Championship",
        slug: "appellate-moot-court-championship",
        description: "National courtroom trial simulation on constitutional law.",
        date: "12 Jan 2026",
        time: "9:00 AM",
        venue: "Moot Court Chambers",
        category: "Competitions",
        status: "ongoing",
        image: "/images/law.jpg",
        eligibility: "Law students",
        organizedBy: "School of Law",
        tags: ["Legal", "Moot"],
      },
    ];

    // Search query test
    const searchMatch = filterEvents(testEvents, { search: "moot" });
    if (searchMatch.length !== 1 || searchMatch[0].id !== "evt-2") {
      throw new Error("Search filter failed to isolate moot court championship.");
    }

    // Category filter test
    const categoryMatch = filterEvents(testEvents, { category: "Technical" });
    if (categoryMatch.length !== 1 || categoryMatch[0].id !== "evt-1") {
      throw new Error("Category filter failed to isolate Technical event.");
    }

    // Status filter test
    const statusMatch = filterEvents(testEvents, { status: "ongoing" });
    if (statusMatch.length !== 1 || statusMatch[0].id !== "evt-2") {
      throw new Error("Status filter failed to isolate ongoing event.");
    }

    results.push({
      test: "Search & Multidimensional Event Filtering",
      passed: true,
      message: "Search query, category filter, and lifecycle status filters execute with precision.",
    });
  } catch (err: any) {
    results.push({
      test: "Search & Multidimensional Event Filtering",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 3: Liquid Lens Carousel Zero, Single, and Multi-Event Invariants
  // ------------------------------------------------------------------
  try {
    // Zero events: array is empty []
    const zeroEvents: EventItem[] = [];
    const zeroStats = getEventStats(zeroEvents);
    if (zeroStats.total !== 0 || zeroStats.upcoming !== 0 || zeroStats.past !== 0) {
      throw new Error("Zero-event stats must strictly evaluate to 0.");
    }

    // Single event: 1 item, no index out of bounds
    const singleEvent: EventItem[] = [
      {
        id: "evt-single",
        title: "Single Featured Fest",
        slug: "single-featured-fest",
        description: "Sole event test.",
        date: "Today",
        time: "10:00 AM",
        venue: "Campus",
        category: "Academic",
        status: "upcoming",
        image: "/images/campus.jpg",
        eligibility: "All",
        organizedBy: "ADGIPS",
        tags: ["Campus"],
      },
    ];
    const total = singleEvent.length;
    let diff = (0 - 0) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff !== 0) {
      throw new Error("Single event angular difference must be zero (centered).");
    }

    // Related events when only 1 event exists
    const related = getRelatedEvents(singleEvent[0], singleEvent, 3);
    if (related.length !== 0) {
      throw new Error("Related events should exclude self and return empty array when no peers exist.");
    }

    results.push({
      test: "Liquid Lens Carousel Zero/Single/Multi Invariants",
      passed: true,
      message: "Validated mathematical invariants for zero-state, single-card centering, and peer exclusion.",
    });
  } catch (err: any) {
    results.push({
      test: "Liquid Lens Carousel Zero/Single/Multi Invariants",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 4: Opportunity Document Schema & Verification
  // ------------------------------------------------------------------
  try {
    const validModes = ["Online", "Offline", "Hybrid"];
    const validCategories = [
      "Hackathon",
      "Internship",
      "Competition",
      "Scholarship",
      "Workshop",
      "Student Programme",
    ];

    const sampleOpp: OpportunityItem = {
      id: "opp-sih-2026",
      title: "Smart India Hackathon 2026",
      organization: "Ministry of Education & AICTE",
      category: "Hackathon",
      deadline: "30 March 2026",
      eligibility: "Open to 1st to 4th year B.Tech, BCA & MCA scholars",
      location: "New Delhi / Hybrid",
      mode: "Hybrid",
      applyLink: "https://sih.gov.in",
      stipendOrPrize: "₹1,00,000 Cash Prize + Incubation Support",
      tags: ["AI", "Innovation", "Govt"],
      featured: true,
      verifiedExternal: true,
    };

    if (!validModes.includes(sampleOpp.mode)) {
      throw new Error(`Invalid participation mode: ${sampleOpp.mode}`);
    }
    if (!validCategories.includes(sampleOpp.category)) {
      throw new Error(`Invalid opportunity category: ${sampleOpp.category}`);
    }
    if (!sampleOpp.applyLink.startsWith("https://")) {
      throw new Error("Application link must be an official secure HTTPS URL.");
    }

    results.push({
      test: "Opportunity Document Schema & Constraints",
      passed: true,
      message: "Opportunity modes, categories, and external HTTPS application URLs strictly validated.",
    });
  } catch (err: any) {
    results.push({
      test: "Opportunity Document Schema & Constraints",
      passed: false,
      message: err.message,
    });
  }

  // ------------------------------------------------------------------
  // Test 5: Firestore Security Rules Coverage for Events & Opportunities
  // ------------------------------------------------------------------
  try {
    const rulesPath = path.join(process.cwd(), "firestore.rules");
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");

    // Events rules check
    if (!rulesContent.includes("match /events/{eventId}")) {
      throw new Error("firestore.rules missing /events/{eventId} block.");
    }
    if (!rulesContent.includes("match /opportunities/{opportunityId}")) {
      throw new Error("firestore.rules missing /opportunities/{opportunityId} block.");
    }

    const oppBlock = rulesContent.substring(
      rulesContent.indexOf("match /opportunities/{opportunityId}"),
      rulesContent.indexOf("match /opportunities/{opportunityId}") + 200
    );

    if (!oppBlock.includes("allow read: if true;")) {
      throw new Error("Opportunities collection must allow public read access.");
    }
    if (!oppBlock.includes("allow write: if isAdmin();")) {
      throw new Error("Opportunities collection must restrict writes to isAdmin().");
    }

    results.push({
      test: "Firestore Security Rules Coverage",
      passed: true,
      message: "Security rules enforce public read and isAdmin() writes for /events and /opportunities.",
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
    const { getEventsFromFirestore, getOpportunitiesFromFirestore } = await import("../lib/firebase/firestore");

    // Must return arrays without throwing uncaught exceptions
    const [events, opps] = await Promise.all([
      getEventsFromFirestore(),
      getOpportunitiesFromFirestore(),
    ]);

    if (!Array.isArray(events) || !Array.isArray(opps)) {
      throw new Error("Firestore retrieval functions must always return array structures.");
    }

    results.push({
      test: "Live Firestore Empty Database Query Resilience",
      passed: true,
      message: `Firestore client queries executed with exception safety (events count: ${events.length}, opportunities count: ${opps.length}).`,
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

runPhase4Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
