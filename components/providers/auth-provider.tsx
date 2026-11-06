"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import {
  signInWithGoogle,
  loginWithEmailAndPassword,
  signOutUser,
  resetPasswordForEmail,
} from "@/lib/firebase/auth";
import { getUserProfile, createUserProfileIfNew } from "@/lib/firebase/firestore";
import { UserProfile } from "@/types/backend";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasAdminClaim: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyAdminWithServer: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  hasAdminClaim: false,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  refreshProfile: async () => {},
  verifyAdminWithServer: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasAdminClaim, setHasAdminClaim] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfileAndClaims = async (firebaseUser: User) => {
    try {
      // 1. Verify cryptographic custom claims on Firebase ID token
      const tokenResult = await firebaseUser.getIdTokenResult(true);
      const isClaimAdmin =
        tokenResult.claims.role === "admin" ||
        (tokenResult.claims as Record<string, unknown>).admin === true;
      setHasAdminClaim(isClaimAdmin);

      // 2. Fetch or initialize profile
      let p = await getUserProfile(firebaseUser.uid);
      if (!p) {
        p = await createUserProfileIfNew({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      }
      setProfile(p);
    } catch (err) {
      console.error("Failed to load user profile or claims:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfileAndClaims(currentUser);
      } else {
        setProfile(null);
        setHasAdminClaim(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      const { user: u } = await signInWithGoogle();
      setUser(u);
      await fetchProfileAndClaims(u);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: u } = await loginWithEmailAndPassword(email, pass);
      setUser(u);
      await fetchProfileAndClaims(u);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
    setHasAdminClaim(false);
  };

  const handleResetPassword = async (email: string) => {
    await resetPasswordForEmail(email);
  };

  const handleRefreshProfile = async () => {
    if (user) {
      await fetchProfileAndClaims(user);
    }
  };

  const verifyAdminWithServer = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      const token = await auth.currentUser.getIdToken(true);
      const res = await fetch("/api/auth/verify-admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return res.ok && data.authorized === true;
    } catch (err) {
      console.error("Server admin verification call failed:", err);
      return false;
    }
  };

  // Secure authorization: user is admin if token contains custom claim OR trusted firestore profile indicates admin role
  const isAdmin = hasAdminClaim || profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        hasAdminClaim,
        loginWithGoogle: handleLoginWithGoogle,
        loginWithEmail: handleLoginWithEmail,
        logout: handleLogout,
        resetPassword: handleResetPassword,
        refreshProfile: handleRefreshProfile,
        verifyAdminWithServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
