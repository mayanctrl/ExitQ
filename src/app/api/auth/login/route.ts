import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = store.validateCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const redirectMap: Record<string, string> = {
      HOD: '/hod',
      FACULTY: '/faculty',
      GUARD: '/guard',
      STUDENT: '/student',
    };

    const redirectUrl = redirectMap[user.role] || '/';

    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl,
    });

    // Authoritative session cookies
    response.cookies.set('exitq_user_id', user.id, {
      httpOnly: false,
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });

    response.cookies.set('exitq_role', user.role, {
      httpOnly: false,
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
