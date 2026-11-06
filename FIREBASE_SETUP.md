# IPVERSE — Firebase Integration & Setup Guide

This document outlines the architecture, configuration steps, and operational procedures for the Firebase backend integration in **IPVERSE (ADGIPS Student Portal)**.

---

## 1. Firebase Project Overview

- **Project ID**: `adgips-website`
- **Region**: `asia-south1` (Mumbai)
- **Database**: Cloud Firestore (Standard Edition, `(default)`)
- **Authentication Providers**:
  - Google Identity (OAuth 2.0 / Workspace SSO)
  - Email / Password with secure verification & reset

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.local` and provide your project keys:

```bash
cp .env.example .env.local
```

### Required Client Environment Variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAorlS34VrFseuiA8HUZilTY_M80z1KT6g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=adgips-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=adgips-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=adgips-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=678217252516
NEXT_PUBLIC_FIREBASE_APP_ID=1:678217252516:web:3e0db4e4aa340287723031
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WFTGDTHV66
```

### Server-Only Admin SDK Credentials (Optional for local client emulation; required for trusted backend tasks):
```env
FIREBASE_ADMIN_PROJECT_ID=adgips-website
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@adgips-website.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> [!CAUTION]
> Never prefix server admin keys with `NEXT_PUBLIC_`. These are only accessed by Node.js server runtimes and CLI scripts.

---

## 3. Architecture Overview

```
├── lib/
│   ├── firebase/
│   │   ├── client.ts       # Singleton Firebase client initialization & instances (Auth, Firestore)
│   │   ├── auth.ts         # Authentication operations (Google, Email/Password, Password Reset)
│   │   ├── firestore.ts    # Firestore query services & transaction handlers
│   │   └── admin.ts        # Firebase Admin SDK initialization for server-side trusted execution
├── components/
│   └── providers/
│       └── auth-provider.tsx # React Context providing user identity, profile, and auth methods
├── types/
│   └── backend.ts          # Strong TypeScript contracts for all Firestore entities & API responses
├── scripts/
│   └── set-admin.ts        # CLI tool to provision administrator custom claims and roles securely
├── firestore.rules         # Production Firestore security rules (deny-by-default, RBAC)
└── firestore.indexes.json  # Composite Firestore indexes
```

---

## 4. Authentication Flow

1. **Google Sign-In**:
   - Executes `signInWithPopup(auth, googleProvider)`.
   - On completion, checks if a Firestore document exists in `users/{uid}`.
   - If new, creates a profile initialized with role `student`, status `active`, and collegiate defaults.
   - If existing, retrieves the profile without overwriting custom student data.

2. **Email & Password**:
   - `signUpWithEmailAndPassword`: Registers account and provisions the Firestore profile with default student privileges.
   - `loginWithEmailAndPassword`: Authenticates against Firebase Auth and hydrates the user profile into `AuthContext`.
   - `sendPasswordResetEmail`: Dispatches official password reset email.

3. **Session Persistence**:
   - Configured using `browserLocalPersistence` so sessions persist across page refreshes and browser tabs.

---

## 5. Security & Admin Promotion

To promote a verified staff member or student lead to administrator:
```bash
# Run CLI script with admin service account credentials
npx ts-node scripts/set-admin.ts "admin.staff@adgips.ac.in" admin
```
This updates both the cryptographic Firebase Auth Custom Claims (`request.auth.token.role == 'admin'`) and the Firestore document `users/{uid}.role = 'admin'`. Client-side self-escalation is blocked at the Security Rules layer.
