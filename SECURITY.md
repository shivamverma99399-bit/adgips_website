# IPVERSE — Security Architecture & Access Control

This document outlines the security controls, authentication rules, role hierarchy, and validation mechanisms implemented in IPVERSE.

---

## 1. Threat Model & Design Principles

1. **Deny-by-Default**: Every Firestore path is rejected unless explicitly permitted by an authenticated rule.
2. **Never Trust Client Inputs**: Role assignments, approval statuses, and administrative flags are blocked from direct client mutation.
3. **No Unbounded Growth**: Registrations and society applications use deterministic composite IDs (`${eventId}_${userId}` and `${societyId}_${userId}`) to prevent race conditions and duplicate documents.
4. **Credential Isolation**: Firebase Admin private keys and service accounts are isolated to server environments and never injected into client bundles.

---

## 2. Role-Based Access Control (RBAC) Hierarchy

```
┌─────────────────┐
│  administrator  │ Full CMS publishing, registration approvals, user role management
└────────┬────────┘
         │
┌────────▼────────┐
│    moderator    │ Society approvals and notice broadcasts
└────────┬────────┘
         │
┌────────▼────────┐
│ society_member  │ Society member portal access and activity coordination
└────────┬────────┘
         │
┌────────▼────────┐
│     student     │ Event registrations, society applications, profile updates, PYQ access
└─────────────────┘
```

---

## 3. Firestore Security Rules Breakdown

### Users (`/users/{userId}`)
- **Read**: The user themselves (`request.auth.uid == userId`) or an admin (`request.auth.token.role == 'admin'`).
- **Create**:
  - Must match authenticated UID.
  - Role must strictly be `'student'`.
  - Status must strictly be `'active'`.
- **Update**:
  - Allowed fields: `name`, `enrollmentNo`, `programme`, `department`, `semester`, `batch`, `photoURL`, `registeredEvents`, `clubMemberships`, `downloadedResources`.
  - Disallowed fields: `role`, `status`, `uid`, `createdAt`.
  - Blocked via:
    ```javascript
    !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'status', 'uid', 'createdAt'])
    ```
- **Delete**: Admin only.

### Registrations (`/registrations/{registrationId}`)
- **Read**: The applicant (`resource.data.userId == request.auth.uid`) or an admin.
- **Create**: Authenticated user matching `userId`, with `status == 'confirmed'`.
- **Update**: Only the applicant can modify `status` (e.g. to `'cancelled'`), or admins can change approval status.

### Public Content Collections (`events`, `announcements`, `resources`, `societies`, `opportunities`, `gallery`)
- **Read**: Publicly available without requiring login.
- **Write**: Strictly restricted to authenticated administrators.
- **Atomic Counters**: Public visitors and authenticated scholars can increment `downloadsCount` on academic resources upon downloading documents; authenticated users can increment `registeredCount` on events via controlled transactions.

---

## 4. Environment Variables & Secret Hygiene

- Client configuration values (`NEXT_PUBLIC_FIREBASE_*`) identify the Firebase project.
- Admin secrets (`FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_ADMIN_CLIENT_EMAIL`) must never use the `NEXT_PUBLIC_` prefix.
- `.env*` files are included in `.gitignore` and are not committed to version control.
