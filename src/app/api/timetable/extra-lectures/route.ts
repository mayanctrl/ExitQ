import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classBatch, date, startTime, endTime, subject, room, reason, facultyId, facultyName } = body;

    const result = store.addExtraLecture({
      classBatch: classBatch || 'CS-SEM4',
      date: date || new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      subject,
      room,
      reason,
      facultyId: facultyId || 'usr_fac_1',
      facultyName: facultyName || 'Prof. Rajesh Kumar',
    });

    return NextResponse.json({
      success: true,
      extraLecture: result.extraLecture,
      affectedPermissionsCount: result.affectedPermissions.length,
      unaffectedPermissionsCount: result.unaffectedPermissions.length,
      affectedPermissions: result.affectedPermissions,
      unaffectedPermissions: result.unaffectedPermissions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
