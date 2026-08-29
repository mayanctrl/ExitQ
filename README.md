# ExitQ — Smart Exit. Secure Campus.

> A timetable-aware digital campus exit management platform that dynamically evaluates student permissions, securely verifies QR passes at the gate, tracks campus movement, and keeps students, faculty, HODs, guards, and guardians connected.

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js-black.svg)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)
[![Responsive](https://img.shields.io/badge/Platform-Responsive%20Web-brightgreen.svg)](#)
[![Hackathon Project](https://img.shields.io/badge/Hackathon-Ready-purple.svg)](#)

---

## 🧭 Navigation

* [[Problem](#-problem)]
* [[Solution](#-solution)]
* [[How It Works](#-how-it-works)]
* [[User Roles](#-user-roles)]
* [[Smart Decision Engine](#-dynamic-permission-intelligence)]
* [[QR Security](#-qr-security)]
* [[Timetable & OCR](#-timetable-intelligence)]
* [[Architecture](#-architecture)]
* [[Database Model](#-database-model)]
* [[Tech Stack](#-tech-stack)]
* [[Security](#-security)]
* [[Getting Started](#-getting-started)]
* [[Feature Status](#-feature-status)]
* [[Future Scope](#-future-scope)]

---

## 🎯 Problem

Traditional campus gate-pass systems are heavily flawed:
* **Static Permissions:** A gate pass approved at 1 PM may become invalid at 2 PM if a faculty member schedules an unexpected extra lecture. Paper passes cannot detect this.
* **Fragmented Communication:** HODs, Faculty, Guards, and Guardians operate in silos with no automated notifications.
* **Security Blind Spots:** Guards cannot verify single-use QR integrity, timetable conflicts, or geographic coordinates, leading to unauthorized exits.
* **No Return Tracking:** Administrators know *who was allowed to leave*, but have no real-time status of *who is currently outside campus*.

---

## 💡 Solution

**ExitQ is not just a digital gate pass. It is a living authorization engine.**

ExitQ continuously evaluates student exit permissions against live timetable schedules, extra lecture additions, and campus security geofences.

```mermaid
flowchart LR
    A["Student Request"] --> B["HOD Review"]
    B --> C["Permission Engine"]
    C --> D["Timetable Monitor"]
    D --> E["QR Pass Generation"]
    E --> F["Gate Geofence Scan"]
    F --> G["Exit / Return Logged"]
    G --> H["Automated Notifications"]
    H --> I["Append-Only Audit Trail"]
```

---

## 🔄 How It Works

| Lifecycle Step | Description | System Action |
| :--- | :--- | :--- |
| **1. Submit** | Student requests exit pass with reason, date, exit time, return time, and accompanying group size. | Application status: `PENDING` |
| **2. Review** | HOD inspects student profile, exit history, and live timetable, then grants approval. | Status: `APPROVED_CONDITIONAL` or `APPROVED_LOCKED` |
| **3. Issue** | Secure cryptographic QR token is generated and delivered to the student's inbox. | QR Status: `ACTIVE` |
| **4. Scan** | Guard scans student QR. System validates token, expiration window, timetable state, and gate geofence. | Transaction locks pass to prevent reuse |
| **5. Exit** | Guard authorizes exit. Student outside counter is updated, and guardian is notified. | Status: `USED` (student marked `OUTSIDE`) |
| **6. Return** | Guard scans/records return. Student marked inside, completing the lifecycle. | Status: `USED` (student marked `INSIDE`) |

---

## ⚡ Dynamic Permission Intelligence

This is the core differentiator of ExitQ. We support two types of approvals:

### Scenario A: The Conditional Pass (Timetable-Aware)
If a student is granted a **Conditional pass** and a faculty member later schedules a lecture that overlaps the exit window:
```
[ Extra Lecture Scheduled ]
            ↓
  [ Conflict Detected ]
            ↓
[ Conditional Pass Revoked ] ──> Student notified in app
            ↓
    [ Guard Scans QR ]
            ↓
    [ ACCESS DENIED ]
```

### Scenario B: The Locked Pass (Protected)
If a student requires leave for official duties, medical emergencies, or family crises, the HOD issues a **Locked pass**. Subsequent timetable modifications will not affect this pass:
```
  [ Extra Lecture Scheduled ]
              ↓
    [ Conflict Detected ]
              ↓
  [ Locked Pass Protected ] ──> Student notified pass remains valid
              ↓
      [ Guard Scans QR ]
              ↓
     [ ACCESS GRANTED ]
```

---

## 🔐 QR Security

The QR code is not the authority; it is simply a secure reference. 

```mermaid
flowchart TD
    A["Scan QR Code"] --> B{"Token Valid?"}
    B -->|No| X["DENY EXIT"]
    B -->|Yes| C{"Permission Active?"}
    C -->|No| X
    C -->|Yes| D{"Within Valid Time?"}
    D -->|No| X
    D -->|Yes| E{"Timetable Clear?"}
    E -->|No| X
    E -->|Yes| F{"Gate Geofence Valid?"}
    F -->|No| X
    F -->|Yes| G{"Already Used?"}
    G -->|Yes| X
    G -->|No| H["ALLOW EXIT"]
```

### Key Controls
* **Single-use Verification:** Once verified by a guard, the QR token is atomically marked `USED` via a Firestore transaction to prevent simultaneous reuse or cloning.
* **Validity Window:** Evaluates `currentTime >= validFrom AND currentTime <= validUntil` on the server.
* **Geofencing:** Backend validates guard's device coordinates against the target Gate's radius boundary.
* **Server-side Validation:** Frontend state is never trusted. All evaluations run securely on the server via API routes using the Firebase Admin SDK.

---

## 👥 User Roles

ExitQ connects four specific roles with tailored dashboards:

<details>
<summary><strong>🎓 Student Dashboard</strong></summary>

* Request exit passes (specifying category, time, destination, group list).
* Present secure QR pass code.
* Real-time notification center (pass status, timetable updates).
* Dashboard showing exit statistics and active status (Inside/Outside).
</details>

<details>
<summary><strong>🔑 HOD Dashboard (Administrator)</strong></summary>

* Review pending exit applications with full student context (academic record, exit history, current day's timetable).
* Issue `GRANT - CONDITIONAL` or `GRANT - LOCKED` permissions.
* Update master college timetable (add/reschedule regular slots).
* View global campus movement status (real-time "Currently Outside" count and list).
* Audit log viewer (append-only trail of all actions).
</details>

<details>
<summary><strong>📚 Faculty Dashboard</strong></summary>

* View department schedule.
* Schedule **Extra Lectures** (which triggers the conflict resolution engine and automatically revokes overlapping conditional passes).
* Manage regular lecture statuses (Normal, Cancelled, Rescheduled).
</details>

<details>
<summary><strong>🛡️ Security Guard Dashboard</strong></summary>

* Built for fast mobile execution.
* Scan student passes via integrated device camera or fallback manually using Pass ID (e.g., `EXQ-10482`).
* Real-time ALLOW/DENY check results showing clear reasoning (e.g., "TIMETABLE_CONFLICT", "QR_ALREADY_USED").
* Record return status when students check back into campus.
</details>

---

## 📚 Timetable Intelligence

ExitQ handles schedules dynamically:
* **Timetable Versioning:** We never overwrite older timetable schedules. Every publish increments the version number (v1, v2, v3) and logs a changes summary to maintain historical records for audit transparency.
* **PDF & Image Import:** HODs and Faculty can drag-and-drop a timetable PDF or image. ExitQ simulates OCR extraction, allowing administrators to review, correct, and publish the schedule version in one click.

```mermaid
flowchart LR
    A["PDF / Image Upload"] --> B["Firebase Storage"]
    B --> C["OCR Processing"]
    C --> D["Structured Preview Grid"]
    D --> E["Human Verification"]
    E --> F["Publish Version"]
```

---

## 🔔 Notifications

Our notification matrix connects stakeholders immediately based on state changes:

| Trigger Event | Student | HOD | Faculty | Guardian | Teacher Guardian |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Exit Application Submitted** | ✅ | ✅ | — | — | — |
| **Pass Approved / Rejected** | ✅ | — | — | — | — |
| **Timetable Conflict Revocation** | ✅ | — | — | 📋 | 📋 |
| **Gate Exit Recorded** | ✅ | — | — | ✅ | ✅ |
| **Gate Return Recorded** | ✅ | — | — | ✅ | 📋 |
| **Security Failure Alert** | — | ✅ | — | — | — |

*`✅ Complete` | `📋 Planned / Future Scope`*

---

## 📋 Audit Trail

Every transaction creates an append-only audit trail. Users cannot modify or delete audit log documents.

```
[10:31 AM] Student submitted exit application EXQ-10482
[10:42 AM] HOD approved conditional exit permission (Time: 2:00 PM - 4:00 PM)
[12:17 PM] Faculty scheduled Extra Lecture (OS Lab, 2:30 PM - 3:30 PM)
[12:17 PM] ExitQ Engine detected conflict with EXQ-10482
[12:17 PM] Pass EXQ-10482 automatically REVOKED (Notification dispatched to student)
[02:05 PM] Guard scanned pass EXQ-10482 at Gate 1
[02:05 PM] ExitQ Engine: ACCESS DENIED - Permission revoked due to OS Lab lecture
```

---

## 🏗️ Architecture

```mermaid
flowchart TB
    UI["ExitQ Web Application (Next.js / React)"]

    UI --> AUTH["Firebase Authentication (Session & Roles)"]
    UI --> API["Secure API Routes (Next.js Server Actions)"]

    API --> DB[("Cloud Firestore")]
    API --> STORAGE["Firebase Storage (Timetable PDFs)"]
    API --> ENGINE["Exit Decision Engine (Location, Time, Timetable)"]

    ENGINE --> TIMETABLE["Timetable Service"]
    ENGINE --> QR["QR Verification Service"]
    ENGINE --> LOCATION["Location / Gate Geofence Service"]

    API --> NOTIFY["Notification Service"]
    API --> AUDIT["Audit Log Service"]

    TIMETABLE --> DB
    QR --> DB
    LOCATION --> DB
    NOTIFY --> DB
    AUDIT --> DB
```

---

## 🗄️ Database Model

```mermaid
erDiagram
    users ||--o| students : "role data"
    users ||--o| faculty : "role data"
    users ||--o| hods : "role data"
    users ||--o| guards : "role data"
    students ||--o| guardians : "belongs to"
    students ||--o{ exitApplications : "submits"
    exitApplications ||--o| exitPermissions : "creates"
    exitPermissions ||--o| qrTokens : "references"
    exitPermissions ||--o{ movementEvents : "tracks"
    timetableVersions ||--o{ lectures : "contains"
```

### Core Collections
1. **`users/{uid}`:** User profile document mapping to Firebase Authentication.
2. **`students/{uid}`:** Detailed student metrics (attendance, exit counters, outside status).
3. **`guardians/{guardianId}`:** Guardian contact details and notification settings.
4. **`timetables/{timetableId}`:** Main timetable configuration.
5. **`timetableVersions/{versionId}`:** Archive of published timetables.
6. **`lectures/{lectureId}`:** Lecture definitions (subject, room, timings, status).
7. **`exitApplications/{appId}`:** Student application entries (Pending, Approved, Rejected).
8. **`exitPermissions/{permId}`:** Active or historical gate passes (Conditional/Locked).
9. **`qrTokens/{tokenId}`:** Random token maps for guard scanners (Active/Used/Expired).
10. **`gates/{gateId}`:** Authorized gate locations and radius coordinates.
11. **`movementEvents/{eventId}`:** Logged movement entries (EXIT/RETURN).
12. **`notifications/{notifId}`:** Dispatched notification records.
13. **`auditLogs/{logId}`:** Append-only activity database.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Next.js 16 (App Router) | High-performance user interface |
| **Language** | TypeScript 5 | Strict static typing |
| **Styling** | Tailwind CSS 4, Lucide Icons | Clean modern design system |
| **Auth** | Firebase Auth (Client & Admin SDK) | Secure identity & custom role claims |
| **Database** | Cloud Firestore | Real-time document storage |
| **File Storage** | Firebase Storage | Storage for uploaded timetables |
| **QR Code** | `html5-qrcode`, `qrcode` | Live client scanning and generation |
| **OCR** | Simulated OCR Parser | Structured extraction preview |

---

## 🔒 Security

* **No Client Authority:** The client frontend is never trusted. All database reads are restricted via **Firestore Security Rules**, and writes flow exclusively through secure backend Next.js API Routes using the Firebase Admin SDK.
* **Least-Privilege Principle:** Guards only view student details relevant to exit verification (status, HOD remark, geofence status) and cannot access guardian private data or academic history.
* **Append-Only Audits:** System audit logs cannot be updated or deleted by any user account.
* **Geofencing:** Backend calculates actual distance using the Haversine formula, preventing guards from spoofing scanner locations.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v20 or higher
* Java Development Kit (JDK) v11+ (required to run local Firebase Emulators)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/exitq.git
   cd exitq
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup
Create a `.env.local` file in the project root:
```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=mock-api-key-exitq
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=exitq-demo-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=exitq-demo-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=exitq-demo-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:1234567890abcdef

# Firebase Server Admin Configuration
FIREBASE_PROJECT_ID=exitq-demo-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-exitq@exitq-demo-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMockPrivateKeyLine1\nMockPrivateKeyLine2\n-----END PRIVATE KEY-----\n"

# Firebase Emulators (Leave active to run locally offline)
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
```

### Running Locally
1. Start the Firebase Local Emulators:
   ```bash
   npx firebase emulators:start --project exitq-demo-app
   ```
2. Start the Next.js dev server:
   ```bash
   npm run dev
   ```
3. Seed the emulator database (makes a POST request to our `/api/seed` route):
   ```bash
   Invoke-RestMethod -Uri "http://localhost:3000/api/seed" -Method Post
   ```
   *(For bash/Unix, use: `curl -X POST http://localhost:3000/api/seed`)*

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 Firebase Setup (Production Deploy)

To deploy this backend setup to a live production Firebase project:
1. Initialize the Firebase CLI inside the repository:
   ```bash
   firebase init
   ```
2. Link your production Firebase project.
3. Deploy Firestore rules and indexes:
   ```bash
   firebase deploy --only firestore
   ```
4. Deploy Storage rules:
   ```bash
   firebase deploy --only storage
   ```

---

## 👥 Demo Accounts

The launcher on the landing page is configured with the following seeded credentials (all accounts use the password `Password123!`):

| Role | Name | Email | Associated ID |
| :--- | :--- | :--- | :--- |
| **HOD** | Dr. Ananya Sharma | `hod@demo.exitq.app` | `usr_hod_1` |
| **Faculty** | Prof. Rajesh Kumar | `faculty@demo.exitq.app` | `usr_fac_1` |
| **Guard** | Ramesh Singh | `guard@demo.exitq.app` | `usr_grd_1` |
| **Student** | Aarav Mehta | `student@demo.exitq.app` | `usr_std_1` (CS-2023-042) |

---

## 🎬 2-Minute Demo Flow

Test the core dynamic scheduling features of ExitQ in less than two minutes:
1. **Student Login:** Log in as **Student** (Aarav Mehta). Submit an exit request for today from 2:00 PM to 4:00 PM (Application ID e.g., `EXQ-10482`).
2. **HOD Approval:** Log in as **HOD** (Dr. Ananya Sharma). Open the pending request list, locate `EXQ-10482`, and approve it as `GRANT - CONDITIONAL`.
3. **QR Generation:** Switch back to the **Student** view. See the active status and copy the generated QR token reference.
4. **Timetable Conflict:** Log in as **Faculty** (Prof. Rajesh Kumar). Navigate to `Extra Lectures`, and schedule an extra lecture for today from 2:30 PM to 3:30 PM.
5. **Auto-Revocation:** Return to the **Student** dashboard. Observe that the permission status has automatically updated to `REVOKED` in real-time, and check the received notification.
6. **Guard Validation:** Log in as **Guard** (Ramesh Singh). Try scanning the student's old QR. Observe the system result: `ACCESS DENIED` with reason `TIMETABLE_CONFLICT`.
7. **Protected Test:** Repeat steps 1-2, but approve the request as `GRANT - LOCKED`. Schedule the same extra lecture as Faculty. Switch to Guard view and scan. Observe result: `ALLOW EXIT` (with student's status updated to Outside and audit trail generated).

---

## 🧪 Feature Status

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Firebase Auth & Claims** | ✅ | Completed & Verified |
| **User Role Dashboards** | ✅ | Completed & Verified |
| **Exit Applications** | ✅ | Completed & Verified |
| **HOD Decision Engine** | ✅ | Conditional vs Locked permissions |
| **QR Generation / Scanner** | ✅ | Camera verification with fallback ID lookup |
| **Timetable Management** | ✅ | Versioning control and master grid |
| **Conflict Revocation Engine** | ✅ | Auto-evaluation of overlaps |
| **Notifications** | ✅ | Real-time in-app notifications |
| **Geofencing** | ✅ | GPS location radius validation on scanner |
| **Timetable OCR Import** | ✅ | PDF upload with structure review |
| **Movement Logging** | ✅ | Exit & Return tracking |
| **Audit Trails** | ✅ | Immutable append-only log entries |
| **SMS/Email Notifications** | 📋 | Planned integration for Guardians |

*`✅ Complete` | `🚧 In Progress` | `📋 Planned`*

---

## 🔮 Future Scope

* **SMS Gateway Integration:** Deploy Twilio or AWS SNS for real-time text alerts to parents upon student exits/returns.
* **Attendance Syncing:** Automatically mark students as absent or present in academic registers based on movement logs.
* **Face ID/Biometric Gates:** Supplement QR passes with biometric face scanners at high-traffic campus points.
* **Guardian Portal:** A lightweight client portal for parents to verify exit permissions.

---

Built with ❤️ for the Hackathon.
