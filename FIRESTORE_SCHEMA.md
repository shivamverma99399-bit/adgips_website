# IPVERSE — Firestore Schema & Data Modeling

This document details the Cloud Firestore database architecture, collection schemas, document relationships, and indexing requirements.

---

## 1. Collections & Document Specifications

### `users`
- **Document ID**: `${uid}` (Firebase Auth UID)
- **Purpose**: Stores verified collegiate identity, academic metrics, and participation logs.
- **Fields**:
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `uid` | `string` | Unique identifier matching Firebase Auth |
  | `name` | `string` | Full name of the scholar |
  | `email` | `string` | Institutional or personal email address |
  | `photoURL` | `string \| null` | Avatar image URL |
  | `role` | `string` | `"student" \| "society_member" \| "moderator" \| "admin"` |
  | `status` | `string` | `"active" \| "suspended"` |
  | `enrollmentNo` | `string` | GGSIPU University enrollment / roll number |
  | `programme` | `string` | Enrolled degree (e.g. B.Tech CSE AI&ML, B.A. LL.B.) |
  | `department` | `string` | Academic department |
  | `semester` | `number` | Current semester index |
  | `batch` | `string` | Academic cohort (e.g. "2023 – 2027") |
  | `cgpa` | `number` | Cumulative grade point average |
  | `attendancePercent` | `number` | Consolidated institutional attendance percentage |
  | `creditsEarned` | `number` | Academic credits completed |
  | `totalCredits` | `number` | Degree required credits |
  | `registeredEvents` | `Array<object>` | Compact cached list of active event passes for dashboard |
  | `clubMemberships` | `Array<object>` | Approved and pending student society affiliations |
  | `downloadedResources` | `Array<object>` | Offline resource download logs |
  | `subjectAttendance` | `Array<object>` | Departmental course attendance statistics |
  | `createdAt` | `timestamp` | Profile registration timestamp |
  | `updatedAt` | `timestamp` | Last profile update timestamp |

---

### `events`
- **Document ID**: `${eventId}` (e.g., `utkarsh-fest` or auto-generated)
- **Purpose**: Collegiate fests, hackathons, moot trials, and technical symposiums.
- **Fields**:
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | Unique event key |
  | `title` | `string` | Primary headline |
  | `subtitle` | `string?` | Descriptive tag |
  | `slug` | `string` | URL-friendly slug (`/events/[slug]`) |
  | `description` | `string` | Full markdown/prose event details |
  | `shortDescription` | `string?` | Teaser snippet for carousel cards |
  | `date` | `string` | Human-readable schedule dates |
  | `time` | `string` | Daily schedule timing |
  | `venue` | `string` | Campus auditorium, lab, or grounds |
  | `category` | `string` | `"Technical" \| "Cultural" \| "Workshops" \| "Competitions" \| "Sports" \| "Seminars"` |
  | `status` | `string` | `"upcoming" \| "ongoing" \| "past"` |
  | `image` | `string` | Photograph URL |
  | `featured` | `boolean` | Display priority on hero liquid lens carousel |
  | `eligibility` | `string` | Participant criteria |
  | `organizedBy` | `string` | Organizing society or departmental council |
  | `department` | `string?` | Faculty department |
  | `tags` | `Array<string>` | Searchable keywords |
  | `registeredCount` | `number` | Live counter of issued passes |
  | `capacity` | `number?` | Maximum sanctioned passes |
  | `createdAt` | `timestamp` | Publishing timestamp |
  | `updatedAt` | `timestamp` | Last modified timestamp |

---

### `registrations`
- **Document ID**: `${eventId}_${userId}` (Deterministic composite key prevents duplicate event passes)
- **Purpose**: Authoritative event registration passes.
- **Fields**:
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | `${eventId}_${userId}` |
  | `eventId` | `string` | Foreign key to `events` collection |
  | `eventTitle` | `string` | Denormalized event name |
  | `eventCategory` | `string` | Event category |
  | `eventDate` | `string` | Scheduled dates |
  | `eventVenue` | `string` | Location on campus |
  | `userId` | `string` | Foreign key to `users` collection |
  | `userEmail` | `string` | Registered scholar's email |
  | `studentName` | `string` | Scholar full name |
  | `enrollmentNo` | `string` | Roll number |
  | `semester` | `string` | Semester |
  | `branch` | `string` | Branch |
  | `status` | `string` | `"confirmed" \| "waitlist" \| "cancelled"` |
  | `registeredAt` | `timestamp` | Exact registration timestamp |

---

### `announcements`
- **Document ID**: `${noticeId}`
- **Purpose**: Institutional circulars, exam notifications, and campus bulletins.
- **Fields**:
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | Unique circular key |
  | `title` | `string` | Notice headline |
  | `category` | `string` | `"Academic" \| "Examination" \| "Placement" \| "Events" \| "Administrative"` |
  | `date` | `string` | Release date |
  | `isUrgent` | `boolean` | High priority ticker highlight |
  | `summary` | `string` | Executive digest |
  | `details` | `string?` | Extended advisory notes |
  | `fileSize` | `string?` | Associated circular PDF size |
  | `createdAt` | `timestamp` | Timestamp |

---

### `resources`
- **Document ID**: `${resourceId}`
- **Purpose**: Knowledge Commons repository (PYQs, syllabus schemes, lab manuals, lecture notes).
- **Fields**:
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `string` | Unique key |
  | `code` | `string` | Course code (e.g. `ETCS-402`, `LLB-101`) |
  | `title` | `string` | Resource title |
  | `stream` | `string` | `"Engineering" \| "Law" \| "Management"` |
  | `department` | `string` | Department |
  | `semester` | `string` | Semester label |
  | `semesterNumber` | `number` | Numeric semester index for ordering |
  | `type` | `string` | `"Syllabus Scheme" \| "Previous Year Paper" \| "Lab Manual" \| "Lecture Notes"` |
  | `year` | `string` | Academic session year |
  | `format` | `string` | `"PDF" \| "DOCX"` |
  | `fileSize` | `string` | File size |
  | `downloadsCount` | `number` | Download engagement counter |
  | `description` | `string` | Syllabus coverage summary |
  | `createdAt` | `timestamp` | Indexing timestamp |

---

### `societies` & `applications`
- **`societies`**: Student chapters and departmental societies (`ieee-adgips`, `moot-court-society`, `coding-guild`, `swar-taal`, `athletics`, `ecell`).
- **`applications`**:
  - **Document ID**: `${societyId}_${userId}`
  - Prevents multiple submissions to the same society.
  - Contains student credentials, `preferredRole`, and `status: "pending" | "approved" | "rejected"`.

---

## 2. Composite Indexes (`firestore.indexes.json`)

1. **`registrations`**:
   - `eventId` (ASC) + `registeredAt` (DESC)
2. **`applications`**:
   - `societyId` (ASC) + `submittedAt` (DESC)
