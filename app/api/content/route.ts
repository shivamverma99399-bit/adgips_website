import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ success: false, error: "Missing type parameter" }, { status: 400 });
    }

    if (type === "events") {
      const { data, error } = await supabaseAdmin
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    if (type === "opportunities") {
      const { data, error } = await supabaseAdmin
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    if (type === "resources") {
      const { data, error } = await supabaseAdmin
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    if (type === "announcements") {
      const { data, error } = await supabaseAdmin
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    if (type === "gallery") {
      const { data, error } = await supabaseAdmin
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    if (type === "registrations") {
      // Registrations contain student info -> enforce admin verification
      const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const token = authHeader.substring(7).trim();
      const decoded = await adminAuth.verifyIdToken(token);
      const { data: userProfile } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("firebase_uid", decoded.uid)
        .maybeSingle();

      if (userProfile?.role !== "admin" && decoded.role !== "admin") {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }

      const { data, error } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data: data || [] });
    }

    return NextResponse.json({ success: false, error: `Invalid content type: ${type}` }, { status: 400 });
  } catch (err: any) {
    console.error("Content API route error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
