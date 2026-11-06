import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  User,
} from "firebase/auth";
import { auth } from "./client";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Configure local session persistence
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error("Auth persistence setup error:", err);
  });
}

/**
 * Sign in with Google (OAuth popup with redirect fallback)
 * Exclusively handles identity; profile sync is handled via Supabase PostgreSQL.
 */
export async function signInWithGoogle(): Promise<{ user: User }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return { user: cred.user };
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (
      err.code === "auth/popup-blocked" ||
      err.code === "auth/popup-closed-by-user"
    ) {
      // Fallback to redirect if popup is blocked
      await signInWithRedirect(auth, googleProvider);
      throw error;
    }
    throw error;
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmailAndPassword(
  email: string,
  pass: string
): Promise<{ user: User }> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return { user: cred.user };
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmailAndPassword(
  email: string,
  pass: string
): Promise<{ user: User }> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  return { user: cred.user };
}

/**
 * Send Password Reset Email
 */
export async function resetPasswordForEmail(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
