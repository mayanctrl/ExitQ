import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = store.getApplicationById(id.toUpperCase().trim());

  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const student = store.getStudentById(app.studentId);
  const studentHistory = store.getApplications().filter((a) => a.studentId === app.studentId && a.id !== app.id);
  const permission = store.getPermissions().find((p) => p.applicationId === app.id);
  const qrToken = store.getQRTokenByApplicationId(app.id);

  return NextResponse.json({
    application: app,
    student,
    studentHistory,
    permission,
    qrToken,
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, hodUserId, remark, rejectionReason } = body;

    const hodUser = store.getUserById(hodUserId) || store.getUserById('usr_hod_1')!;

    const result = store.evaluateApplication(
      id.toUpperCase().trim(),
      action as 'REJECT' | 'GRANT_CONDITIONAL' | 'GRANT_LOCKED',
      hodUser,
      remark,
      rejectionReason
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
