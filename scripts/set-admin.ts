/**
 * Institutional Admin Promotion Script (Server / CLI only)
 * Usage:
 *   FIREBASE_ADMIN_PROJECT_ID=adgips-website npx ts-node scripts/set-admin.ts <user-email-or-uid> <role>
 */

import { adminAuth, adminDb } from "../lib/firebase/admin";

async function setRole(identifier: string, role: "admin" | "student" | "society_member" | "moderator") {
  if (!identifier) {
    console.error("Please provide a user UID or email.");
    process.exit(1);
  }

  try {
    let userRecord;
    if (identifier.includes("@")) {
      userRecord = await adminAuth.getUserByEmail(identifier);
    } else {
      userRecord = await adminAuth.getUser(identifier);
    }

    // 1. Set Custom Claims for cryptographic token verification
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // 2. Set Firestore role in trusted users collection
    await adminDb.collection("users").doc(userRecord.uid).set(
      {
        role,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log(`✅ Success: User ${userRecord.email} (${userRecord.uid}) has been granted role "${role}".`);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("❌ Failed to update user role:", error.message);
    process.exit(1);
  }
}

const targetUser = process.argv[2];
const roleArg = (process.argv[3] as "admin" | "student" | "society_member" | "moderator") || "admin";
setRole(targetUser, roleArg);
