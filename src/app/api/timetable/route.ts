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
    const { lectures, actorId, actorName, summary } = body;

    const version = store.updateLectures(
      lectures,
      actorId || 'usr_hod_1',
      actorName || 'Dr. Ananya Sharma',
      summary || 'Timetable modified'
    );

    return NextResponse.json({ version });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
