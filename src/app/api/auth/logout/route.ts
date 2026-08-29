import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.cookies.delete('exitq_user_id');
  response.cookies.delete('exitq_role');
  response.cookies.delete('exitq_session');

  return response;
}
