'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner } from '@/components/ui/QRScanner';
import { ShieldCheck, MapPin, CheckCircle2, QrCode } from 'lucide-react';

export default function GuardScanPage() {
  const router = useRouter();

  const handleScanResult = (tokenOrId: string) => {
    router.push(`/guard/verify?token=${encodeURIComponent(tokenOrId)}`);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-[#344e41] text-[#dad7cd] p-5 rounded-3xl space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#a3b18a]" />
            <span className="font-extrabold text-sm text-white uppercase tracking-wider">
              Gate 1 Security Verification
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#588157] text-white">
            GEOFENCE ACTIVE
          </span>
        </div>
        <p className="text-xs text-gray-300">
          Campus Main Gate • Verified Location Lat 18.5204, Lng 73.8567
        </p>
      </div>

      {/* QR Scanner Component */}
      <QRScanner onScanResult={handleScanResult} />
    </div>
  );
}
