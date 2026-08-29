'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication, Student, Lecture } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BookOpen, Send, Ticket, Clock, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';
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
  const [isDemoDay, setIsDemoDay] = useState(false);

  useEffect(() => {
    // 1. Fetch current logged-in user
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === 'STUDENT') {
          const studentUser = data.user as Student;
          setStudent(studentUser);

          // 2. Fetch student's applications
          fetch(`/api/applications?studentId=${studentUser.id}`)
            .then((res) => res.json())
            .then((appData) => setApplications(appData.applications || []));

          // 3. Fetch timetable for student
          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const today = new Date();
          let dayName = days[today.getDay()] as string;
          
          // Hackathon demo fallback: If weekend, fallback to Monday so timetable isn't blank!
          if (dayName === 'SUN' || dayName === 'SAT') {
            dayName = 'MON';
            setIsDemoDay(true);
          }

          fetch(`/api/timetable?day=${dayName}&semester=${studentUser.semester}`)
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
      <div className="bg-white p-8 rounded-3xl border border-[#e2dfd5] text-center space-y-4 max-w-md mx-auto my-12">
        <p className="text-xs font-bold text-red-500">Not authenticated as a Student.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-[#344e41] text-white rounded-xl text-xs">
          Go to Login Page
        </Link>
      </div>
    );
  }

  const latestApp = applications[0];

  // Resolve current slot and next class based on time
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

  const formatTimeSlot = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m < 10 ? '0' + m : m} ${ampm}`;
  };

  const currentHourStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

      {/* Timetable Cards (Current & Next Class) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              CURRENT TIME SLOT ({currentHourStr})
            </span>
            {isDemoDay && (
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                Demo Mode
              </span>
            )}
          </div>
          {currentLec ? (
            <>
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-base">
                <Clock className="h-5 w-5" /> {currentLec.subject}
              </div>
              <p className="text-xs text-gray-500">
                {currentLec.startTime} – {currentLec.endTime} • Room {currentLec.room} ({currentLec.facultyName})
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#2e7d32] font-extrabold text-base">
                <Clock className="h-5 w-5" /> FREE / BREAK PERIOD
              </div>
              <p className="text-xs text-gray-500">No scheduled lecture in master timetable for this slot</p>
            </>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">NEXT SCHEDULED CLASS</span>
          {nextLec ? (
            <>
              <div className="font-extrabold text-[#344e41] text-base">{nextLec.subject}</div>
              <p className="text-xs text-gray-500">
                {nextLec.startTime} – {nextLec.endTime} • Room {nextLec.room} ({nextLec.facultyName})
              </p>
            </>
          ) : (
            <>
              <div className="font-extrabold text-gray-400 text-base">No classes left today</div>
              <p className="text-xs text-gray-500">All scheduled lectures for today have concluded</p>
            </>
          )}
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
              {latestApp.status !== 'REJECTED' && latestApp.status !== 'PENDING' ? (
                <Link href="/student/passes" className="font-bold text-[#588157] flex items-center gap-1">
                  Open Pass QR →
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
