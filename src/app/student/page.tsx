'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication } from '@/lib/types';
import { SEED_STUDENTS } from '@/lib/seed';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BookOpen, Send, Ticket, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const student = SEED_STUDENTS[0];
  const [applications, setApplications] = useState<ExitApplication[]>([]);

  useEffect(() => {
    fetch(`/api/applications?studentId=${student.id}`)
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));
  }, []);

  const latestApp = applications[0];

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#588157] uppercase tracking-wider">
            STUDENT PORTAL
          </span>
          <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight mt-0.5">
            Welcome, {student.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {student.studentId} • {student.department} (Sem {student.semester})
          </p>
        </div>

        <Link
          href="/student/request"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#588157] text-white font-extrabold text-xs rounded-2xl hover:bg-[#3a5a40] transition-colors shadow-xs"
        >
          <Send className="h-4 w-4" /> Request Exit Pass →
        </Link>
      </div>

      {/* Timetable Cards (Current & Next Class) (Spec item 25) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CURRENT TIME SLOT (2:00 PM)</span>
          <div className="flex items-center gap-2 text-[#2e7d32] font-extrabold text-base">
            <Clock className="h-5 w-5" /> FREE / LAB BREAK
          </div>
          <p className="text-xs text-gray-500">No scheduled lecture in master timetable for 2:00 PM - 3:00 PM</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">NEXT CLASS</span>
          <div className="font-extrabold text-[#344e41] text-base">Software Engineering (SE)</div>
          <p className="text-xs text-gray-500">3:00 PM – 4:00 PM • Room 302 (Prof. Vikram Patel)</p>
        </div>
      </div>

      {/* Exit Pass Status Box */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#344e41] uppercase tracking-wider flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[#588157]" /> Current Gate Pass Status
          </h2>
          <Link href="/student/passes" className="text-xs font-bold text-[#588157] hover:underline">
            View My Inbox →
          </Link>
        </div>

        {!latestApp ? (
          <div className="text-center py-8 border border-dashed border-[#e2dfd5] rounded-2xl">
            <Ticket className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#344e41]">No active exit request</p>
            <p className="text-[11px] text-gray-400">You haven't requested permission to leave campus today.</p>
          </div>
        ) : (
          <div className="p-4 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm text-[#344e41]">{latestApp.id} • {latestApp.reasonCategory}</div>
                <div className="text-xs text-gray-500">Valid: {latestApp.exitTime} – {latestApp.expectedReturnTime}</div>
              </div>
              <StatusBadge status={latestApp.status} permissionType={latestApp.permissionType} />
            </div>

            <div className="pt-2 border-t border-[#e2dfd5] flex items-center justify-between text-xs">
              <span className="text-gray-500">{latestApp.destination}</span>
              <Link href="/student/passes" className="font-bold text-[#588157] flex items-center gap-1">
                Open Pass QR →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
