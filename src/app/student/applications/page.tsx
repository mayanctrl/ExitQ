'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication } from '@/lib/types';
import { SEED_STUDENTS } from '@/lib/seed';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CheckCircle2, Clock, FileCheck2, ArrowRight } from 'lucide-react';

export default function StudentApplicationsPage() {
  const student = SEED_STUDENTS[0];
  const [applications, setApplications] = useState<ExitApplication[]>([]);

  useEffect(() => {
    fetch(`/api/applications?studentId=${student.id}`)
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">My Exit Applications & Timeline</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track application status lifecycle and HOD approvals</p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => {
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
        })}
      </div>
    </div>
  );
}
