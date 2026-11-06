import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Hybrid Authentication: Sync User Profile to Supabase PostgreSQL
 * Verifies Firebase ID Token, checks Supabase users table, auto-provisions
 * profile if new, and returns verified role and profile.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Missing or malformed Authorization header." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Empty token provided." },
        { status: 401 }
      );
    }

    // 1. Verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(token);
    const firebaseUid = decoded.uid;
    const email = decoded.email || "";
    const name = decoded.name || email.split("@")[0] || "ADGIPS Scholar";
    const photoUrl = decoded.picture || null;

    // 2. Query Supabase users table by firebase_uid or email
    let { data: existingUser, error: queryError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (!existingUser && email) {
      const { data: userByEmail } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (userByEmail) {
        existingUser = userByEmail;
        if (userByEmail.firebase_uid !== firebaseUid) {
          await supabaseAdmin
            .from("users")
            .update({ firebase_uid: firebaseUid, photo_url: photoUrl, updated_at: new Date().toISOString() })
            .eq("id", userByEmail.id);
        }
      }
    }

    if (queryError) {
      console.error("Supabase query error:", queryError);
      return NextResponse.json(
        { success: false, error: "Database query failed." },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json({
        success: true,
        user: {
          uid: existingUser.firebase_uid,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          status: existingUser.status,
          photoURL: existingUser.photo_url || undefined,
          createdAt: existingUser.created_at,
          updatedAt: existingUser.updated_at,
        },
      });
    }

    // 3. User does not exist in Supabase yet -> Auto-provision with role 'student'
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        firebase_uid: firebaseUid,
        name,
        email,
        photo_url: photoUrl,
        role: "student",
        status: "active",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase user insertion error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to initialize student profile in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: newUser.firebase_uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        photoURL: newUser.photo_url || undefined,
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at,
      },
    });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    if (error?.code === "auth/id-token-expired") {
      return NextResponse.json(
        { success: false, error: "Session token expired. Please re-authenticate." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Authentication verification failed." },
      { status: 401 }
    );
  }
}
