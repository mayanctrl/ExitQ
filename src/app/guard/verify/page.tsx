'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { VerificationResult } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  Clock,
  MapPin,
  ArrowLeft,
  AlertTriangle,
  QrCode,
  LogOut,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetch('/api/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, gateName: 'Gate 1 (Main Entrance)' }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleRecordExit = () => {
    if (!result?.permission?.qrTokenId) return;
    setRecording(true);

    fetch('/api/gate/exit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qrId: result.permission.qrTokenId,
        guardUserId: 'usr_grd_1',
        gateName: 'Gate 1',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecording(false);
        if (data.success) {
          setActionSuccess('STUDENT EXIT RECORDED SUCCESSFULLY! Student marked OUTSIDE campus.');
        }
      });
  };

  const handleRecordReturn = () => {
    if (!result?.student?.id) return;
    setRecording(true);

    fetch('/api/gate/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: result.student.id,
        guardUserId: 'usr_grd_1',
        gateName: 'Gate 1',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecording(false);
        if (data.success) {
          setActionSuccess('STUDENT RETURN RECORDED SUCCESSFULLY! Student marked INSIDE campus.');
        }
      });
  };

  if (loading) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="h-10 w-10 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[#344e41]">Running ExitQ Authorization Checks...</p>
        <p className="text-[11px] text-gray-400">Evaluating timetable, geofence, and token validity</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#e2dfd5] text-center space-y-4 max-w-md mx-auto my-8">
        <AlertTriangle className="h-10 w-10 text-[#c62828] mx-auto" />
        <h2 className="text-lg font-bold text-[#344e41]">No Scan Reference</h2>
        <p className="text-xs text-gray-500">Please scan a valid ExitQ QR pass or enter an Application ID.</p>
        <Link
          href="/guard"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#344e41] text-[#dad7cd] text-xs font-bold rounded-xl"
        >
          ← Return to Scanner
        </Link>
      </div>
    );
  }

  const { allowed, reason, permission, application, student, checks } = result;

  return (
    <div className="space-y-6">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link href="/guard" className="inline-flex items-center gap-1 text-xs font-bold text-[#588157]">
          <ArrowLeft className="h-4 w-4" /> Scan Another Pass
        </Link>
        <span className="text-xs font-bold text-gray-400">Gate 1 Verification</span>
      </div>

      {/* Action Success Alert */}
      {actionSuccess && (
        <div className="p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-2xl text-xs font-extrabold text-[#2e7d32] flex items-center justify-between animate-in fade-in">
          <span>✓ {actionSuccess}</span>
          <button onClick={() => router.push('/guard')} className="text-xs text-[#2e7d32] underline">
            Scan Next →
          </button>
        </div>
      )}

      {/* BIG DECISION BANNER (Spec item 22) */}
      <div
        className={`p-6 rounded-3xl border-2 shadow-md text-white space-y-2 ${
          allowed
            ? 'bg-[#386641] border-[#2e7d32]'
            : 'bg-[#bc4749] border-[#9e2a2b]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {allowed ? (
              <CheckCircle2 className="h-10 w-10 text-[#dad7cd] shrink-0" />
            ) : (
              <XCircle className="h-10 w-10 text-white shrink-0" />
            )}
            <div>
              <h1 className="text-2xl font-black tracking-tight">{allowed ? 'ALLOW EXIT' : 'DENY EXIT'}</h1>
              <p className="text-xs opacity-90 font-medium mt-0.5">{reason}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Details & Pass Metadata */}
      {student && (
        <div className="bg-white p-5 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e2dfd5]">
            <div className="h-12 w-12 rounded-xl bg-[#344e41] text-[#dad7cd] font-bold flex items-center justify-center text-lg shadow-xs">
              {student.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#344e41] text-base">{student.name}</h3>
                <StatusBadge status={application?.status} permissionType={application?.permissionType} size="sm" />
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {student.studentId} • {student.department} (Sem {student.semester})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">HOD REMARK</span>
              <span className="font-bold text-[#344e41] italic">"{application?.hodRemark || 'None'}"</span>
            </div>
            <div className="p-2.5 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">AUTHORIZED GROUP</span>
              <span className="font-bold text-[#344e41]">{(application?.accompanyingCount || 0) + 1} Student(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Timetable & Verification Checklist (Spec item 22) */}
      <div className="bg-white p-5 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-[#344e41] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#588157]" /> Automatic System Verification Checklist
        </h3>

        <div className="space-y-2">
          {checks.map((chk, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                chk.passed ? 'bg-[#e8f5e9]/50 border-[#c8e6c9] text-[#2e7d32]' : 'bg-[#ffebee]/50 border-[#ffcdd2] text-[#c62828]'
              }`}
            >
              {chk.passed ? (
                <CheckCircle2 className="h-4 w-4 text-[#2e7d32] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-[#c62828] shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">{chk.name}</span>
                <span className="text-[11px] opacity-90">{chk.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: RECORD EXIT vs RECORD RETURN */}
      {allowed && !actionSuccess && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleRecordExit}
            disabled={recording}
            className="py-4 bg-[#588157] text-white font-extrabold text-sm rounded-2xl hover:bg-[#3a5a40] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-5 w-5" /> RECORD GATE EXIT
          </button>
          <button
            onClick={handleRecordReturn}
            disabled={recording}
            className="py-4 bg-[#344e41] text-[#dad7cd] font-extrabold text-sm rounded-2xl hover:bg-[#3a5a40] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="h-5 w-5" /> RECORD RETURN
          </button>
        </div>
      )}
    </div>
  );
}

export default function GuardVerifyPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-bold text-[#344e41]">Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
