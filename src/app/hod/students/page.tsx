'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/lib/types';
import { Search, Users, Phone, Mail, GraduationCap } from 'lucide-react';

export default function HODStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Student Directory</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View enrolled students, attendance rates, guardian records, and exit histories
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] shadow-xs flex justify-between items-center">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search student by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-semibold text-[#344e41] focus:outline-none focus:border-[#588157]"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="text-xs font-bold text-[#588157]">Total: {students.length} Enrolled Students</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#344e41] text-[#dad7cd] font-bold flex items-center justify-center text-sm">
                  {s.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[#344e41] text-sm">{s.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {s.studentId} • {s.batch}
                  </p>
                </div>
              </div>

              {s.isOutside ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
                  OUTSIDE CAMPUS
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                  INSIDE CAMPUS
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-[#e2dfd5]">
              <div className="bg-[#fafaf7] p-2 rounded-lg">
                <span className="text-[10px] text-gray-400 font-bold block">ATTENDANCE</span>
                <span className="font-bold text-[#2e7d32]">{s.attendancePercentage}%</span>
              </div>
              <div className="bg-[#fafaf7] p-2 rounded-lg">
                <span className="text-[10px] text-gray-400 font-bold block">APPROVED EXITS</span>
                <span className="font-bold text-[#344e41]">{s.approvedExits}</span>
              </div>
              <div className="bg-[#fafaf7] p-2 rounded-lg">
                <span className="text-[10px] text-gray-400 font-bold block">REJECTED</span>
                <span className="font-bold text-[#c62828]">{s.rejectedExits}</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-1 bg-[#fafaf7] p-3 rounded-xl border border-[#e2dfd5]">
              <div className="font-bold text-[#344e41] text-[11px]">Guardian: {s.guardian?.name} ({s.guardian?.relation})</div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Phone className="h-3 w-3 text-[#588157]" /> {s.guardian?.phone}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
