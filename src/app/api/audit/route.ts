import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const auditLogs = store.getAuditLogs();
  return NextResponse.json({ auditLogs });
}
