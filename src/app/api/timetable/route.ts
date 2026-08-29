import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day') || undefined;
  const sem = parseInt(searchParams.get('semester') || '4', 10);

  const lectures = store.getLectures(day, sem);
  const extraLectures = store.getExtraLectures();
  const versions = store.getTimetableVersions();

  return NextResponse.json({
    lectures,
    extraLectures,
    currentVersion: versions[0],
    versions,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lecture, lectures, actorId, actorName, summary } = body;

    // Single lecture addition
    if (lecture) {
      const result = store.addLecture(
        lecture,
        actorId || 'usr_hod_1',
        actorName || 'Dr. Ananya Sharma'
      );
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 409 });
      }
      return NextResponse.json({
        success: true,
        lecture: result.lecture,
        version: result.version,
        lectures: store.getLectures(),
      });
    }

    // Bulk / OCR update
    if (lectures) {
      const version = store.updateLectures(
        lectures,
        actorId || 'usr_hod_1',
        actorName || 'Dr. Ananya Sharma',
        summary || 'Timetable modified'
      );
      return NextResponse.json({ success: true, version, lectures: store.getLectures() });
    }

    return NextResponse.json({ error: 'Missing lecture or lectures payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lectureId = searchParams.get('lectureId');
    const actorId = searchParams.get('actorId') || 'usr_hod_1';
    const actorName = searchParams.get('actorName') || 'Dr. Ananya Sharma';

    if (!lectureId) {
      return NextResponse.json({ error: 'Missing lectureId parameter' }, { status: 400 });
    }

    const result = store.deleteLecture(lectureId, actorId, actorName);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      version: result.version,
      lectures: store.getLectures(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
