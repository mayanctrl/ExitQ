import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ notifications: [] });
  }

  const notifications = store.getNotifications(userId);
  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId } = body;
    store.markNotificationRead(notificationId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
