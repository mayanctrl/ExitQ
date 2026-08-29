'use client';

import React, { useEffect, useState } from 'react';
import { Lecture } from '@/lib/types';
import { TimetableGrid } from '@/components/ui/TimetableGrid';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function FacultyTimetablePage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const fetchTimetable = () => {
    fetch('/api/timetable')
      .then((res) => res.json())
      .then((data) => setLectures(data.lectures || []));
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleLectureMove = async (
    lecture: Lecture,
    targetDay: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT',
    targetStartTime: string,
    targetEndTime: string
  ) => {
    const prevLectures = [...lectures];
    const updated = lectures.map((l) =>
      l.id === lecture.id ? { ...l, day: targetDay, startTime: targetStartTime, endTime: targetEndTime } : l
    );
    setLectures(updated);

    try {
      const res = await fetch('/api/timetable/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureId: lecture.id,
          targetDay,
          targetStartTime,
          targetEndTime,
          actorId: 'usr_fac_1',
          actorName: 'Prof. Rajesh Kumar',
          semester: lecture.semester || 4,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLectures(prevLectures);
        return { success: false, error: data.error || 'Failed to move lecture' };
      }
      return { success: true };
    } catch (e: any) {
      setLectures(prevLectures);
      return { success: false, error: e.message || 'Network error' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e2dfd5]">
        <div>
          <h1 className="text-2xl font-black text-[#344e41] tracking-tight">Faculty Timetable Schedule</h1>
          <p className="text-xs text-gray-500 mt-0.5">Semester 4 Computer Science master schedule & drag-and-drop reschedule</p>
        </div>

        <Link
          href="/faculty/extra-lectures"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#588157] text-white font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors shadow-xs"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Schedule Extra Lecture</span>
        </Link>
      </div>

      <TimetableGrid
        lectures={lectures}
        interactive={true}
        onLectureMove={handleLectureMove}
      />
    </div>
  );
}
