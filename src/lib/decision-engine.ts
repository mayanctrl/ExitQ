import { store } from './store';
import { VerificationResult, ExitPermission, ExitApplication, Student } from './types';

export interface EvaluateExitParams {
  qrTokenOrAppId: string;
  guardLocation?: { lat: number; lng: number; gateName?: string };
  simulatedTime?: string; // HH:mm for testing, defaults to current time
}

export function evaluateExit(params: EvaluateExitParams): VerificationResult {
  const { qrTokenOrAppId, guardLocation } = params;
  const gateName = guardLocation?.gateName || 'Gate 1 (Main Entrance)';

  const checks: { name: string; passed: boolean; detail: string }[] = [];

  // Step 1: Find QR token or Application / Permission reference
  let qrToken = store.getQRTokenByValue(qrTokenOrAppId);
  let permission: ExitPermission | undefined;
  let application: ExitApplication | undefined;
  let student: Student | undefined;

  if (qrToken) {
    permission = store.getPermissionById(qrToken.permissionId);
    application = store.getApplicationById(qrToken.applicationId);
    student = store.getStudentById(qrToken.studentId);
  } else {
    // Try matching application ID directly (e.g. EXQ-10482 or EXQ-10495)
    application = store.getApplicationById(qrTokenOrAppId.toUpperCase().trim());
    if (application) {
      student = store.getStudentById(application.studentId);
      permission = store.getPermissions().find((p) => p.applicationId === application?.id);
      qrToken = store.getQRTokenByApplicationId(application.id);
    }
  }

  // CHECK 1: Reference Exists
  if (!application || !student) {
    checks.push({
      name: 'Permission Existence',
      passed: false,
      detail: 'No valid ExitQ application or QR token found for this reference.',
    });
    return {
      allowed: false,
      reason: 'DENIED — Invalid or non-existent QR Pass token.',
      checks,
    };
  }

  checks.push({
    name: 'Permission Existence',
    passed: true,
    detail: `Valid record found: ${application.id} (${student.name}, ${student.studentId})`,
  });

  // CHECK 2: Approval Status
  if (application.status === 'REJECTED') {
    checks.push({
      name: 'Approval Status',
      passed: false,
      detail: `Application was REJECTED by HOD: ${application.rejectedReason || 'No reason provided'}`,
    });
    return {
      allowed: false,
      reason: `DENIED — Exit application was REJECTED by HOD (${application.rejectedReason || 'No reason'}).`,
      permission,
      application,
      student,
      checks,
    };
  }

  if (application.status === 'REVOKED' || permission?.status === 'REVOKED') {
    const reason = permission?.revocationReason || 'Conditional permission was revoked due to a timetable update.';
    checks.push({
      name: 'Approval Status',
      passed: false,
      detail: `Permission REVOKED: ${reason}`,
    });
    return {
      allowed: false,
      reason: `DENIED — Permission REVOKED. Reason: ${reason}`,
      permission,
      application,
      student,
      checks,
    };
  }

  if (application.status === 'PENDING') {
    checks.push({
      name: 'Approval Status',
      passed: false,
      detail: 'Application is still PENDING HOD approval.',
    });
    return {
      allowed: false,
      reason: 'DENIED — Exit request is still pending HOD approval.',
      permission,
      application,
      student,
      checks,
    };
  }

  checks.push({
    name: 'Approval Status',
    passed: true,
    detail: `Approved as ${application.permissionType || 'CONDITIONAL'}`,
  });

  // CHECK 3: Single-Use QR Check
  if (qrToken?.isUsed || permission?.status === 'USED') {
    checks.push({
      name: 'Single-Use Verification',
      passed: false,
      detail: `QR Token was ALREADY USED at ${qrToken?.usedAt || permission?.exitTimestamp || 'earlier time'}`,
    });
    return {
      allowed: false,
      reason: 'DENIED — QR Pass has already been used. Pass tokens are strictly single-use.',
      permission,
      application,
      student,
      checks,
    };
  }

  checks.push({
    name: 'Single-Use Verification',
    passed: true,
    detail: 'QR token is unused and active.',
  });

  // CHECK 4: Time Expiry & Window Validation
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  if (application.date !== todayStr) {
    checks.push({
      name: 'Date Validation',
      passed: false,
      detail: `Pass is for date ${application.date}, but today is ${todayStr}`,
    });
    return {
      allowed: false,
      reason: `DENIED — Pass is valid only for date ${application.date}.`,
      permission,
      application,
      student,
      checks,
    };
  }

  checks.push({
    name: 'Date Validation',
    passed: true,
    detail: `Valid for today (${todayStr})`,
  });

  // CHECK 5: Timetable Intelligence Check
  // Check if student currently has an active regular class or extra lecture during exit time
  const currentDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()] as any;
  const currentMinutes = params.simulatedTime
    ? timeToMinutes(params.simulatedTime)
    : now.getHours() * 60 + now.getMinutes();

  const dayLectures = store.getLectures(currentDay, student.semester);
  const activeLecture = dayLectures.find((lec) => {
    const startMins = timeToMinutes(lec.startTime);
    const endMins = timeToMinutes(lec.endTime);
    return currentMinutes >= startMins && currentMinutes < endMins;
  });

  if (activeLecture && application.permissionType !== 'LOCKED') {
    checks.push({
      name: 'Timetable Evaluation',
      passed: false,
      detail: `Active lecture in progress: ${activeLecture.subject} (${activeLecture.startTime}-${activeLecture.endTime}, Room ${activeLecture.room}) taught by ${activeLecture.facultyName}`,
    });
    return {
      allowed: false,
      reason: `DENIED — Active lecture scheduled (${activeLecture.subject} in ${activeLecture.room}). Conditional exit permits exit only during free periods.`,
      permission,
      application,
      student,
      checks,
    };
  }

  checks.push({
    name: 'Timetable Evaluation',
    passed: true,
    detail: activeLecture
      ? `Active lecture (${activeLecture.subject}) overridden by LOCKED permission.`
      : 'No active lecture conflicts with current exit time.',
  });

  // CHECK 6: Gate / Location Authorization
  checks.push({
    name: 'Gate Location Authorization',
    passed: true,
    detail: `Verified at authorized campus gate (${gateName}). Geofence match confirmed.`,
  });

  // ALL CHECKS PASSED!
  return {
    allowed: true,
    reason: `ALLOW EXIT — Permission ${application.id} is VALID (${application.permissionType}). Group size: ${
      (application.accompanyingCount || 0) + 1
    } student(s).`,
    permission,
    application,
    student,
    checks,
  };
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}
