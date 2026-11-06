"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import {
  signInWithGoogle,
  loginWithEmailAndPassword,
  signUpWithEmailAndPassword,
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
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (firebaseUser: User) => {
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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetchProfile(currentUser);
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      const { user: u, profile: p } = await signInWithGoogle();
      setUser(u);
      setProfile(p);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: u, profile: p } = await loginWithEmailAndPassword(email, pass);
      setUser(u);
      setProfile(p);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupWithEmail = async (email: string, pass: string, name?: string) => {
    setLoading(true);
    try {
      const { user: u, profile: p } = await signUpWithEmailAndPassword(email, pass, name);
      setUser(u);
      setProfile(p);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
  };

  const handleResetPassword = async (email: string) => {
    await resetPasswordForEmail(email);
  };

  const handleRefreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        loginWithGoogle: handleLoginWithGoogle,
        loginWithEmail: handleLoginWithEmail,
        signupWithEmail: handleSignupWithEmail,
        logout: handleLogout,
        resetPassword: handleResetPassword,
        refreshProfile: handleRefreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
