import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');

  if (applicationId) {
    const qrToken = store.getQRTokenByApplicationId(applicationId);
    if (!qrToken) {
      return NextResponse.json({ qrToken: null });
    }
    return NextResponse.json({ qrToken });
  }

  return NextResponse.json({ error: 'Missing applicationId query parameter' }, { status: 400 });
}
