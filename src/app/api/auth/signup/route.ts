import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, studentId, email, password, department, semester } = body;

    if (!name || !studentId || !email || !password) {
      return NextResponse.json(
        { error: 'Name, Student ID, Email, and Password are required.' },
        { status: 400 }
      );
    }

    // Check if email or studentId already registered
    const existingEmail = store.getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const newStudent = store.registerStudent({
      name,
      studentId,
      email,
      password,
      department: department || 'Computer Science & Engineering',
      semester: Number(semester) || 4,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: newStudent,
        redirectUrl: '/student',
      },
      { status: 201 }
    );

    // Set auth cookie
    response.cookies.set('exitq_user_id', newStudent.id, {
      httpOnly: false,
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });

    response.cookies.set('exitq_role', 'STUDENT', {
      httpOnly: false,
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
  }
}
