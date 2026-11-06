import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/**
 * Server-Side Administrator Authorization Verification
 * Uses Firebase Admin SDK to cryptographically verify ID token and administrative claims.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { authorized: false, error: "Missing or malformed Authorization header." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return NextResponse.json(
        { authorized: false, error: "Empty bearer token." },
        { status: 401 }
      );
    }

    // Cryptographic verification via Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    // 1. Check Custom Claims on JWT
    const hasAdminClaim =
      decoded.role === "admin" || (decoded as Record<string, unknown>).admin === true;

    // 2. Check Firestore /users/{uid} document as secondary trusted server authority
    let hasAdminDoc = false;
    if (!hasAdminClaim) {
      const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
      if (userSnap.exists && userSnap.data()?.role === "admin") {
        hasAdminDoc = true;
      }
    }

    const isAuthorizedAdmin = hasAdminClaim || hasAdminDoc;

    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        {
          authorized: false,
          error: "Access Denied: Account lacks administrative privileges.",
          uid: decoded.uid,
          email: decoded.email,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        authorized: true,
        role: "admin",
        uid: decoded.uid,
        email: decoded.email,
        verifiedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error("Token verification error:", err);

    if (err.code === "auth/id-token-expired") {
      return NextResponse.json(
        { authorized: false, error: "Administrative session token has expired. Please re-authenticate." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authorized: false, error: "Invalid or forged cryptographic token." },
      { status: 401 }
    );
  }
}
