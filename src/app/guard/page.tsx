'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner } from '@/components/ui/QRScanner';
import { ShieldCheck } from 'lucide-react';

export default function GuardScanPage() {
  const router = useRouter();

  const handleScanResult = (tokenOrId: string) => {
    router.push(`/guard/verify?token=${encodeURIComponent(tokenOrId)}`);
  };

  return (
    <div className="space-y-4 py-2">
      {/* Top Banner */}
      <div className="bg-[#344e41] text-[#dad7cd] p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#a3b18a]" />
          <div>
            <h1 className="font-black text-sm text-white uppercase tracking-wider">Gate 1 Scanner</h1>
            <p className="text-[11px] text-gray-300">Point camera at student QR pass or enter reference code</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#588157] text-white">
          VERIFIED
        </span>
      </div>

      {/* QR Scanner Component */}
      <QRScanner onScanResult={handleScanResult} />
    </div>
  );
}
