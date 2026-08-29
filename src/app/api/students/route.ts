import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const students = store.getAllStudents();
  return NextResponse.json({ students });
}
