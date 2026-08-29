import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');

  let perms = store.getPermissions();

  if (type && type !== 'ALL') {
    perms = perms.filter((p) => p.permissionType === type);
  }

  if (status && status !== 'ALL') {
    perms = perms.filter((p) => p.status === status);
  }

  return NextResponse.json({ permissions: perms });
}
