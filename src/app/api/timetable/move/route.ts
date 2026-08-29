import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lectureId, targetDay, targetStartTime, targetEndTime, actorId, actorName, semester } = body;

    if (!lectureId || !targetDay || !targetStartTime || !targetEndTime) {
      return NextResponse.json(
        { error: 'Missing lectureId, targetDay, targetStartTime, or targetEndTime' },
        { status: 400 }
      );
    }

    const result = store.moveLecture(
      lectureId,
      targetDay,
      targetStartTime,
      targetEndTime,
      actorId || 'usr_hod_1',
      actorName || 'Dr. Ananya Sharma',
      semester || 4
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      version: result.version,
      affectedPermissions: result.affectedPermissions,
      lectures: store.getLectures(undefined, semester || 4),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to move lecture' }, { status: 500 });
  }
}
