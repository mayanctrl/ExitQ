'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExitApplication, Student, ExitPermission, QRToken } from '@/lib/types';
import { StudentContextPanel } from '@/components/ui/StudentContextPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailReviewPage() {
  const params = useParams();
  const router = useRouter();
  const appId = (params.id as string).toUpperCase();

  const [application, setApplication] = useState<ExitApplication | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [studentHistory, setStudentHistory] = useState<ExitApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Approval / Rejection
  const [hodRemark, setHodRemark] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${appId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.application) {
          setApplication(data.application);
          setStudent(data.student || null);
          setStudentHistory(data.studentHistory || []);
          if (data.application.hodRemark) setHodRemark(data.application.hodRemark);
        }
        setLoading(false);
      });
  }, [appId]);

  const handleDecision = (action: 'REJECT' | 'GRANT_CONDITIONAL' | 'GRANT_LOCKED') => {
    setActionLoading(true);

    fetch(`/api/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        hodUserId: 'usr_hod_1',
        remark: hodRemark,
        rejectionReason: action === 'REJECT' ? rejectionReason || 'Denied by HOD' : undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setActionLoading(false);
        if (data.application) {
          setApplication(data.application);
          router.refresh();
        }
      });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="h-8 w-8 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#344e41]">Loading application details...</p>
      </div>
    );
  }

  if (!application || !student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#e2dfd5] text-center space-y-4 max-w-md mx-auto my-12">
        <AlertTriangle className="h-10 w-10 text-[#c62828] mx-auto" />
        <h2 className="text-lg font-bold text-[#344e41]">Application Not Found</h2>
        <p className="text-xs text-gray-500">No exit application found with ID {appId}</p>
        <Link
          href="/hod/applications"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#344e41] text-[#dad7cd] text-xs font-bold rounded-xl"
        >
          ← Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/hod/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#588157] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Applications List
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">Current Status:</span>
          <StatusBadge status={application.status} permissionType={application.permissionType} />
        </div>
      </div>

      {/* Main Review Grid: Left Application Details & Actions, Right Student Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Application Details & HOD Decision Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-[#e2dfd5]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#588157]">
                  EXIT APPLICATION REVIEW
                </span>
                <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">{application.id}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Submitted {new Date(application.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {application.date}
                </p>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">REASON CATEGORY</span>
                <span className="font-bold text-[#344e41] text-sm">{application.reasonCategory}</span>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">{application.reasonDescription}</p>
              </div>

              <div className="p-3 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">DESTINATION</span>
                <span className="font-bold text-[#344e41] text-sm">{application.destination}</span>
                <p className="text-[11px] text-gray-500 mt-1">Verified Location Target</p>
              </div>

              <div className="p-3 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">TIME WINDOW</span>
                <span className="font-bold text-[#344e41] text-sm">
                  {application.exitTime} – {application.expectedReturnTime}
                </span>
                <p className="text-[11px] text-gray-500 mt-1">Date: {application.date}</p>
              </div>

              <div className="p-3 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">GROUP SIZE</span>
                <span className="font-bold text-[#344e41] text-sm">
                  {(application.accompanyingCount || 0) + 1} Student(s)
                </span>
                <p className="text-[11px] text-gray-500 mt-1">
                  Accompanying: {application.accompanyingStudentNames?.join(', ') || 'None'}
                </p>
              </div>
            </div>

            {/* HOD Remarks Field */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-[#344e41] block">
                HOD Official Remarks / Conditions:
              </label>
              <input
                type="text"
                placeholder="e.g. Approved for 2 students until 4:00 PM. Medical check mandatory."
                value={hodRemark}
                onChange={(e) => setHodRemark(e.target.value)}
                className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              />
            </div>

            {/* HOD 3 PRIMARY ACTIONS SECTION (Spec items 11 & 12) */}
            <div className="pt-4 border-t border-[#e2dfd5] space-y-4">
              <h3 className="text-xs font-extrabold text-[#344e41] uppercase tracking-wider">
                AUTHORIZATION DECISION (SELECT ACTION)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* RED: REJECT */}
                <button
                  onClick={() => {
                    const r = prompt('Enter rejection reason:', 'Non-essential exit during lab hours');
                    if (r !== null) {
                      setRejectionReason(r);
                      handleDecision('REJECT');
                    }
                  }}
                  disabled={actionLoading}
                  className="p-3 bg-[#ffebee] border border-[#ffcdd2] text-[#c62828] rounded-2xl text-left hover:bg-[#ffcdd2]/50 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-extrabold text-xs">
                    <XCircle className="h-4 w-4" /> RED — REJECT
                  </div>
                  <p className="text-[10px] text-[#b71c1c] leading-tight">
                    Deny exit application. Require reason. Status set to REJECTED.
                  </p>
                </button>

                {/* GREEN: GRANT CONDITIONAL */}
                <button
                  onClick={() => handleDecision('GRANT_CONDITIONAL')}
                  disabled={actionLoading}
                  className="p-3 bg-[#e8f5e9] border border-[#c8e6c9] text-[#2e7d32] rounded-2xl text-left hover:bg-[#c8e6c9]/50 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-extrabold text-xs">
                    <CheckCircle2 className="h-4 w-4" /> GREEN — CONDITIONAL ⚡
                  </div>
                  <p className="text-[10px] text-[#1b5e20] leading-tight">
                    Default permission. Revoked automatically if extra lecture added.
                  </p>
                </button>

                {/* BLUE: GRANT LOCKED */}
                <button
                  onClick={() => handleDecision('GRANT_LOCKED')}
                  disabled={actionLoading}
                  className="p-3 bg-[#e8eaf6] border border-[#c5cae9] text-[#1a237e] rounded-2xl text-left hover:bg-[#c5cae9]/50 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-extrabold text-xs">
                    <Lock className="h-4 w-4" /> BLUE — LOCKED 🔒
                  </div>
                  <p className="text-[10px] text-[#0d47a1] leading-tight">
                    Protected permission. Resists extra lecture additions (Medical/Duty).
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Student Context Panel (5 cols) */}
        <div className="lg:col-span-5">
          <StudentContextPanel student={student} studentHistory={studentHistory} />
        </div>
      </div>
    </div>
  );
}
