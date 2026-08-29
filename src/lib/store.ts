import {
  User,
  Student,
  Lecture,
  ExtraLecture,
  TimetableVersion,
  ExitApplication,
  ExitPermission,
  QRToken,
  Notification,
  AuditLogEntry,
  ApplicationStatus,
  PermissionType,
  CreateAccountPayload,
  StudentSignupPayload,
} from './types';
import {
  SEED_HOD,
  SEED_FACULTY,
  SEED_GUARDS,
  SEED_STUDENTS,
  SEED_LECTURES,
  SEED_TIMETABLE_VERSION,
  SEED_APPLICATIONS,
  SEED_PERMISSIONS,
  SEED_QR_TOKENS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
} from './seed';

// Initial Administrator definition
const INITIAL_ADMIN: User = {
  id: 'usr_admin_1',
  name: 'Mayank (Admin)',
  email: 'mayankhobragade.ee24@sbjit.edu.in',
  role: 'HOD',
  department: 'Computer Science & Engineering',
  title: 'System Administrator',
  phone: '+91 99999 00001',
};

class ExitQStore {
  private users: Map<string, User> = new Map();
  private userPasswords: Map<string, string> = new Map();
  private students: Map<string, Student> = new Map();
  private lectures: Lecture[] = [];
  private extraLectures: ExtraLecture[] = [];
  private timetableVersions: TimetableVersion[] = [];
  private applications: Map<string, ExitApplication> = new Map();
  private permissions: Map<string, ExitPermission> = new Map();
  private qrTokens: Map<string, QRToken> = new Map();
  private notifications: Notification[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.initSeedData();
  }

  public resetToSeed() {
    this.users.clear();
    this.userPasswords.clear();
    this.students.clear();
    this.applications.clear();
    this.permissions.clear();
    this.qrTokens.clear();
    this.lectures = [];
    this.extraLectures = [];
    this.timetableVersions = [];
    this.notifications = [];
    this.auditLogs = [];
    this.initSeedData();
  }

  private initSeedData() {
    // Add Initial Admin
    this.users.set(INITIAL_ADMIN.id, INITIAL_ADMIN);
    this.userPasswords.set(INITIAL_ADMIN.email.toLowerCase(), 'cubes88');

    // Add seeded users & default password
    [SEED_HOD, ...SEED_FACULTY, ...SEED_GUARDS].forEach((u) => {
      this.users.set(u.id, u);
      this.userPasswords.set(u.email.toLowerCase(), 'cubes88');
    });

    SEED_STUDENTS.forEach((s) => {
      this.users.set(s.id, s);
      this.students.set(s.id, s);
      this.userPasswords.set(s.email.toLowerCase(), 'cubes88');
    });

    // Timetable
    this.lectures = [...SEED_LECTURES];
    this.timetableVersions = [{ ...SEED_TIMETABLE_VERSION }];

    // Applications & Permissions & QR
    SEED_APPLICATIONS.forEach((app) => this.applications.set(app.id, app));
    SEED_PERMISSIONS.forEach((p) => this.permissions.set(p.id, p));
    SEED_QR_TOKENS.forEach((q) => this.qrTokens.set(q.id, q));

    // Notifications & Logs
    this.notifications = [...SEED_NOTIFICATIONS];
    this.auditLogs = [...SEED_AUDIT_LOGS];
  }

  // --- USERS & AUTH ---
  public validateCredentials(email: string, password: string): User | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.getUserByEmail(normalizedEmail);
    if (!user) return undefined;

    const storedPassword = this.userPasswords.get(normalizedEmail);
    // Allow either exact match or fallback demo password
    if (storedPassword && storedPassword === password) {
      return user;
    }
    if (password === 'cubes88' || password === 'password123') {
      return user;
    }
    return undefined;
  }

  public registerStudent(payload: StudentSignupPayload): Student {
    const id = `usr_std_${Date.now()}`;
    const newStudent: Student = {
      id,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      studentId: payload.studentId.trim().toUpperCase(),
      role: 'STUDENT',
      department: payload.department,
      semester: payload.semester || 4,
      batch: `${payload.department}-SEM${payload.semester || 4}`,
      isOutside: false,
      attendancePercentage: 90.0,
      totalExits: 0,
      approvedExits: 0,
      rejectedExits: 0,
      cancelledExits: 0,
      guardian: {
        id: `gdn_${Date.now()}`,
        studentId: id,
        name: 'Parent / Guardian',
        relation: 'Parent',
        phone: '+91 98000 00000',
        email: 'guardian@exitq.edu',
        notificationPreferences: { sms: true, email: true, inApp: true },
      },
    };

    this.users.set(id, newStudent);
    this.students.set(id, newStudent);
    this.userPasswords.set(newStudent.email.toLowerCase(), payload.password);

    this.addAuditLog({
      actorId: id,
      actorName: newStudent.name,
      actorRole: 'STUDENT',
      action: 'STUDENT_SIGNUP',
      target: newStudent.studentId,
      result: 'SUCCESS',
      reason: 'Public student self-registration',
    });

    return newStudent;
  }

  public createInstitutionalAccount(
    payload: CreateAccountPayload,
    adminUser: User
  ): { user: User; generatedPassword: string } {
    const id = `usr_${payload.role.toLowerCase()}_${Date.now()}`;
    const generatedPassword = `ExitQ@${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: User = {
      id,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      role: payload.role,
      department: payload.department || 'Campus Security',
      employeeId: payload.employeeId,
      phone: payload.phone || '+91 98765 00000',
      title: payload.title || `${payload.role} Officer`,
    };

    this.users.set(id, newUser);
    this.userPasswords.set(newUser.email.toLowerCase(), generatedPassword);

    this.addAuditLog({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'ACCOUNT_PROVISION',
      target: `${payload.role} - ${newUser.name} (${newUser.email})`,
      result: 'SUCCESS',
      reason: `Provisioned by ${adminUser.name}. Temporary credentials generated.`,
    });

    return { user: newUser, generatedPassword };
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public getStudentById(id: string): Student | undefined {
    return this.students.get(id);
  }

  public getAllStudents(): Student[] {
    return Array.from(this.students.values());
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // --- TIMETABLE ---
  public getLectures(day?: string, semester: number = 4): Lecture[] {
    let result = this.lectures.filter((l) => l.semester === semester);
    if (day) {
      result = result.filter((l) => l.day === day);
    }
    return result;
  }

  public getExtraLectures(): ExtraLecture[] {
    return [...this.extraLectures];
  }

  public getTimetableVersions(): TimetableVersion[] {
    return [...this.timetableVersions];
  }

  public updateLectures(newLectures: Lecture[], actorId: string, actorName: string, summary: string): TimetableVersion {
    this.lectures = newLectures;
    const newVersion: TimetableVersion = {
      version: this.timetableVersions.length + 1,
      modifiedBy: actorId,
      modifiedByName: actorName,
      timestamp: new Date().toISOString(),
      changeSummary: summary,
      lectures: [...newLectures],
    };
    this.timetableVersions.unshift(newVersion);

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'HOD',
      action: 'TIMETABLE_UPDATE',
      target: `Semester 4 Timetable v${newVersion.version}`,
      result: 'SUCCESS',
      reason: summary,
    });

    return newVersion;
  }

  public moveLecture(
    lectureId: string,
    targetDay: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT',
    targetStartTime: string,
    targetEndTime: string,
    actorId: string,
    actorName: string,
    semester: number = 4
  ): { success: boolean; error?: string; version?: TimetableVersion; affectedPermissions: ExitPermission[] } {
    const lectureIndex = this.lectures.findIndex((l) => l.id === lectureId);
    if (lectureIndex === -1) {
      return { success: false, error: 'Lecture not found in timetable', affectedPermissions: [] };
    }

    const lecture = this.lectures[lectureIndex];

    // Check collision in target slot
    const collision = this.lectures.find(
      (l) =>
        l.id !== lectureId &&
        l.day === targetDay &&
        l.startTime === targetStartTime &&
        l.semester === semester
    );

    if (collision) {
      return {
        success: false,
        error: `Time slot ${targetDay} ${targetStartTime} is already occupied by ${collision.subject}.`,
        affectedPermissions: [],
      };
    }

    const previousDay = lecture.day;
    const previousTime = lecture.startTime;

    // Update lecture
    lecture.day = targetDay;
    lecture.startTime = targetStartTime;
    lecture.endTime = targetEndTime;

    const summary = `Moved ${lecture.subjectCode} (${lecture.subject}) from ${previousDay} ${previousTime} to ${targetDay} ${targetStartTime}`;

    const newVersion = this.updateLectures([...this.lectures], actorId, actorName, summary);

    // Re-evaluate conflicts for active permissions on targetDay
    const affected: ExitPermission[] = [];
    this.permissions.forEach((perm) => {
      if (perm.status === 'APPROVED_CONDITIONAL') {
        const app = this.applications.get(perm.applicationId);
        if (app && app.exitTime <= targetStartTime && app.expectedReturnTime > targetStartTime) {
          perm.status = 'REVOKED';
          perm.revocationReason = `Timetable Rescheduled: ${lecture.subject} was moved to ${targetDay} ${targetStartTime}–${targetEndTime}.`;
          perm.revokedAt = new Date().toISOString();
          app.status = 'REVOKED';

          affected.push(perm);

          this.addNotification({
            userId: perm.studentId,
            userRole: 'STUDENT',
            title: 'PASS REVOKED — Timetable Moved',
            message: `Lecture ${lecture.subject} was rescheduled to ${targetDay} ${targetStartTime}. Your conditional gate pass ${app.id} has been automatically revoked.`,
            type: 'ERROR',
            category: 'REVOCATION',
            read: false,
            link: '/student/passes',
          });
        }
      }
    });

    return { success: true, version: newVersion, affectedPermissions: affected };
  }

  public addLecture(
    lectureData: Omit<Lecture, 'id'>,
    actorId: string,
    actorName: string
  ): { success: boolean; lecture?: Lecture; error?: string; version?: TimetableVersion } {
    // Check if slot occupied
    const occupied = this.lectures.find(
      (l) =>
        l.day === lectureData.day &&
        l.startTime === lectureData.startTime &&
        l.semester === (lectureData.semester || 4)
    );

    if (occupied) {
      return { success: false, error: `Time slot ${lectureData.day} ${lectureData.startTime} is already occupied by ${occupied.subject}.` };
    }

    const newLecture: Lecture = {
      ...lectureData,
      id: `lec_${Date.now()}`,
    };

    this.lectures.push(newLecture);
    const summary = `Added new lecture: ${newLecture.subjectCode} (${newLecture.subject}) on ${newLecture.day} ${newLecture.startTime}`;
    const newVersion = this.updateLectures([...this.lectures], actorId, actorName, summary);

    return { success: true, lecture: newLecture, version: newVersion };
  }

  public deleteLecture(
    lectureId: string,
    actorId: string,
    actorName: string
  ): { success: boolean; error?: string; version?: TimetableVersion } {
    const lecture = this.lectures.find((l) => l.id === lectureId);
    if (!lecture) {
      return { success: false, error: 'Lecture not found' };
    }

    this.lectures = this.lectures.filter((l) => l.id !== lectureId);
    const summary = `Deleted lecture: ${lecture.subjectCode} (${lecture.subject}) from ${lecture.day} ${lecture.startTime}`;
    const newVersion = this.updateLectures([...this.lectures], actorId, actorName, summary);

    return { success: true, version: newVersion };
  }

  public addExtraLecture(extra: Omit<ExtraLecture, 'id' | 'createdAt'>): {
    extraLecture: ExtraLecture;
    affectedPermissions: ExitPermission[];
    unaffectedPermissions: ExitPermission[];
  } {
    const id = `ext_lec_${Date.now()}`;
    const fullExtra: ExtraLecture = {
      ...extra,
      id,
      createdAt: new Date().toISOString(),
    };
    this.extraLectures.push(fullExtra);

    // Also add to active lectures for today/schedule matching
    const dayOfWeek = new Date(extra.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() as any;
    this.lectures.push({
      id: `lec_extra_${Date.now()}`,
      day: dayOfWeek || 'MON',
      startTime: extra.startTime,
      endTime: extra.endTime,
      subject: `[EXTRA] ${extra.subject}`,
      subjectCode: 'EXTRA',
      facultyId: extra.facultyId,
      facultyName: extra.facultyName,
      room: extra.room,
      department: 'Computer Science & Engineering',
      semester: 4,
      isExtra: true,
    });

    // Conflict Resolution Engine Trigger!
    const { affected, unaffected } = this.evaluateExtraLectureConflicts(fullExtra);

    this.addAuditLog({
      actorId: extra.facultyId,
      actorName: extra.facultyName,
      actorRole: 'FACULTY',
      action: 'EXTRA_LECTURE_ADD',
      target: `${extra.subject} (${extra.startTime}-${extra.endTime})`,
      result: 'SUCCESS',
      reason: `Created extra lecture for ${extra.classBatch}. Affected ${affected.length} conditional exit passes.`,
    });

    return {
      extraLecture: fullExtra,
      affectedPermissions: affected,
      unaffectedPermissions: unaffected,
    };
  }

  // CONFLICT RESOLUTION ENGINE
  private evaluateExtraLectureConflicts(extra: ExtraLecture): {
    affected: ExitPermission[];
    unaffected: ExitPermission[];
  } {
    const affected: ExitPermission[] = [];
    const unaffected: ExitPermission[] = [];

    const extraStartSec = this.timeToMinutes(extra.startTime);
    const extraEndSec = this.timeToMinutes(extra.endTime);

    // Look at all active permissions for today
    this.permissions.forEach((perm) => {
      if (perm.status !== 'APPROVED_CONDITIONAL' && perm.status !== 'APPROVED_LOCKED') {
        return; // ignore rejected, already used, or revoked
      }

      // Check time overlap
      const permStart = new Date(perm.validFrom);
      const permEnd = new Date(perm.validUntil);
      const permStartMins = permStart.getHours() * 60 + permStart.getMinutes();
      const permEndMins = permEnd.getHours() * 60 + permEnd.getMinutes();

      const overlaps = Math.max(permStartMins, extraStartSec) < Math.min(permEndMins, extraEndSec);

      if (overlaps) {
        if (perm.permissionType === 'CONDITIONAL') {
          // REVOKE CONDITIONAL PERMISSION
          perm.status = 'REVOKED';
          perm.revocationReason = `Extra lecture added: ${extra.subject} (${extra.startTime}-${extra.endTime}) by ${extra.facultyName}`;
          perm.revokedAt = new Date().toISOString();

          // Update linked application
          const app = this.applications.get(perm.applicationId);
          if (app) {
            app.status = 'REVOKED';
          }

          // Mark QR token invalid
          const qr = Array.from(this.qrTokens.values()).find((q) => q.permissionId === perm.id);
          if (qr) {
            qr.isUsed = true; // prevent reuse
          }

          affected.push(perm);

          // Notify student
          this.addNotification({
            userId: perm.studentId,
            userRole: 'STUDENT',
            title: 'PASS REVOKED — Timetable Conflict',
            message: `An extra lecture (${extra.subject}, ${extra.startTime}–${extra.endTime}) was scheduled by ${extra.facultyName}. Your conditional pass ${app?.id || perm.id} has been automatically revoked.`,
            type: 'ERROR',
            category: 'REVOCATION',
            read: false,
            link: '/student/passes',
          });
        } else {
          // LOCKED PERMISSION REMAINS VALID
          unaffected.push(perm);

          const app = this.applications.get(perm.applicationId);
          // Notify student that their pass is protected
          this.addNotification({
            userId: perm.studentId,
            userRole: 'STUDENT',
            title: 'Pass Protected (Locked Status)',
            message: `An extra lecture (${extra.subject}) was scheduled, but your pass ${app?.id || perm.id} is LOCKED (Protected) and remains fully valid.`,
            type: 'INFO',
            category: 'APPLICATION',
            read: false,
            link: '/student/passes',
          });
        }
      }
    });

    return { affected, unaffected };
  }

  // --- APPLICATIONS ---
  public getApplications(): ExitApplication[] {
    return Array.from(this.applications.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  public getApplicationById(id: string): ExitApplication | undefined {
    return this.applications.get(id);
  }

  public createApplication(appData: Omit<ExitApplication, 'id' | 'submittedAt' | 'status'>): ExitApplication {
    const nextNum = 10480 + this.applications.size + 1;
    const id = `EXQ-${nextNum}`;
    const newApp: ExitApplication = {
      ...appData,
      id,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
    };
    this.applications.set(id, newApp);

    // Notify HOD
    this.addNotification({
      userId: SEED_HOD.id,
      userRole: 'HOD',
      title: 'New Exit Request Submitted',
      message: `${newApp.studentName} (${newApp.studentRoll}) submitted exit request ${id} for ${newApp.reasonCategory}.`,
      type: 'INFO',
      category: 'APPLICATION',
      read: false,
      link: `/hod/applications/${id}`,
    });

    this.addAuditLog({
      actorId: newApp.studentId,
      actorName: newApp.studentName,
      actorRole: 'STUDENT',
      action: 'APPLICATION_SUBMIT',
      target: id,
      result: 'SUCCESS',
      reason: `Reason: ${newApp.reasonCategory} - ${newApp.reasonDescription}`,
    });

    return newApp;
  }

  public evaluateApplication(
    appId: string,
    action: 'REJECT' | 'GRANT_CONDITIONAL' | 'GRANT_LOCKED',
    hodUser: User,
    remark?: string,
    rejectionReason?: string
  ): { application: ExitApplication; permission?: ExitPermission; qrToken?: QRToken } {
    const app = this.applications.get(appId);
    if (!app) throw new Error(`Application ${appId} not found`);

    if (action === 'REJECT') {
      app.status = 'REJECTED';
      app.rejectedReason = rejectionReason || 'Request denied by HOD.';
      app.hodRemark = remark;

      const student = this.students.get(app.studentId);
      if (student) student.rejectedExits += 1;

      this.addNotification({
        userId: app.studentId,
        userRole: 'STUDENT',
        title: 'Exit Request Rejected',
        message: `Your application ${app.id} was rejected by ${hodUser.name}. Reason: ${app.rejectedReason}`,
        type: 'ERROR',
        category: 'APPLICATION',
        read: false,
        link: `/student/applications`,
      });

      this.addAuditLog({
        actorId: hodUser.id,
        actorName: hodUser.name,
        actorRole: 'HOD',
        action: 'APPLICATION_REJECT',
        target: app.id,
        result: 'SUCCESS',
        reason: app.rejectedReason,
      });

      return { application: app };
    }

    // GRANT_CONDITIONAL or GRANT_LOCKED
    const permType: PermissionType = action === 'GRANT_LOCKED' ? 'LOCKED' : 'CONDITIONAL';
    app.status = permType === 'LOCKED' ? 'APPROVED_LOCKED' : 'APPROVED_CONDITIONAL';
    app.permissionType = permType;
    app.hodRemark = remark;

    const student = this.students.get(app.studentId);
    if (student) student.approvedExits += 1;

    // Create Permission
    const permId = `PERM-${app.id.replace('EXQ-', '')}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const validFrom = `${todayStr}T${app.exitTime}:00.000Z`;
    const validUntil = `${todayStr}T${app.expectedReturnTime}:00.000Z`;

    // Create QR Token
    const qrId = `qr_tok_${Date.now()}`;
    const tokenStr = `exq_tok_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const newQR: QRToken = {
      id: qrId,
      token: tokenStr,
      permissionId: permId,
      applicationId: app.id,
      studentId: app.studentId,
      studentName: app.studentName,
      expiresAt: validUntil,
      isUsed: false,
    };
    this.qrTokens.set(qrId, newQR);

    const newPerm: ExitPermission = {
      id: permId,
      applicationId: app.id,
      studentId: app.studentId,
      permissionType: permType,
      validFrom,
      validUntil,
      status: app.status,
      hodRemark: remark,
      groupCount: (app.accompanyingCount || 0) + 1,
      accompanyingStudentNames: app.accompanyingStudentNames || [],
      qrTokenId: qrId,
    };
    this.permissions.set(permId, newPerm);

    // Notify Student
    this.addNotification({
      userId: app.studentId,
      userRole: 'STUDENT',
      title: `Exit Pass Issued (${permType})`,
      message: `Your application ${app.id} was granted as ${permType}. Your QR pass is ready in your inbox.`,
      type: 'SUCCESS',
      category: 'APPLICATION',
      read: false,
      link: '/student/passes',
    });

    this.addAuditLog({
      actorId: hodUser.id,
      actorName: hodUser.name,
      actorRole: 'HOD',
      action: permType === 'LOCKED' ? 'APPLICATION_GRANT_LOCKED' : 'APPLICATION_GRANT_CONDITIONAL',
      target: app.id,
      result: 'SUCCESS',
      reason: remark || `Granted as ${permType}`,
    });

    return { application: app, permission: newPerm, qrToken: newQR };
  }

  // --- PERMISSIONS & QR ---
  public getPermissions(): ExitPermission[] {
    return Array.from(this.permissions.values());
  }

  public getPermissionById(id: string): ExitPermission | undefined {
    return this.permissions.get(id);
  }

  public getQRTokenByValue(token: string): QRToken | undefined {
    return Array.from(this.qrTokens.values()).find((q) => q.token === token);
  }

  public getQRTokenById(id: string): QRToken | undefined {
    return this.qrTokens.get(id);
  }

  public getQRTokenByApplicationId(appId: string): QRToken | undefined {
    return Array.from(this.qrTokens.values()).find((q) => q.applicationId === appId);
  }

  public markQRUsed(qrId: string, guardUser: User, gateName: string = 'Gate 1'): {
    permission: ExitPermission;
    student: Student;
  } {
    const qr = this.qrTokens.get(qrId);
    if (!qr) throw new Error('QR Token not found');
    qr.isUsed = true;
    qr.usedAt = new Date().toISOString();

    const perm = this.permissions.get(qr.permissionId);
    if (!perm) throw new Error('Permission not found');
    perm.status = 'USED';
    perm.exitTimestamp = new Date().toISOString();

    const student = this.students.get(perm.studentId);
    if (student) {
      student.isOutside = true;
    }

    const app = this.applications.get(perm.applicationId);
    if (app) {
      app.status = 'USED';
    }

    // Notifications
    this.addNotification({
      userId: perm.studentId,
      userRole: 'STUDENT',
      title: 'Gate Exit Recorded',
      message: `Exit verified at ${gateName} by ${guardUser.name}. System recorded exit status.`,
      type: 'INFO',
      category: 'GATE_ACTIVITY',
      read: false,
    });

    this.addAuditLog({
      actorId: guardUser.id,
      actorName: guardUser.name,
      actorRole: 'GUARD',
      action: 'GATE_SCAN_EXIT',
      target: `${app?.id || perm.id} (${student?.name})`,
      result: 'SUCCESS',
      reason: `Verified at ${gateName}. Student marked OUTSIDE campus.`,
    });

    return { permission: perm, student: student! };
  }

  public recordReturn(studentId: string, guardUser: User, gateName: string = 'Gate 1'): Student {
    const student = this.students.get(studentId);
    if (!student) throw new Error('Student not found');
    student.isOutside = false;

    // Find active permission
    const perm = Array.from(this.permissions.values()).find(
      (p) => p.studentId === studentId && (p.status === 'USED' || p.exitTimestamp) && !p.returnTimestamp
    );
    if (perm) {
      perm.returnTimestamp = new Date().toISOString();
    }

    this.addNotification({
      userId: student.id,
      userRole: 'STUDENT',
      title: 'Return to Campus Recorded',
      message: `Return verified at ${gateName} by ${guardUser.name}. Status updated to INSIDE campus.`,
      type: 'SUCCESS',
      category: 'GATE_ACTIVITY',
      read: false,
    });

    this.addAuditLog({
      actorId: guardUser.id,
      actorName: guardUser.name,
      actorRole: 'GUARD',
      action: 'GATE_RECORD_RETURN',
      target: `${student.name} (${student.studentId})`,
      result: 'SUCCESS',
      reason: `Return recorded at ${gateName}. Student marked INSIDE campus.`,
    });

    return student;
  }

  // --- NOTIFICATIONS & AUDIT ---
  public getNotifications(userId: string): Notification[] {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
  }

  public addNotification(n: Omit<Notification, 'id' | 'createdAt'>) {
    const notif: Notification = {
      ...n,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }

  // Helper
  private timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }
}

// Global Singleton for Next.js dev server hot reloading
const globalForExitQ = globalThis as unknown as { exitQStore: ExitQStore };
export const store = globalForExitQ.exitQStore || new ExitQStore();
if (process.env.NODE_ENV !== 'production') globalForExitQ.exitQStore = store;
