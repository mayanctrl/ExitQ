export type Role = 'HOD' | 'FACULTY' | 'GUARD' | 'STUDENT';

export type ApplicationStatus =
  | 'PENDING'
  | 'APPROVED_CONDITIONAL'
  | 'APPROVED_LOCKED'
  | 'REJECTED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'USED'
  | 'CANCELLED';

export type PermissionType = 'CONDITIONAL' | 'LOCKED';

export type ExitReasonCategory =
  | 'MEDICAL'
  | 'FAMILY_EMERGENCY'
  | 'OFFICIAL_WORK'
  | 'PERSONAL'
  | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatarUrl?: string;
  phone?: string;
  title?: string;
}

export interface Guardian {
  id: string;
  studentId: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  notificationPreferences: {
    sms: boolean;
    email: boolean;
    inApp: boolean;
  };
}

export interface Student extends User {
  role: 'STUDENT';
  studentId: string; // e.g. CS-2023-042
  semester: number;
  batch: string;
  isOutside: boolean;
  guardian: Guardian;
  teacherGuardianName?: string; // TG Faculty Name
  teacherGuardianId?: string;
  attendancePercentage: number;
  totalExits: number;
  approvedExits: number;
  rejectedExits: number;
  cancelledExits: number;
}

export interface Lecture {
  id: string;
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  startTime: string; // "10:00"
  endTime: string;   // "11:00"
  subject: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  room: string;
  department: string;
  semester: number;
  isExtra?: boolean;
}

export interface ExtraLecture {
  id: string;
  classBatch: string; // e.g., "CS-SEM4"
  date: string;       // YYYY-MM-DD
  startTime: string;  // "14:00"
  endTime: string;    // "15:00"
  subject: string;
  room: string;
  reason: string;
  facultyId: string;
  facultyName: string;
  createdAt: string;
}

export interface TimetableVersion {
  version: number;
  modifiedBy: string;
  modifiedByName: string;
  timestamp: string;
  changeSummary: string;
  lectures: Lecture[];
}

export interface ExitApplication {
  id: string; // EXQ-10482
  studentId: string;
  studentName: string;
  studentRoll: string;
  department: string;
  semester: number;
  reasonCategory: ExitReasonCategory;
  reasonDescription: string;
  destination: string;
  exitTime: string;      // ISO format or time e.g., "14:00"
  expectedReturnTime: string; // e.g., "17:00"
  date: string;          // YYYY-MM-DD
  accompanyingCount: number;
  accompanyingStudentIds?: string[];
  accompanyingStudentNames?: string[];
  submittedAt: string;
  status: ApplicationStatus;
  permissionType?: PermissionType;
  hodRemark?: string;
  rejectedReason?: string;
  isEmergencyOverride?: boolean;
  overrideBy?: string;
}

export interface ExitPermission {
  id: string; // PERM-10482
  applicationId: string;
  studentId: string;
  permissionType: PermissionType;
  validFrom: string; // YYYY-MM-DD THH:MM
  validUntil: string;
  status: ApplicationStatus;
  hodRemark?: string;
  groupCount: number;
  accompanyingStudentNames: string[];
  qrTokenId: string;
  revocationReason?: string;
  revokedAt?: string;
  exitTimestamp?: string;
  returnTimestamp?: string;
}

export interface QRToken {
  id: string;
  token: string; // Opaque UUID/hash
  permissionId: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface VerificationResult {
  allowed: boolean;
  reason: string;
  permission?: ExitPermission;
  application?: ExitApplication;
  student?: Student;
  checks: {
    name: string;
    passed: boolean;
    detail: string;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  userRole: Role;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  category: 'APPLICATION' | 'REVOCATION' | 'EXTRA_LECTURE' | 'GATE_ACTIVITY' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  actorId: string;
  action: string;
  target: string;
  result: 'SUCCESS' | 'FAILURE' | 'WARNING';
  reason?: string;
  ipAddress?: string;
}
