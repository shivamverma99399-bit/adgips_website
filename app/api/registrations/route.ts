import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      eventId,
      eventTitle,
      userId,
      studentName,
      studentEmail,
      studentPhone,
      enrollmentNo,
      branch,
      semester,
      status,
    } = body;

    if (!eventId || !studentName || !enrollmentNo || !studentEmail) {
      return NextResponse.json(
        { success: false, error: "Event ID, Student Name, Email, and Enrollment No are mandatory." },
        { status: 400 }
      );
    }

    const regId = id || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Insert into Supabase registrations using supabaseAdmin (service_role)
    const { error: insertError } = await supabaseAdmin.from("registrations").insert({
      id: regId,
      event_id: eventId,
      event_title: eventTitle || "Campus Event",
      user_id: userId || `guest_${Date.now()}`,
      student_name: studentName.trim(),
      student_email: studentEmail.trim().toLowerCase(),
      student_phone: studentPhone?.trim() || null,
      enrollment_no: enrollmentNo.trim().toUpperCase(),
      branch: branch || "Engineering",
      semester: semester || "1",
      status: status || "confirmed",
    });

    if (insertError) {
      console.error("Registration insert error in Supabase:", insertError);
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    // Atomically increment registered count on event record
    try {
      const { data: evt } = await supabaseAdmin
        .from("events")
        .select("registered_count")
        .eq("id", eventId)
        .maybeSingle();

      const newCount = (evt?.registered_count || 0) + 1;
      await supabaseAdmin.from("events").update({ registered_count: newCount }).eq("id", eventId);
    } catch (countErr) {
      console.error("Count increment error:", countErr);
    }

    return NextResponse.json({ success: true, registrationId: regId });
  } catch (err: any) {
    console.error("Registration route exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process registration" },
      { status: 500 }
    );
  }
}
