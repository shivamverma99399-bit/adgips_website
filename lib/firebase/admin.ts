import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getAuth as getAdminAuth, Auth as AdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from "firebase-admin/firestore";

let adminApp: App;

const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "adgips-website";

const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

if (!getApps().length) {
  if (clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  } else {
    // Default application credentials / lightweight project-bound mode
    adminApp = initializeApp({
      projectId,
    });
  }
} else {
  adminApp = getApp();
}

export const adminAuth: AdminAuth = getAdminAuth(adminApp);
export const adminDb: AdminFirestore = getAdminFirestore(adminApp);
export { adminApp };
