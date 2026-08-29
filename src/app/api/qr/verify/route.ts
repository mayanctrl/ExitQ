import { NextResponse } from 'next/server';
import { evaluateExit } from '@/lib/decision-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, gateName, simulatedTime } = body;

    const result = evaluateExit({
      qrTokenOrAppId: token,
      guardLocation: { lat: 18.5204, lng: 73.8567, gateName: gateName || 'Gate 1 (Main Entrance)' },
      simulatedTime,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ allowed: false, reason: error.message, checks: [] }, { status: 400 });
  }
}
