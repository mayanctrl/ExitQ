import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const user = store.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({ user });
    response.cookies.set('exitq_user_id', user.id, {
      httpOnly: false, // allow demo UI access
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
