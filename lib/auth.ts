/**
 * Authentication Types & Utilities
 * Replaces simulated localStorage sessions with production Firebase Authentication contracts.
 */

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  enrollmentNo?: string;
  programme?: string;
  department?: string;
  role: "student" | "admin";
}

export function getStoredSession(): null {
  return null;
}
