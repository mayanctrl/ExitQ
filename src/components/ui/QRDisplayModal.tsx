'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ExitApplication, ExitPermission, QRToken } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, Clock, Calendar, AlertCircle, X, Download, UserCheck } from 'lucide-react';

interface QRDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ExitApplication;
  permission?: ExitPermission;
  qrToken?: QRToken;
}

export const QRDisplayModal: React.FC<QRDisplayModalProps> = ({
  isOpen,
  onClose,
  application,
  permission,
  qrToken,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && qrToken) {
      // Draw QR code onto canvas
      QRCode.toCanvas(
        canvasRef.current,
        qrToken.token,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#344e41',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR generation error:', error);
        }
      );
    }
  }, [isOpen, qrToken]);

  if (!isOpen) return null;

  const isRevoked = application.status === 'REVOKED' || permission?.status === 'REVOKED';
  const isUsed = application.status === 'USED' || qrToken?.isUsed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full border border-[#e2dfd5] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#344e41] text-[#dad7cd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#a3b18a]" />
            <div>
              <div className="font-bold text-sm text-white">ExitQ Pass Verification</div>
              <div className="text-[10px] text-[#a3b18a]">Single-Use Gate Authorization</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#3a5a40] text-gray-300 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          {/* Status badge */}
          <div className="flex justify-center">
            <StatusBadge status={application.status} permissionType={application.permissionType} size="lg" />
          </div>

          {/* Revoked Warning Banner */}
          {isRevoked && (
            <div className="p-3 bg-[#ffebee] border border-[#ffcdd2] rounded-xl text-left text-xs space-y-1">
              <div className="font-bold text-[#c62828] flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                PASS REVOKED
              </div>
              <p className="text-[11px] text-[#b71c1c] leading-snug">
                {permission?.revocationReason || 'Revoked due to faculty scheduling an extra lecture.'}
              </p>
            </div>
          )}

          {/* Used Warning Banner */}
          {isUsed && !isRevoked && (
            <div className="p-3 bg-[#f5f5f5] border border-[#e0e0e0] rounded-xl text-left text-xs space-y-1">
              <div className="font-bold text-[#616161] flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                PASS ALREADY USED
              </div>
              <p className="text-[11px] text-gray-600">
                This QR pass was verified at gate exit on {qrToken?.usedAt ? new Date(qrToken.usedAt).toLocaleTimeString() : 'today'}.
              </p>
            </div>
          )}

          {/* Canvas QR Code Display */}
          <div className="relative inline-block p-3 bg-white border-2 border-[#e2dfd5] rounded-2xl shadow-sm">
            <canvas ref={canvasRef} className="mx-auto rounded-lg" />
            {isRevoked && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-4">
                <X className="h-12 w-12 text-[#c62828] mb-1" />
                <span className="font-extrabold text-[#c62828] text-sm uppercase">PASS REVOKED</span>
                <span className="text-[10px] text-gray-500 text-center mt-1">Do not present at campus gate</span>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="bg-[#fafaf7] p-3 rounded-2xl border border-[#e2dfd5] text-left text-xs space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2dfd5]">
              <span className="text-gray-500 font-medium">Application ID:</span>
              <span className="font-bold text-[#344e41]">{application.id}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#e2dfd5]">
              <span className="text-gray-500 font-medium">Student:</span>
              <span className="font-bold text-[#344e41]">{application.studentName} ({application.studentRoll})</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#e2dfd5]">
              <span className="text-gray-500 font-medium">Valid Time Window:</span>
              <span className="font-bold text-[#344e41]">{application.exitTime} – {application.expectedReturnTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Accompanying Group:</span>
              <span className="font-bold text-[#344e41]">{(application.accompanyingCount || 0) + 1} Student(s)</span>
            </div>
            {application.hodRemark && (
              <div className="pt-2 border-t border-[#e2dfd5]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">HOD Remark:</span>
                <p className="text-gray-700 italic mt-0.5">"{application.hodRemark}"</p>
              </div>
            )}
          </div>

          {/* Token String snippet */}
          <div className="text-[10px] text-gray-400 font-mono tracking-wider truncate">
            TOKEN: {qrToken?.token || 'EXQ-SECURE-TOKEN-REF'}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fafaf7] border-t border-[#e2dfd5] text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#344e41] text-[#dad7cd] font-semibold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors cursor-pointer"
          >
            Close Pass
          </button>
        </div>
      </div>
    </div>
  );
};
