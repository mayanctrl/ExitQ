'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Search, AlertCircle, Camera, CheckCircle2 } from 'lucide-react';

interface QRScannerProps {
  onScanResult: (tokenOrId: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanResult }) => {
  const [manualInput, setManualInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (cameraActive) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear();
          setCameraActive(false);
          onScanResult(decodedText);
        },
        (error) => {
          // ignore scan frame errors
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [cameraActive, onScanResult]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanResult(manualInput.trim());
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-sm space-y-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex p-3 rounded-2xl bg-[#588157]/10 text-[#3a5a40] mb-1">
          <QrCode className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-[#344e41]">Scan ExitQ Gate Pass</h2>
        <p className="text-xs text-gray-500">Hold QR code inside frame or enter Application ID</p>
      </div>

      {/* Camera View / Toggle */}
      <div className="space-y-3">
        {cameraActive ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#588157] bg-black">
            <div id="reader" className="w-full" />
            <button
              onClick={() => setCameraActive(false)}
              className="mt-2 w-full py-2 bg-gray-800 text-white font-semibold text-xs rounded-xl hover:bg-gray-700"
            >
              Close Camera
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCameraActive(true)}
            className="w-full py-4 bg-[#344e41] text-[#dad7cd] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-[#3a5a40] transition-colors shadow-sm cursor-pointer"
          >
            <Camera className="h-5 w-5 text-[#a3b18a]" />
            Activate Camera Scanner
          </button>
        )}
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-[#e2dfd5]"></div>
        <span className="flex-shrink mx-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          OR MANUAL ID ENTRY
        </span>
        <div className="flex-grow border-t border-[#e2dfd5]"></div>
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Application ID (e.g. EXQ-10495)"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-semibold text-[#344e41] placeholder:text-gray-400 focus:outline-none focus:border-[#588157]"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
        </div>
        <button
          type="submit"
          disabled={!manualInput.trim()}
          className="px-4 py-2.5 bg-[#588157] text-white font-bold text-xs rounded-xl hover:bg-[#3a5a40] disabled:opacity-50 transition-colors cursor-pointer"
        >
          Verify
        </button>
      </form>

      {/* Quick Demo Pre-sets */}
      <div className="p-3 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
          ⚡ Hackathon Quick Demo Tokens
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onScanResult('EXQ-10495')}
            className="p-2 bg-white rounded-xl border border-[#e2dfd5] text-left hover:border-[#588157] transition-all cursor-pointer"
          >
            <div className="font-bold text-[#344e41] text-[11px]">EXQ-10495</div>
            <div className="text-[10px] text-[#2e7d32]">Conditional Pass (Aarav)</div>
          </button>

          <button
            onClick={() => onScanResult('EXQ-10496')}
            className="p-2 bg-white rounded-xl border border-[#e2dfd5] text-left hover:border-[#1a237e] transition-all cursor-pointer"
          >
            <div className="font-bold text-[#344e41] text-[11px]">EXQ-10496</div>
            <div className="text-[10px] text-[#1a237e]">Locked Pass (Ananya)</div>
          </button>

          <button
            onClick={() => onScanResult('EXQ-10490')}
            className="p-2 bg-white rounded-xl border border-[#e2dfd5] text-left hover:border-gray-400 transition-all cursor-pointer"
          >
            <div className="font-bold text-[#344e41] text-[11px]">EXQ-10490</div>
            <div className="text-[10px] text-gray-500">Already Used Pass</div>
          </button>

          <button
            onClick={() => onScanResult('EXQ-INVALID-99')}
            className="p-2 bg-white rounded-xl border border-[#e2dfd5] text-left hover:border-[#c62828] transition-all cursor-pointer"
          >
            <div className="font-bold text-[#344e41] text-[11px]">EXQ-INVALID</div>
            <div className="text-[10px] text-[#c62828]">Invalid Reference</div>
          </button>
        </div>
      </div>
    </div>
  );
};
