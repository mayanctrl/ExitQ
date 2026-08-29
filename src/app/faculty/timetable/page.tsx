'use client';

import React, { useEffect, useState } from 'react';
import { Lecture } from '@/lib/types';
import { TimetableGrid } from '@/components/ui/TimetableGrid';

export default function FacultyTimetablePage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    fetch('/api/timetable')
      .then((res) => res.json())
      .then((data) => setLectures(data.lectures || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">My Class Schedule</h1>
        <p className="text-xs text-gray-500 mt-0.5">Semester 4 Computer Science & Engineering Timetable</p>
      </div>

      <TimetableGrid lectures={lectures} />
    </div>
  );
}
