import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, guardUserId, gateName } = body;

    const guardUser = store.getUserById(guardUserId) || store.getUserById('usr_grd_1')!;
    const student = store.recordReturn(studentId, guardUser, gateName || 'Gate 1');

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
