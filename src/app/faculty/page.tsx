'use client';

import React, { useEffect, useState } from 'react';
import { Lecture, ExtraLecture } from '@/lib/types';
import { SEED_FACULTY } from '@/lib/seed';
import { PlusCircle, CalendarDays, BookOpen, Clock, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function FacultyDashboard() {
  const faculty = SEED_FACULTY[0];
  const [extraLectures, setExtraLectures] = useState<ExtraLecture[]>([]);

  useEffect(() => {
    fetch('/api/timetable')
      .then((res) => res.json())
      .then((data) => setExtraLectures(data.extraLectures || []));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner & quick action button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#588157] uppercase tracking-wider">
            FACULTY PORTAL & TIMETABLE CONTROL
          </span>
          <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight mt-0.5">
            Welcome, {faculty.name}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Department of Computer Science & Engineering • DBMS & OS In-charge
          </p>
        </div>

        <Link
          href="/faculty/extra-lectures"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#588157] text-white font-extrabold text-xs rounded-2xl hover:bg-[#3a5a40] transition-colors shadow-xs"
        >
          <PlusCircle className="h-4 w-4 text-[#dad7cd]" /> Schedule Extra Lecture →
        </Link>
      </div>

      {/* Today's Classes Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Lectures</span>
            <BookOpen className="h-5 w-5 text-[#588157]" />
          </div>
          <div className="text-3xl font-extrabold text-[#344e41]">2 Classes</div>
          <p className="text-[11px] text-gray-500 font-medium">DBMS (10 AM) & OS (11 AM)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Extra Lectures</span>
            <Zap className="h-5 w-5 text-[#b78103]" />
          </div>
          <div className="text-3xl font-extrabold text-[#b78103]">{extraLectures.length}</div>
          <p className="text-[11px] text-gray-500 font-medium">Triggers ExitQ Auto-Evaluation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Students</span>
            <Users className="h-5 w-5 text-[#3a5a40]" />
          </div>
          <div className="text-3xl font-extrabold text-[#344e41]">68</div>
          <p className="text-[11px] text-gray-500 font-medium">CS Semester 4</p>
        </div>
      </div>

      {/* Extra Lecture Feature Callout Card */}
      <div className="bg-[#344e41] text-[#dad7cd] p-6 rounded-3xl space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-[#a3b18a] text-xs font-bold uppercase tracking-wider">
          <Zap className="h-4 w-4" /> ExitQ Timetable Intelligence Feature
        </div>
        <h2 className="text-lg font-bold text-white">Need to schedule an unexpected lecture?</h2>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
          When you add an extra lecture between 2:00 PM – 3:00 PM, ExitQ will automatically scan all approved student exit passes for that time slot. Conditional passes will be automatically revoked to enforce class attendance, while locked permissions will remain protected.
        </p>
        <Link
          href="/faculty/extra-lectures"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#588157] text-white text-xs font-bold rounded-xl hover:bg-[#3a5a40] transition-colors mt-2"
        >
          Try Demo: Add Extra Lecture (2:00 PM - 3:00 PM) →
        </Link>
      </div>
    </div>
  );
}
