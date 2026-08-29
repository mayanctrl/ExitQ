import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrId, guardUserId, gateName } = body;

    const guardUser = store.getUserById(guardUserId) || store.getUserById('usr_grd_1')!;
    const result = store.markQRUsed(qrId, guardUser, gateName || 'Gate 1');

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
