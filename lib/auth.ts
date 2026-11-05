export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  enrollmentNo: string;
  programme: string;
  department: string;
  semester: number;
  batch: string;
  avatar?: string;
  cgpa: number;
  attendancePercent: number;
  creditsEarned: number;
  totalCredits: number;
  role: "student" | "admin";
  registeredEvents: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    venue: string;
    registrationDate: string;
    status: "confirmed" | "waitlist";
  }>;
  clubMemberships: Array<{
    clubName: string;
    role: string;
    joinedDate: string;
    category: string;
  }>;
  downloadedResources: Array<{
    code: string;
    title: string;
    downloadedAt: string;
    type: string;
  }>;
  subjectAttendance: Array<{
    code: string;
    subject: string;
    attended: number;
    total: number;
    percentage: number;
    status: "good" | "warning" | "danger";
  }>;
}

export const DEFAULT_STUDENT: StudentProfile = {
  id: "std-04215602722",
  name: "Aryan Sharma",
  email: "aryan.sharma@gmail.com",
  enrollmentNo: "04215602722",
  programme: "B.Tech in Artificial Intelligence & Machine Learning",
  department: "Department of AI & Data Science",
  semester: 6,
  batch: "2023 – 2027",
  cgpa: 8.92,
  attendancePercent: 86.4,
  creditsEarned: 114,
  totalCredits: 152,
  role: "student",
  registeredEvents: [
    {
      id: "utkarsh-fest",
      title: "Utkarsh 2026 — Annual Cultural Fest",
      category: "Cultural",
      date: "14 & 15 November 2026",
      venue: "Main Auditorium & Open Air Theatre (OAT)",
      registrationDate: "02 Nov 2026",
      status: "confirmed",
    },
    {
      id: "industry-ai-summit",
      title: "Generative AI & Agentic Systems Seminar",
      category: "Seminars",
      date: "18 November 2026",
      venue: "Seminar Hall 1, Block 2",
      registrationDate: "28 Oct 2026",
      status: "confirmed",
    },
  ],
  clubMemberships: [
    {
      clubName: "IEEE Student Branch — ADGIPS",
      role: "Technical Lead",
      joinedDate: "Aug 2024",
      category: "Technical",
    },
    {
      clubName: "Developer & Algorithmic Coding Guild",
      role: "Core Member",
      joinedDate: "Feb 2024",
      category: "Technical",
    },
  ],
  downloadedResources: [
    {
      code: "ETAIDS-304",
      title: "Artificial Neural Networks & Deep Learning Syllabus & Scheme",
      downloadedAt: "Yesterday at 4:15 PM",
      type: "Syllabus Scheme",
    },
    {
      code: "ETCS-302",
      title: "Data Mining & Business Intelligence End-Term PYQ (2025)",
      downloadedAt: "03 Nov 2026",
      type: "Previous Year Paper",
    },
  ],
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
};

const SESSION_KEY = "adgips_active_session";

export function getStoredSession(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("adgips_session_change"));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("adgips_session_change"));
}

export function registerStudentForEvent(eventItem: {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
}): boolean {
  const session = getStoredSession() || DEFAULT_STUDENT;
  const exists = session.registeredEvents.some((e) => e.id === eventItem.id);
  if (!exists) {
    session.registeredEvents.unshift({
      id: eventItem.id,
      title: eventItem.title,
      category: eventItem.category,
      date: eventItem.date,
      venue: eventItem.venue,
      registrationDate: "Just now",
      status: "confirmed",
    });
    saveSession(session);
  }
  return true;
}

export function applyStudentForClub(clubName: string, category: string, role: string): boolean {
  const session = getStoredSession() || DEFAULT_STUDENT;
  const exists = session.clubMemberships.some((c) => c.clubName === clubName);
  if (!exists) {
    session.clubMemberships.unshift({
      clubName,
      role,
      joinedDate: "Applied Today",
      category,
    });
    saveSession(session);
  }
  return true;
}

export function recordDownloadedResource(code: string, title: string, type: string): void {
  const session = getStoredSession() || DEFAULT_STUDENT;
  session.downloadedResources.unshift({
    code,
    title,
    downloadedAt: "Just now",
    type,
  });
  saveSession(session);
}
