import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const studentId = searchParams.get('studentId');

  let apps = store.getApplications();

  if (status && status !== 'ALL') {
    apps = apps.filter((a) => a.status === status);
  }

  if (studentId) {
    apps = apps.filter((a) => a.studentId === studentId);
  }

  return NextResponse.json({ applications: apps });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApp = store.createApplication(body);
    return NextResponse.json({ application: newApp }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
