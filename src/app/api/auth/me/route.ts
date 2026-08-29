import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/exitq_user_id=([^;]+)/);
  const userId = match ? match[1] : undefined;

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = store.getUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user });
}
