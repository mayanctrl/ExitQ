import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, name, email, employeeId, department, phone, title, adminUserId } = body;

    if (!role || !name || !email || !employeeId) {
      return NextResponse.json(
        { error: 'Role, Name, Institutional Email, and Employee ID are required.' },
        { status: 400 }
      );
    }

    if (!['HOD', 'FACULTY', 'GUARD'].includes(role)) {
      return NextResponse.json(
        { error: 'Institutional account creation only supports HOD, FACULTY, or GUARD.' },
        { status: 400 }
      );
    }

    const existingUser = store.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const adminUser = adminUserId ? store.getUserById(adminUserId) : store.getUserByEmail('mayankhobragade.ee24@sbjit.edu.in');
    const admin = adminUser || {
      id: 'usr_admin_1',
      name: 'Administrator',
      email: 'mayankhobragade.ee24@sbjit.edu.in',
      role: 'HOD' as const,
      department: 'Computer Science & Engineering',
    };

    const { user, generatedPassword } = store.createInstitutionalAccount(
      {
        role,
        name,
        email,
        employeeId,
        department,
        phone,
        title,
      },
      admin
    );

    return NextResponse.json(
      {
        success: true,
        user,
        generatedPassword,
        message: 'Credentials sent to institutional email.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Account creation failed' }, { status: 500 });
  }
}
