import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
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
    role: "student", // Default role is strictly student
    status: "active",
    enrollmentNo: "04215602722",
    programme: "B.Tech in Artificial Intelligence & Machine Learning",
    department: "Department of AI & Data Science",
    semester: 6,
    batch: "2023 – 2027",
    cgpa: 8.92,
    attendancePercent: 86.4,
    creditsEarned: 114,
    totalCredits: 152,
    registeredEvents: [],
    clubMemberships: [],
    downloadedResources: [],
    subjectAttendance: [
      {
        code: "ETCS-302",
        subject: "Data Mining & Business Intelligence",
        attended: 23,
        total: 25,
        percentage: 92,
        status: "good",
      },
      {
        code: "ETAIDS-304",
        subject: "Artificial Neural Networks & Deep Learning",
        attended: 21,
        total: 25,
        percentage: 84,
        status: "good",
      },
      {
        code: "ETIT-306",
        subject: "Cloud Computing & Microservices Architecture",
        attended: 22,
        total: 25,
        percentage: 88,
        status: "good",
      },
      {
        code: "HVPE-102",
        subject: "Universal Human Values & Professional Ethics",
        attended: 19,
        total: 25,
        percentage: 76,
        status: "warning",
      },
    ],
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
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EventDocument[];
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
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
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AnnouncementDocument[];
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

// ==========================================
// 4. ACADEMIC RESOURCES
// ==========================================

export async function getResourcesFromFirestore(): Promise<AcademicResourceDocument[]> {
  try {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AcademicResourceDocument[];
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
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
// 5. APPLICATIONS (CLUBS & SOCIETIES)
// ==========================================

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
