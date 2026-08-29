'use client';

import React, { useEffect, useState } from 'react';
import { ExtraLecture, User } from '@/lib/types';
import { PlusCircle, CalendarDays, BookOpen, Users, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FacultyDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [extraLectures, setExtraLectures] = useState<ExtraLecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/timetable')
      .then((res) => res.json())
      .then((data) => setExtraLectures(data.extraLectures || []));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2dfd5]">
        <div>
          <h1 className="text-2xl font-black text-[#344e41] tracking-tight">
            Faculty Control Center
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Logged in as {user?.name || 'Prof. Rajesh Kumar'} • {user?.department || 'Computer Science & Engineering'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/faculty/timetable"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2dfd5] text-[#344e41] font-bold text-xs rounded-xl hover:bg-[#fafaf7] transition-colors shadow-xs"
          >
            <CalendarDays className="h-3.5 w-3.5 text-[#588157]" />
            <span>Master Timetable</span>
          </Link>
          <Link
            href="/faculty/extra-lectures"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#588157] text-white font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Schedule Extra Lecture</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ASSIGNED CLASSES</span>
          <div className="text-2xl font-black text-[#344e41] mt-1">2 Scheduled Today</div>
          <p className="text-[11px] text-gray-500">DBMS (10 AM) & OS (11 AM)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">EXTRA LECTURES</span>
          <div className="text-2xl font-black text-[#b78103] mt-1">{extraLectures.length} Published</div>
          <p className="text-[11px] text-gray-500">Triggers pass conflict evaluation</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">DEPARTMENT STUDENTS</span>
          <div className="text-2xl font-black text-[#2e7d32] mt-1">CS Sem 4 Active</div>
          <p className="text-[11px] text-gray-500">Attendance tracking active</p>
        </div>
      </div>

      {/* Extra Lecture Conflict Engine Action */}
      <div className="bg-[#344e41] text-[#dad7cd] p-5 rounded-2xl space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#a3b18a] text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" /> Timetable Conflict Engine
          </div>
          <span className="text-[10px] bg-[#588157] text-white px-2 py-0.5 rounded font-bold">
            AUTOMATION READY
          </span>
        </div>
        <h2 className="text-base font-bold text-white">Need to schedule an unexpected extra lecture?</h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          Adding an extra lecture triggers real-time conflict scanning against student gate passes. Conditional exit passes overlapping with the lecture are automatically revoked, while official locked passes remain protected.
        </p>
        <Link
          href="/faculty/extra-lectures"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#588157] text-white text-xs font-bold rounded-xl hover:bg-[#3a5a40] transition-colors mt-1"
        >
          <span>Open Extra Lecture Conflict Console</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
