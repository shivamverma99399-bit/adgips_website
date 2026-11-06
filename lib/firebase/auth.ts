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
import { createUserProfileIfNew, getUserProfile } from "./firestore";
import { UserProfile } from "@/types/backend";

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
 */
export async function signInWithGoogle(): Promise<{
  user: User;
  profile: UserProfile;
}> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await createUserProfileIfNew({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      photoURL: cred.user.photoURL,
    });
    return { user: cred.user, profile };
  } catch (error: any) {
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user"
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
): Promise<{ user: User; profile: UserProfile }> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  let profile = await getUserProfile(cred.user.uid);
  if (!profile) {
    profile = await createUserProfileIfNew({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      photoURL: cred.user.photoURL,
    });
  }
  return { user: cred.user, profile };
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmailAndPassword(
  email: string,
  pass: string,
  name?: string
): Promise<{ user: User; profile: UserProfile }> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const profile = await createUserProfileIfNew({
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: name || cred.user.displayName,
    photoURL: cred.user.photoURL,
  });
  return { user: cred.user, profile };
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
