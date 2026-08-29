'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication, Student } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CheckCircle2, Clock, FileCheck2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentApplicationsPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<ExitApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === 'STUDENT') {
          const studentUser = data.user as Student;
          setStudent(studentUser);

          fetch(`/api/applications?studentId=${studentUser.id}`)
            .then((res) => res.json())
            .then((appData) => setApplications(appData.applications || []));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="h-8 w-8 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#344e41]">Loading Student applications...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#e2dfd5] text-center space-y-4 max-w-md mx-auto my-12">
        <p className="text-xs font-bold text-red-500">Not authenticated as a Student.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-[#344e41] text-white rounded-xl text-xs">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">My Exit Applications & Timeline</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track application status lifecycle and HOD approvals</p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#e2dfd5] rounded-2xl bg-white">
            <p className="text-xs font-bold text-[#344e41]">No applications found</p>
            <p className="text-[11px] text-gray-400">You haven't submitted any exit requests yet.</p>
          </div>
        ) : (
          applications.map((app) => {
            const steps = [
              { label: 'Submitted', done: true },
              { label: 'Under Review', done: app.status !== 'PENDING' },
              { label: 'Approved', done: app.status.includes('APPROVED') || app.status === 'USED' },
              { label: 'QR Generated', done: app.status.includes('APPROVED') || app.status === 'USED' },
              { label: 'Exit Verified', done: app.status === 'USED' },
            ];

            return (
              <div key={app.id} className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-[#344e41] text-base">{app.id}</h3>
                    <p className="text-xs text-gray-500">{app.reasonCategory} • {app.destination}</p>
                  </div>
                  <StatusBadge status={app.status} permissionType={app.permissionType} />
                </div>

                {/* Status Timeline Bar (Spec item 26) */}
                <div className="py-2 border-t border-b border-[#e2dfd5]/60 flex items-center justify-between overflow-x-auto gap-2">
                  {steps.map((st, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 shrink-0 text-xs">
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          st.done ? 'bg-[#588157] text-white' : 'bg-gray-100 text-gray-400 border border-gray-300'
                        }`}
                      >
                        {st.done ? '✓' : idx + 1}
                      </div>
                      <span className={`font-semibold ${st.done ? 'text-[#344e41]' : 'text-gray-400'}`}>{st.label}</span>
                      {idx < steps.length - 1 && <span className="text-gray-300 ml-1">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
