'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication, Student, Lecture } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Send, Ticket, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function timeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<ExitApplication[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
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

          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const today = new Date();
          let dayName = days[today.getDay()] as string;
          if (dayName === 'SUN' || dayName === 'SAT') {
            dayName = 'MON';
          }

          fetch(`/api/timetable?day=${dayName}&semester=${studentUser.semester || 4}`)
            .then((res) => res.json())
            .then((ttData) => setLectures(ttData.lectures || []))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="h-8 w-8 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#344e41]">Loading Student Workspace...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#e2dfd5] text-center space-y-4 max-w-md mx-auto my-12">
        <p className="text-xs font-bold text-red-500">Not authenticated as a Student.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-[#344e41] text-white rounded-xl text-xs font-semibold">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const latestApp = applications[0];

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const currentLec = lectures.find((lec) => {
    const start = timeToMinutes(lec.startTime);
    const end = timeToMinutes(lec.endTime);
    return currentMinutes >= start && currentMinutes < end;
  });

  const nextLec = lectures
    .filter((lec) => timeToMinutes(lec.startTime) > currentMinutes)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0];

  const currentHourStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2dfd5]">
        <div>
          <h1 className="text-2xl font-black text-[#344e41] tracking-tight">
            Welcome, {student.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {student.studentId} • {student.department} (Semester {student.semester})
          </p>
        </div>

        <Link
          href="/student/request"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#588157] text-white font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors shadow-xs"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Request Exit Pass →</span>
        </Link>
      </div>

      {/* Timetable Slot Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            CURRENT TIME SLOT ({currentHourStr})
          </span>
          {currentLec ? (
            <>
              <div className="flex items-center gap-2 text-[#b78103] font-black text-sm">
                <Clock className="h-4 w-4" /> {currentLec.subject}
              </div>
              <p className="text-xs text-gray-500">
                {currentLec.startTime} – {currentLec.endTime} • Room {currentLec.room} ({currentLec.facultyName})
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#2e7d32] font-black text-sm">
                <Clock className="h-4 w-4" /> FREE / BREAK PERIOD
              </div>
              <p className="text-xs text-gray-500">No scheduled class currently in session</p>
            </>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">NEXT CLASS</span>
          {nextLec ? (
            <>
              <div className="font-bold text-[#344e41] text-sm">{nextLec.subject}</div>
              <p className="text-xs text-gray-500">
                {nextLec.startTime} – {nextLec.endTime} • Room {nextLec.room} ({nextLec.facultyName})
              </p>
            </>
          ) : (
            <>
              <div className="font-bold text-gray-400 text-sm">No more lectures today</div>
              <p className="text-xs text-gray-500">All scheduled master classes completed</p>
            </>
          )}
        </div>
      </div>

      {/* Exit Pass Status Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#344e41] uppercase tracking-wider flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[#588157]" /> Gate Pass Status
          </h2>
          <Link href="/student/passes" className="text-xs font-bold text-[#588157] hover:underline">
            View All Passes →
          </Link>
        </div>

        {!latestApp ? (
          <div className="text-center py-8 border border-dashed border-[#e2dfd5] rounded-xl text-xs text-gray-400">
            No active exit request found for today.
          </div>
        ) : (
          <div className="p-4 bg-[#fafaf7] rounded-xl border border-[#e2dfd5] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#344e41]">{latestApp.id} • {latestApp.reasonCategory}</div>
                <div className="text-xs text-gray-500">Time Window: {latestApp.exitTime} – {latestApp.expectedReturnTime}</div>
              </div>
              <StatusBadge status={latestApp.status} permissionType={latestApp.permissionType} />
            </div>

            <div className="pt-2 border-t border-[#e2dfd5] flex items-center justify-between text-xs">
              <span className="text-gray-500">{latestApp.destination}</span>
              {latestApp.status !== 'REJECTED' && latestApp.status !== 'PENDING' ? (
                <Link href="/student/passes" className="font-bold text-[#588157] flex items-center gap-1">
                  Open QR Pass →
                </Link>
              ) : (
                <span className="text-gray-400 italic">Pass unavailable</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
