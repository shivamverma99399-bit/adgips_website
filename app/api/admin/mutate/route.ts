import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

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

    // 1. Cryptographically verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(token);
    const firebaseUid = decoded.uid;

    // 2. Query Supabase users table to verify user is an active Administrator
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from("users")
      .select("role, status, email")
      .or(`firebase_uid.eq.${firebaseUid},email.eq.${decoded.email?.toLowerCase()}`)
      .maybeSingle();

    if (userError || !userProfile) {
      return NextResponse.json(
        { success: false, error: "User identity record not found in Supabase." },
        { status: 403 }
      );
    }

    // Check custom claims fallback or Supabase role
    const isAdmin = userProfile.role === "admin" || decoded.role === "admin";
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrative privileges required." },
        { status: 403 }
      );
    }

    if (userProfile.status === "suspended") {
      return NextResponse.json(
        { success: false, error: "Account is suspended." },
        { status: 403 }
      );
    }

    // 3. Parse action and payload
    const body = await req.json();
    const { action, table, id, data } = body;

    if (!action || !table) {
      return NextResponse.json(
        { success: false, error: "Missing action or table parameters." },
        { status: 400 }
      );
    }

    // Allowed tables for admin mutations
    const allowedTables = ["events", "opportunities", "resources", "announcements", "gallery"];
    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { success: false, error: `Unauthorized table mutation: ${table}` },
        { status: 400 }
      );
    }

    // 4. Execute operation via supabaseAdmin (service_role)
    if (action === "create") {
      const record = {
        ...data,
        published_by: userProfile.email || decoded.email || "Administrator",
        published_by_uid: firebaseUid,
      };
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from(table)
        .insert(record)
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: inserted });
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID required for update" }, { status: 400 });
      }
      const { data: updated, error: updateError } = await supabaseAdmin
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID required for delete" }, { status: 400 });
      }
      const { error: deleteError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("id", id);

      if (deleteError) {
        return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, deletedId: id });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("Admin mutation API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
