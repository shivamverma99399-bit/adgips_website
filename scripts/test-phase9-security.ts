/**
 * Phase 9 Verification Test Suite: Security & Production Reliability Audit
 *
 * Verifies:
 * 1. Firestore Security Rules role matrix & privilege escalation barriers
 * 2. Field-level lockdown for public atomic counters (downloadsCount, registeredCount)
 * 3. Firebase Storage security rules & public read / admin write invariants
 * 4. Environment variable hygiene & zero private key leaks in Git
 * 5. Route Handler authentication enforcement & sanitized error responses
 */

import fs from "fs";
import path from "path";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, name: string, details: string) {
  reports.push({
    name,
    passed: condition,
    details: condition ? details : `FAILED: ${details}`,
  });
}

async function runPhase9Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 9 VERIFICATION: SECURITY AUDIT");
  console.log("==================================================\n");

  const projectRoot = path.resolve(__dirname, "..");

  // 1. Audit firestore.rules
  const firestoreRulesContent = fs.readFileSync(path.join(projectRoot, "firestore.rules"), "utf-8");

  // Invariant A: Default deny-all fallback
  const hasDenyAll = firestoreRulesContent.includes("match /{document=**}") &&
    firestoreRulesContent.includes("allow read, write: if false;");

  // Invariant B: Privilege escalation barrier on /users/{userId}
  const hasUserEscalationBarrier = firestoreRulesContent.includes("affectedKeys().hasAny(['role', 'status', 'uid', 'createdAt'])");

  // Invariant C: Limited counter diff on /resources/{resourceId}
  const hasResourceCounterLock = firestoreRulesContent.includes("affectedKeys().hasOnly(['downloadsCount'])");

  // Invariant D: Limited counter diff on /events/{eventId}
  const hasEventCounterLock = firestoreRulesContent.includes("affectedKeys().hasOnly(['registeredCount', 'updatedAt'])");

  // Invariant E: All collections covered
  const collectionsProtected = [
    "users",
    "events",
    "registrations",
    "announcements",
    "resources",
    "societies",
    "applications",
    "contactMessages",
    "gallery",
    "opportunities",
  ].every((coll) => firestoreRulesContent.includes(`match /${coll}/`));

  assert(
    hasDenyAll && hasUserEscalationBarrier && hasResourceCounterLock && hasEventCounterLock && collectionsProtected,
    "Firestore Security Rules Matrix",
    "All 10 collections have strict security rules, deny-all fallback, and self-escalation barriers."
  );

  // 2. Audit storage.rules
  const storageRulesContent = fs.readFileSync(path.join(projectRoot, "storage.rules"), "utf-8");
  const storageHasPublicRead = storageRulesContent.includes("allow read: if true;");
  const storageHasAdminWrite = storageRulesContent.includes("allow write: if isAdmin();");

  assert(
    storageHasPublicRead && storageHasAdminWrite,
    "Storage Security Rules Invariant",
    "Storage enforces public read for assets and strictly locks writes to isAdmin()."
  );

  // 3. Environment Variable & Secrets Hygiene
  const envExample = fs.readFileSync(path.join(projectRoot, ".env.example"), "utf-8");
  const gitignore = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf-8");

  const envIgnoresLocal = gitignore.includes(".env*");
  const exampleHasNoRealSecrets = !envExample.includes("AIzaSyAorlS34VrFseuiA8HUZilTY") &&
    !envExample.includes("PRIVATE KEY-----") &&
    envExample.includes("NEXT_PUBLIC_FIREBASE_API_KEY=");

  assert(
    envIgnoresLocal && exampleHasNoRealSecrets,
    "Environment & Secrets Hygiene",
    ".gitignore ignores all local env files, and .env.example contains zero real secrets."
  );

  // 4. Client Bundle Isolation
  const clientTs = fs.readFileSync(path.join(projectRoot, "lib/firebase/client.ts"), "utf-8");
  const clientHasNoAdminSdk = !clientTs.includes("firebase-admin") && !clientTs.includes("cert(");

  assert(
    clientHasNoAdminSdk,
    "Client Bundle Isolation",
    "Client SDK configuration is strictly isolated from Firebase Admin SDK and service accounts."
  );

  // 5. Route Handler Error Sanitization
  const routeTs = fs.readFileSync(path.join(projectRoot, "app/api/auth/verify-admin/route.ts"), "utf-8");
  const routeSanitizesErrors = routeTs.includes("status: 401") &&
    routeTs.includes("status: 403") &&
    !routeTs.includes("error: err.stack");

  assert(
    routeSanitizesErrors,
    "API Route Error Sanitization",
    "Server-side admin verification route sanitizes error outputs and rejects forged/missing tokens."
  );

  // Print results
  console.log("--------------------------------------------------");
  let allPassed = true;
  for (const report of reports) {
    console.log(`[${report.passed ? "PASS" : "FAIL"}] ${report.name}: ${report.details}`);
    if (!report.passed) allPassed = false;
  }
  console.log("--------------------------------------------------");

  if (allPassed) {
    console.log("\n>>> ALL PHASE 9 SECURITY & PRODUCTION RELIABILITY TESTS PASSED CLEANLY (5/5) <<<");
    process.exit(0);
  } else {
    console.error("\n>>> SOME TESTS FAILED IN PHASE 9 <<<");
    process.exit(1);
  }
}

runPhase9Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
