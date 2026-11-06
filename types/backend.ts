import { EventCategory, EventStatus, EventActivity, EventScheduleItem, OpportunityCategory } from "./index";

export type UserRole = "student" | "society_member" | "moderator" | "admin";
export type UserStatus = "active" | "suspended";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  role: UserRole;
  status: UserStatus;
  enrollmentNo?: string;
  programme?: string;
  department?: string;
  semester?: number;
  batch?: string;
  cgpa?: number;
  attendancePercent?: number;
  creditsEarned?: number;
  totalCredits?: number;
  registeredEvents?: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    venue: string;
    registrationDate: string;
    status: "confirmed" | "waitlist";
  }>;
  clubMemberships?: Array<{
    clubName: string;
    role: string;
    joinedDate: string;
    category: string;
  }>;
  downloadedResources?: Array<{
    code: string;
    title: string;
    downloadedAt: string;
    type: string;
  }>;
  subjectAttendance?: Array<{
    code: string;
    subject: string;
    attended: number;
    total: number;
    percentage: number;
    status: "good" | "warning" | "danger";
  }>;
  createdAt?: any;
  updatedAt?: any;
}

export interface EventDocument {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  status: EventStatus;
  image: string;
  featured?: boolean;
  registrationLink?: string;
  eligibility: string;
  organizedBy: string;
  department?: string;
  tags: string[];
  activities?: EventActivity[];
  highlights?: string[];
  schedule?: EventScheduleItem[];
  capacity?: number;
  registeredCount?: number;
  storagePath?: string;
  publishedBy?: string;
  publishedByUid?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface RegistrationDocument {
  id: string; // deterministic: `${eventId}_${userId}`
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  eventVenue: string;
  userId: string;
  userEmail: string;
  studentName: string;
  enrollmentNo: string;
  semester?: string;
  branch?: string;
  status: "confirmed" | "waitlist" | "cancelled";
  registeredAt: any;
}

export interface AnnouncementDocument {
  id: string;
  title: string;
  category: "Academic" | "Examination" | "Placement" | "Events" | "Administrative";
  date: string;
  expiryDate?: string;
  isUrgent?: boolean;
  isDemo?: boolean;
  summary: string;
  details?: string;
  fileSize?: string;
  fileUrl?: string;
  storagePath?: string;
  status?: "published" | "archived" | "draft";
  publishedBy?: string;
  publishedByUid?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface AcademicResourceDocument {
  id: string;
  code: string;
  title: string;
  stream: "Engineering" | "Law" | "Management";
  department: string;
  semester: string;
  semesterNumber: number;
  type: "Syllabus Scheme" | "Previous Year Paper" | "Lab Manual" | "Lecture Notes";
  year: string;
  format: "PDF" | "DOCX";
  fileSize: string;
  downloadsCount: number;
  description: string;
  fileUrl?: string;
  storagePath?: string;
  status?: "published" | "archived" | "draft";
  publishedBy?: string;
  publishedByUid?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface SocietyDocument {
  id: string;
  name: string;
  category: "Technical" | "Legal" | "Cultural" | "Sports" | "Management";
  leads: string;
  description: string;
  badge: string;
  members: string;
  activities: string[];
  createdAt?: any;
}

export interface ApplicationDocument {
  id: string; // deterministic: `${societyId}_${userId}`
  societyId: string;
  societyName: string;
  societyCategory: string;
  userId: string;
  userEmail: string;
  studentName: string;
  enrollmentNo: string;
  preferredRole: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
  reviewedAt?: any;
}

export interface ContactMessageDocument {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "reviewed" | "archived";
  createdAt: any;
}

export interface OpportunityDocument {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  deadline: string;
  eligibility: string;
  location: string;
  mode: "Online" | "Offline" | "Hybrid";
  applyLink: string;
  stipendOrPrize?: string;
  tags: string[];
  featured?: boolean;
  verifiedExternal?: boolean;
  status?: "published" | "archived" | "draft";
  publishedBy?: string;
  publishedByUid?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface GalleryItemDocument {
  id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl: string;
  storagePath?: string;
  eventName?: string;
  date?: string;
  location?: string;
  tag?: string;
  publishedBy?: string;
  publishedByUid?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
