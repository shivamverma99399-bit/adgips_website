import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || "General Inquiry",
      message: message.trim(),
      status: "unread",
    });

    if (error) {
      console.error("Error inserting contact message in Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: id });
  } catch (err: any) {
    console.error("Contact API route exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit message" },
      { status: 500 }
    );
  }
}
