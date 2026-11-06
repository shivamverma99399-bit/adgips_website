import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "./client";
import {
  UserProfile,
  EventDocument,
  RegistrationDocument,
  AnnouncementDocument,
  AcademicResourceDocument,
  SocietyDocument,
  ApplicationDocument,
  ContactMessageDocument,
  OpportunityDocument,
} from "@/types/backend";

// ==========================================
// 1. USER PROFILES
// ==========================================

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function createUserProfileIfNew(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<UserProfile> {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  // Derive initial friendly name from email or displayName
  const fallbackName = user.email
    ? user.email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Student Scholar";

  const newProfile: UserProfile = {
    uid: user.uid,
    name: user.displayName || fallbackName,
    email: user.email || "",
    photoURL: user.photoURL || null,
    role: "student",
    status: "active",
    registeredEvents: [],
    clubMemberships: [],
    downloadedResources: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

export async function updateUserProfile(
  uid: string,
  allowedData: Partial<
    Pick<
      UserProfile,
      | "name"
      | "enrollmentNo"
      | "programme"
      | "department"
      | "semester"
      | "batch"
      | "photoURL"
    >
  >
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...allowedData,
    updatedAt: serverTimestamp(),
  });
}

// ==========================================
// 2. EVENTS & REGISTRATIONS
// ==========================================

export async function getEventsFromFirestore(): Promise<EventDocument[]> {
  try {
    const snap = await getDocs(collection(db, "events"));
    const events = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EventDocument[];

    return events.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}

export async function getEventBySlugFromFirestore(slug: string): Promise<EventDocument | null> {
  try {
    // 1. Direct match by slug
    const qSlug = query(collection(db, "events"), where("slug", "==", slug), limit(1));
    const snapSlug = await getDocs(qSlug);
    if (!snapSlug.empty) {
      const d = snapSlug.docs[0];
      return { id: d.id, ...d.data() } as EventDocument;
    }

    // 2. Fallback: match by document ID
    const docRef = doc(db, "events", slug);
    const snapDoc = await getDoc(docRef);
    if (snapDoc.exists()) {
      return { id: snapDoc.id, ...snapDoc.data() } as EventDocument;
    }

    // 3. Fallback: scan all events for slug or id match (in case of URL encoding / normalization)
    const allEvents = await getEventsFromFirestore();
    const found = allEvents.find(
      (e) =>
        e.slug === slug ||
        e.id === slug ||
        e.slug === decodeURIComponent(slug)
    );
    return found || null;
  } catch (error) {
    console.error(`Error fetching event by slug "${slug}":`, error);
    return null;
  }
}

export async function registerForEventInFirestore(
  event: {
    id: string;
    title: string;
    category: string;
    date: string;
    venue: string;
  },
  user: {
    uid: string;
    email: string;
    name: string;
    enrollmentNo?: string;
    semester?: string;
    branch?: string;
  }
): Promise<{ success: boolean; message: string }> {
  const registrationId = `${event.id}_${user.uid}`;
  const regRef = doc(db, "registrations", registrationId);
  const userRef = doc(db, "users", user.uid);
  const eventRef = doc(db, "events", event.id);

  try {
    await runTransaction(db, async (tx) => {
      const regSnap = await tx.get(regRef);
      if (regSnap.exists()) {
        throw new Error("Already registered for this event.");
      }

      const newRegistration: RegistrationDocument = {
        id: registrationId,
        eventId: event.id,
        eventTitle: event.title,
        eventCategory: event.category,
        eventDate: event.date,
        eventVenue: event.venue,
        userId: user.uid,
        userEmail: user.email,
        studentName: user.name,
        enrollmentNo: user.enrollmentNo || "N/A",
        semester: user.semester || "Current",
        branch: user.branch || "General",
        status: "confirmed",
        registeredAt: serverTimestamp(),
      };

      tx.set(regRef, newRegistration);

      // Increment registered count on event if document exists
      const eventSnap = await tx.get(eventRef);
      if (eventSnap.exists()) {
        tx.update(eventRef, {
          registeredCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      }

      // Update user document registeredEvents array
      const userSnap = await tx.get(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        const currentRegistered = userData.registeredEvents || [];
        const alreadyInList = currentRegistered.some((r) => r.id === event.id);
        if (!alreadyInList) {
          tx.update(userRef, {
            registeredEvents: [
              {
                id: event.id,
                title: event.title,
                category: event.category,
                date: event.date,
                venue: event.venue,
                registrationDate: new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                status: "confirmed",
              },
              ...currentRegistered,
            ],
            updatedAt: serverTimestamp(),
          });
        }
      }
    });

    return { success: true, message: "Registration successful!" };
  } catch (err: any) {
    return { success: false, message: err.message || "Registration failed." };
  }
}

// ==========================================
// 3. ANNOUNCEMENTS
// ==========================================

export async function getAnnouncementsFromFirestore(): Promise<AnnouncementDocument[]> {
  try {
    const snap = await getDocs(collection(db, "announcements"));
    const notices = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AnnouncementDocument[];
    return notices.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export async function getPublishedAnnouncementsFromFirestore(): Promise<AnnouncementDocument[]> {
  const all = await getAnnouncementsFromFirestore();
  return all.filter((a) => a.status !== "archived" && a.status !== "draft");
}

// ==========================================
// 4. ACADEMIC RESOURCES
// ==========================================

export async function getResourcesFromFirestore(): Promise<AcademicResourceDocument[]> {
  try {
    const snap = await getDocs(collection(db, "resources"));
    const resources = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AcademicResourceDocument[];
    return resources.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

export async function getPublishedResourcesFromFirestore(): Promise<AcademicResourceDocument[]> {
  const all = await getResourcesFromFirestore();
  return all.filter((r) => r.status !== "archived" && r.status !== "draft");
}

export async function incrementResourceDownloadCount(resourceId: string): Promise<void> {
  try {
    const resRef = doc(db, "resources", resourceId);
    await updateDoc(resRef, {
      downloadsCount: increment(1),
    });
  } catch (error) {
    console.error("Failed to increment resource download count:", error);
  }
}

// ==========================================
// 6. CMS CONTENT MANAGEMENT (EVENTS, RESOURCES, NOTICES, GALLERY)
// ==========================================

// --- Academic Resources ---
export async function createAcademicResourceInFirestore(
  resource: Omit<AcademicResourceDocument, "id" | "createdAt" | "downloadsCount"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const resourceId = resource.id || `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const resRef = doc(db, "resources", resourceId);

  await setDoc(resRef, {
    ...resource,
    id: resourceId,
    downloadsCount: 0,
    status: resource.status || "published",
    publishedBy: adminInfo?.email || "Administrator",
    publishedByUid: adminInfo?.uid || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return resourceId;
}

export async function updateAcademicResourceInFirestore(
  id: string,
  updates: Partial<AcademicResourceDocument>
): Promise<void> {
  const resRef = doc(db, "resources", id);
  await updateDoc(resRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAcademicResourceFromFirestore(id: string): Promise<void> {
  const resRef = doc(db, "resources", id);
  await deleteDoc(resRef);
}

// --- Events ---
export async function createEventInFirestore(
  event: Omit<EventDocument, "id" | "createdAt" | "registeredCount"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const eventId = event.id || `event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const eventRef = doc(db, "events", eventId);

  await setDoc(eventRef, {
    ...event,
    id: eventId,
    registeredCount: 0,
    publishedBy: adminInfo?.email || "Administrator",
    publishedByUid: adminInfo?.uid || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return eventId;
}

export async function updateEventInFirestore(
  id: string,
  updates: Partial<EventDocument>
): Promise<void> {
  const eventRef = doc(db, "events", id);
  await updateDoc(eventRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEventFromFirestore(id: string): Promise<void> {
  const eventRef = doc(db, "events", id);
  await deleteDoc(eventRef);
}

// --- Announcements / Circulars ---
export async function createAnnouncementInFirestore(
  announcement: Omit<AnnouncementDocument, "id" | "createdAt"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const noticeId = announcement.id || `notice_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const noticeRef = doc(db, "announcements", noticeId);

  await setDoc(noticeRef, {
    ...announcement,
    id: noticeId,
    status: announcement.status || "published",
    publishedBy: adminInfo?.email || "Administrator",
    publishedByUid: adminInfo?.uid || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return noticeId;
}

export async function updateAnnouncementInFirestore(
  id: string,
  updates: Partial<AnnouncementDocument>
): Promise<void> {
  const noticeRef = doc(db, "announcements", id);
  await updateDoc(noticeRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAnnouncementFromFirestore(id: string): Promise<void> {
  const noticeRef = doc(db, "announcements", id);
  await deleteDoc(noticeRef);
}

// --- Campus Photo Gallery ---
export interface GalleryItemDocument {
  id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl: string;
  storagePath?: string;
  eventName?: string;
  date?: string;
  publishedBy?: string;
  publishedByUid?: string | null;
  createdAt?: any;
}

export async function getGalleryFromFirestore(): Promise<GalleryItemDocument[]> {
  try {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryItemDocument[];
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

export async function createGalleryItemInFirestore(
  item: Omit<GalleryItemDocument, "id" | "createdAt"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const galleryId = item.id || `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const galleryRef = doc(db, "gallery", galleryId);

  await setDoc(galleryRef, {
    ...item,
    id: galleryId,
    publishedBy: adminInfo?.email || "Administrator",
    publishedByUid: adminInfo?.uid || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return galleryId;
}

export async function deleteGalleryItemFromFirestore(id: string): Promise<void> {
  const galleryRef = doc(db, "gallery", id);
  await deleteDoc(galleryRef);
}

// --- Opportunities & Hackathons ---
export async function getOpportunitiesFromFirestore(): Promise<OpportunityDocument[]> {
  try {
    const snap = await getDocs(collection(db, "opportunities"));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as OpportunityDocument[];
    return items.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching opportunities from Firestore:", error);
    return [];
  }
}

export async function createOpportunityInFirestore(
  opp: Omit<OpportunityDocument, "id" | "createdAt"> & { id?: string },
  adminInfo?: { uid?: string; email?: string }
): Promise<string> {
  const oppId = opp.id || `opp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const oppRef = doc(db, "opportunities", oppId);

  await setDoc(oppRef, {
    ...opp,
    id: oppId,
    status: opp.status || "published",
    publishedBy: adminInfo?.email || "Administrator",
    publishedByUid: adminInfo?.uid || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return oppId;
}

export async function updateOpportunityInFirestore(
  id: string,
  updates: Partial<OpportunityDocument>
): Promise<void> {
  const oppRef = doc(db, "opportunities", id);
  await updateDoc(oppRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOpportunityFromFirestore(id: string): Promise<void> {
  const oppRef = doc(db, "opportunities", id);
  await deleteDoc(oppRef);
}


export async function applyForSocietyInFirestore(
  society: { id: string; name: string; category: string },
  user: { uid: string; email: string; name: string; enrollmentNo?: string },
  preferredRole: string
): Promise<{ success: boolean; message: string }> {
  const applicationId = `${society.id}_${user.uid}`;
  const appRef = doc(db, "applications", applicationId);
  const userRef = doc(db, "users", user.uid);

  try {
    const appSnap = await getDoc(appRef);
    if (appSnap.exists()) {
      return { success: false, message: "You have already applied for this society." };
    }

    const newApp: ApplicationDocument = {
      id: applicationId,
      societyId: society.id,
      societyName: society.name,
      societyCategory: society.category,
      userId: user.uid,
      userEmail: user.email,
      studentName: user.name,
      enrollmentNo: user.enrollmentNo || "N/A",
      preferredRole,
      status: "pending",
      submittedAt: serverTimestamp(),
    };

    await setDoc(appRef, newApp);

    // Update user profile membership list (marked pending)
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const currentClubs = userData.clubMemberships || [];
      const alreadyHas = currentClubs.some((c) => c.clubName === society.name);
      if (!alreadyHas) {
        await updateDoc(userRef, {
          clubMemberships: [
            {
              clubName: society.name,
              role: `${preferredRole} (Applicant)`,
              joinedDate: "Applied Today",
              category: society.category,
            },
            ...currentClubs,
          ],
          updatedAt: serverTimestamp(),
        });
      }
    }

    return { success: true, message: "Application submitted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to submit application." };
  }
}
