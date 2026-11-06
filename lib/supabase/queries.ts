import { supabase } from "./client";
import type {
  EventDocument,
  OpportunityDocument,
  AcademicResourceDocument,
  AnnouncementDocument,
  GalleryItemDocument,
  RegistrationDocument,
  ContactMessageDocument,
  UserProfile,
} from "@/types/backend";

/**
 * Returns database client.
 * Server environment with SUPABASE_SERVICE_ROLE_KEY uses supabaseAdmin (service_role) to bypass RLS.
 * Browser environment uses the anon client.
 */
async function getDb() {
  if (typeof window === "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { supabaseAdmin } = await import("./server");
    return supabaseAdmin;
  }
  return supabase;
}

/**
 * Client-side fetch helper for secure data reading.
 */
async function fetchContentFromApi(type: string, requireAuth = false): Promise<any[]> {
  try {
    const headers: Record<string, string> = {};
    if (requireAuth && typeof window !== "undefined") {
      try {
        const { auth } = await import("@/lib/firebase/client");
        const token = await auth.currentUser?.getIdToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        console.warn("Could not get Firebase ID token", e);
      }
    }
    const res = await fetch(`/api/content?type=${type}`, { headers });
    const json = await res.json();
    if (!json.success) {
      console.error(`API content error for ${type}:`, json.error);
      return [];
    }
    return json.data || [];
  } catch (err) {
    console.error(`fetchContentFromApi exception for ${type}:`, err);
    return [];
  }
}

/**
 * Dispatches admin mutation to secure Next.js API route verifying Firebase ID token.
 */
async function callAdminMutation(action: "create" | "update" | "delete", table: string, data?: any, id?: string) {
  let token = "";
  if (typeof window !== "undefined") {
    try {
      const { auth } = await import("@/lib/firebase/client");
      token = (await auth.currentUser?.getIdToken()) || "";
    } catch (e) {
      console.warn("Could not retrieve Firebase ID token", e);
    }
  }

  const res = await fetch("/api/admin/mutate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, table, id, data }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Mutation failed");
  }
  return json.data;
}

// ========================================================
// 1. USER PROFILES & SYNCHRONIZATION
// ========================================================

export async function getUserProfileFromSupabase(firebaseUid: string): Promise<UserProfile | null> {
  try {
    const db = await getDb();
    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error || !data) return null;

    return {
      uid: data.firebase_uid,
      name: data.name,
      email: data.email,
      role: data.role as "student" | "admin" | "moderator",
      status: data.status as "active" | "suspended" | "pending",
      photoURL: data.photo_url || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("Error fetching user profile from Supabase:", err);
    return null;
  }
}

export async function syncUserProfileInSupabase(user: {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
}): Promise<UserProfile> {
  try {
    const db = await getDb();
    // 1. Check existing
    const existing = await getUserProfileFromSupabase(user.uid);
    if (existing) {
      return existing;
    }

    // 2. Insert new user profile
    const { data, error } = await db
      .from("users")
      .insert({
        firebase_uid: user.uid,
        name: user.name || "ADGIPS Student",
        email: user.email,
        photo_url: user.photoURL || null,
        role: "student",
        status: "active",
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create Supabase user profile");
    }

    return {
      uid: data.firebase_uid,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      photoURL: data.photo_url || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("Error syncing profile with Supabase:", err);
    throw err;
  }
}

// ========================================================
// 2. EVENTS
// ========================================================

function mapEventRow(row: any): EventDocument {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || undefined,
    description: row.description,
    shortDescription: row.short_description || undefined,
    category: row.category,
    status: row.status,
    date: row.date,
    time: row.time,
    venue: row.venue,
    eligibility: row.eligibility,
    organizedBy: row.organized_by,
    department: row.department || undefined,
    image: row.image_url || "/images/engineering.jpg",
    registrationLink: row.registration_link || undefined,
    registeredCount: row.registered_count || 0,
    tags: row.tags || [],
    activities: row.activities || [],
    highlights: row.highlights || [],
    schedule: row.schedule || [],
    publishedBy: row.published_by || undefined,
    publishedByUid: row.published_by_uid || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getEventsFromSupabase(): Promise<EventDocument[]> {
  try {
    if (typeof window !== "undefined") {
      const data = await fetchContentFromApi("events");
      return (data || []).map(mapEventRow);
    }

    const db = await getDb();
    const { data, error } = await db
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events from Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapEventRow);
  } catch (err) {
    console.error("Supabase events query exception:", err);
    return [];
  }
}

export async function getEventBySlugFromSupabase(slug: string): Promise<EventDocument | null> {
  try {
    const all = await getEventsFromSupabase();
    return all.find((e) => e.slug === slug) || null;
  } catch (err) {
    console.error("Supabase event by slug query exception:", err);
    return null;
  }
}

export async function createEventInSupabase(
  event: Omit<EventDocument, "id" | "createdAt" | "registeredCount"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const id = event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle || null,
    description: event.description,
    short_description: event.shortDescription || null,
    category: event.category,
    status: event.status,
    date: event.date,
    time: event.time,
    venue: event.venue,
    eligibility: event.eligibility,
    organized_by: event.organizedBy,
    department: event.department || null,
    image_url: event.image,
    registration_link: event.registrationLink || null,
    registered_count: 0,
    tags: event.tags || [],
    activities: event.activities || [],
    highlights: event.highlights || [],
    schedule: event.schedule || [],
    published_by: adminInfo?.email || "Administrator",
    published_by_uid: adminInfo?.uid || null,
  };

  if (typeof window !== "undefined") {
    await callAdminMutation("create", "events", record);
    return id;
  }

  const db = await getDb();
  const { error } = await db.from("events").insert(record);
  if (error) throw new Error(error.message);
  return id;
}

export async function updateEventInSupabase(
  id: string,
  updates: Partial<EventDocument>
): Promise<void> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.title !== undefined) payload.title = updates.title;

  if (typeof window !== "undefined") {
    await callAdminMutation("update", "events", payload, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("events").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEventInSupabase(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    await callAdminMutation("delete", "events", undefined, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ========================================================
// 3. OPPORTUNITIES
// ========================================================

function mapOpportunityRow(row: any): OpportunityDocument {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    category: row.category,
    deadline: row.deadline,
    eligibility: row.eligibility,
    location: row.location,
    mode: row.mode,
    applyLink: row.apply_link,
    stipendOrPrize: row.stipend_or_prize || undefined,
    tags: row.tags || [],
    featured: row.featured,
    verifiedExternal: row.verified_external,
    status: row.status,
    publishedBy: row.published_by || undefined,
    publishedByUid: row.published_by_uid || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getOpportunitiesFromSupabase(): Promise<OpportunityDocument[]> {
  try {
    if (typeof window !== "undefined") {
      const data = await fetchContentFromApi("opportunities");
      return (data || []).map(mapOpportunityRow);
    }

    const db = await getDb();
    const { data, error } = await db
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching opportunities from Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapOpportunityRow);
  } catch (err) {
    console.error("Supabase opportunities query exception:", err);
    return [];
  }
}

export async function createOpportunityInSupabase(
  opp: Omit<OpportunityDocument, "id" | "createdAt"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const id = opp.id || `opp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  // Normalize mode to allowed check constraint values ('Online' | 'Offline' | 'Hybrid')
  const validMode =
    opp.mode === "Online" || opp.mode === "Hybrid" ? opp.mode : "Offline";

  const record = {
    id,
    title: opp.title,
    organization: opp.organization,
    category: opp.category,
    deadline: opp.deadline,
    eligibility: opp.eligibility,
    location: opp.location,
    mode: validMode,
    apply_link: opp.applyLink,
    stipend_or_prize: opp.stipendOrPrize || null,
    tags: opp.tags || [],
    featured: opp.featured || false,
    verified_external: opp.verifiedExternal || false,
    status: opp.status || "published",
    published_by: adminInfo?.email || "Administrator",
    published_by_uid: adminInfo?.uid || null,
  };

  if (typeof window !== "undefined") {
    await callAdminMutation("create", "opportunities", record);
    return id;
  }

  const db = await getDb();
  const { error } = await db.from("opportunities").insert(record);
  if (error) throw new Error(error.message);
  return id;
}

export async function updateOpportunityInSupabase(
  id: string,
  updates: Partial<OpportunityDocument>
): Promise<void> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.title !== undefined) payload.title = updates.title;

  if (typeof window !== "undefined") {
    await callAdminMutation("update", "opportunities", payload, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("opportunities").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteOpportunityInSupabase(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    await callAdminMutation("delete", "opportunities", undefined, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("opportunities").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ========================================================
// 4. ACADEMIC RESOURCES
// ========================================================

function mapResourceRow(row: any): AcademicResourceDocument {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    stream: row.stream,
    department: row.department,
    semester: row.semester,
    semesterNumber: row.semester_number,
    type: row.type,
    year: row.year,
    format: row.format,
    fileSize: row.file_size,
    downloadsCount: row.downloads_count || 0,
    description: row.description,
    fileUrl: row.file_url || undefined,
    storagePath: row.storage_path || undefined,
    status: row.status,
    publishedBy: row.published_by || undefined,
    publishedByUid: row.published_by_uid || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getResourcesFromSupabase(): Promise<AcademicResourceDocument[]> {
  try {
    if (typeof window !== "undefined") {
      const data = await fetchContentFromApi("resources");
      return (data || []).map(mapResourceRow);
    }

    const db = await getDb();
    const { data, error } = await db
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resources from Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapResourceRow);
  } catch (err) {
    console.error("Supabase resources query exception:", err);
    return [];
  }
}

export async function getPublishedResourcesFromSupabase(): Promise<AcademicResourceDocument[]> {
  const all = await getResourcesFromSupabase();
  return all.filter((r) => r.status !== "archived" && r.status !== "draft");
}

export async function incrementResourceDownloadCountInSupabase(id: string): Promise<void> {
  try {
    const db = await getDb();
    const { data } = await db.from("resources").select("downloads_count").eq("id", id).maybeSingle();
    const current = (data?.downloads_count || 0) + 1;
    await db.from("resources").update({ downloads_count: current }).eq("id", id);
  } catch (err) {
    console.error("Failed to increment resource download count in Supabase:", err);
  }
}

export async function createResourceInSupabase(
  resource: Omit<AcademicResourceDocument, "id" | "createdAt" | "downloadsCount"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const id = resource.id || `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    code: resource.code,
    title: resource.title,
    stream: resource.stream,
    department: resource.department,
    semester: resource.semester,
    semester_number: resource.semesterNumber,
    type: resource.type,
    year: resource.year || "2026",
    format: resource.format || "PDF",
    file_size: resource.fileSize || "Official PDF",
    downloads_count: 0,
    description: resource.description,
    file_url: resource.fileUrl || null,
    storage_path: resource.storagePath || null,
    status: resource.status || "published",
    published_by: adminInfo?.email || "Administrator",
    published_by_uid: adminInfo?.uid || null,
  };

  if (typeof window !== "undefined") {
    await callAdminMutation("create", "resources", record);
    return id;
  }

  const db = await getDb();
  const { error } = await db.from("resources").insert(record);
  if (error) throw new Error(error.message);
  return id;
}

export async function updateResourceInSupabase(
  id: string,
  updates: Partial<AcademicResourceDocument>
): Promise<void> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.title !== undefined) payload.title = updates.title;

  if (typeof window !== "undefined") {
    await callAdminMutation("update", "resources", payload, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("resources").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteResourceInSupabase(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    await callAdminMutation("delete", "resources", undefined, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ========================================================
// 5. ANNOUNCEMENTS & CIRCULARS
// ========================================================

function mapAnnouncementRow(row: any): AnnouncementDocument {
  return {
    id: row.id,
    refCode: row.ref_code,
    title: row.title,
    category: row.category,
    authority: row.authority,
    date: row.date,
    summary: row.summary,
    details: row.details || undefined,
    fileUrl: row.file_url || undefined,
    storagePath: row.storage_path || undefined,
    priority: row.priority,
    status: row.status,
    expiryDate: row.expiry_date || undefined,
    publishedBy: row.published_by || undefined,
    publishedByUid: row.published_by_uid || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAnnouncementsFromSupabase(): Promise<AnnouncementDocument[]> {
  try {
    if (typeof window !== "undefined") {
      const data = await fetchContentFromApi("announcements");
      return (data || []).map(mapAnnouncementRow);
    }

    const db = await getDb();
    const { data, error } = await db
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements from Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapAnnouncementRow);
  } catch (err) {
    console.error("Supabase announcements query exception:", err);
    return [];
  }
}

export async function getPublishedAnnouncementsFromSupabase(): Promise<AnnouncementDocument[]> {
  const all = await getAnnouncementsFromSupabase();
  return all.filter((a) => a.status !== "archived" && a.status !== "draft");
}

export async function createAnnouncementInSupabase(
  notice: Omit<AnnouncementDocument, "id" | "createdAt"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const id = notice.id || `not_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const validCategory =
    notice.category === "Examination" || notice.category === "Placement"
      ? notice.category
      : "Academic";

  const record = {
    id,
    ref_code: notice.refCode || `CIRC-${Date.now().toString().slice(-4)}`,
    title: notice.title,
    category: validCategory,
    authority: notice.authority || "Administrative Officer",
    date: notice.date,
    summary: notice.summary,
    details: notice.details || null,
    file_url: notice.fileUrl || null,
    storage_path: notice.storagePath || null,
    priority: notice.priority || "Routine",
    status: notice.status || "published",
    expiry_date: notice.expiryDate || null,
    published_by: adminInfo?.email || "Administrator",
    published_by_uid: adminInfo?.uid || null,
  };

  if (typeof window !== "undefined") {
    await callAdminMutation("create", "announcements", record);
    return id;
  }

  const db = await getDb();
  const { error } = await db.from("announcements").insert(record);
  if (error) throw new Error(error.message);
  return id;
}

export async function updateAnnouncementInSupabase(
  id: string,
  updates: Partial<AnnouncementDocument>
): Promise<void> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.title !== undefined) payload.title = updates.title;

  if (typeof window !== "undefined") {
    await callAdminMutation("update", "announcements", payload, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("announcements").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAnnouncementInSupabase(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    await callAdminMutation("delete", "announcements", undefined, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ========================================================
// 6. CAMPUS GALLERY
// ========================================================

function mapGalleryRow(row: any): GalleryItemDocument {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description || undefined,
    imageUrl: row.image_url,
    storagePath: row.storage_path || undefined,
    eventName: row.event_name || undefined,
    date: row.date || undefined,
    location: row.location || undefined,
    tag: row.tag || undefined,
    publishedBy: row.published_by || undefined,
    publishedByUid: row.published_by_uid || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getGalleryFromSupabase(): Promise<GalleryItemDocument[]> {
  try {
    if (typeof window !== "undefined") {
      const data = await fetchContentFromApi("gallery");
      return (data || []).map(mapGalleryRow);
    }

    const db = await getDb();
    const { data, error } = await db
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery from Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapGalleryRow);
  } catch (err) {
    console.error("Supabase gallery query exception:", err);
    return [];
  }
}

export async function createGalleryItemInSupabase(
  item: Omit<GalleryItemDocument, "id" | "createdAt"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const id = item.id || `gal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    title: item.title,
    category: item.category,
    description: item.description || null,
    image_url: item.imageUrl,
    storage_path: item.storagePath || null,
    event_name: item.eventName || null,
    date: item.date || null,
    location: item.location || "ADGIPS Campus, New Delhi",
    tag: item.tag || null,
    published_by: adminInfo?.email || "Administrator",
    published_by_uid: adminInfo?.uid || null,
  };

  if (typeof window !== "undefined") {
    await callAdminMutation("create", "gallery", record);
    return id;
  }

  const db = await getDb();
  const { error } = await db.from("gallery").insert(record);
  if (error) throw new Error(error.message);
  return id;
}

export async function deleteGalleryItemFromSupabase(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    await callAdminMutation("delete", "gallery", undefined, id);
    return;
  }

  const db = await getDb();
  const { error } = await db.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ========================================================
// 7. REGISTRATIONS
// ========================================================

export async function getRegistrationsFromSupabase(): Promise<RegistrationDocument[]> {
  try {
    if (typeof window !== "undefined") {
      const data = await fetchContentFromApi("registrations", true);
      return (data || []).map((row: any) => ({
        id: row.id,
        eventId: row.event_id,
        eventTitle: row.event_title,
        userId: row.user_id,
        userEmail: row.student_email || "",
        studentName: row.student_name,
        studentEmail: row.student_email,
        studentPhone: row.student_phone || undefined,
        enrollmentNo: row.enrollment_no,
        branch: row.branch,
        semester: row.semester,
        status: row.status,
        registeredAt: row.created_at,
        createdAt: row.created_at,
      }));
    }

    const db = await getDb();
    const { data, error } = await db
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching registrations from Supabase:", error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      eventTitle: row.event_title,
      userId: row.user_id,
      userEmail: row.student_email || "",
      studentName: row.student_name,
      studentEmail: row.student_email,
      studentPhone: row.student_phone || undefined,
      enrollmentNo: row.enrollment_no,
      branch: row.branch,
      semester: row.semester,
      status: row.status,
      registeredAt: row.created_at,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("Supabase registrations query exception:", err);
    return [];
  }
}

export async function createRegistrationInSupabase(
  reg: Omit<RegistrationDocument, "id" | "createdAt"> & { id?: string }
): Promise<string> {
  const id = reg.id || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    id,
    eventId: reg.eventId,
    eventTitle: reg.eventTitle,
    userId: reg.userId,
    studentName: reg.studentName,
    studentEmail: reg.studentEmail || reg.userEmail,
    studentPhone: reg.studentPhone || null,
    enrollmentNo: reg.enrollmentNo,
    branch: reg.branch,
    semester: reg.semester,
    status: reg.status || "confirmed",
  };

  if (typeof window !== "undefined") {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Registration failed");
    return json.registrationId || id;
  }

  const db = await getDb();
  const { error } = await db.from("registrations").insert({
    id,
    event_id: reg.eventId,
    event_title: reg.eventTitle,
    user_id: reg.userId,
    student_name: reg.studentName,
    student_email: reg.studentEmail || reg.userEmail,
    student_phone: reg.studentPhone || null,
    enrollment_no: reg.enrollmentNo,
    branch: reg.branch,
    semester: reg.semester,
    status: reg.status || "confirmed",
  });

  if (error) throw new Error(error.message);

  // Increment event registered count in Supabase
  try {
    const { data } = await db.from("events").select("registered_count").eq("id", reg.eventId).maybeSingle();
    const count = (data?.registered_count || 0) + 1;
    await db.from("events").update({ registered_count: count }).eq("id", reg.eventId);
  } catch (err) {
    console.error("Could not increment event registration count in Supabase:", err);
  }

  return id;
}

// ========================================================
// 8. CONTACT INQUIRIES
// ========================================================

export async function createContactMessageInSupabase(
  msg: Omit<ContactMessageDocument, "id" | "createdAt" | "status"> & { id?: string }
): Promise<string> {
  const id = msg.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    id,
    name: msg.name,
    email: msg.email,
    subject: msg.subject || "General Inquiry",
    message: msg.message,
    status: "unread",
  };

  if (typeof window !== "undefined") {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Message submission failed");
    return json.messageId || id;
  }

  const db = await getDb();
  const { error } = await db.from("contact_messages").insert(payload);

  if (error) throw new Error(error.message);
  return id;
}
