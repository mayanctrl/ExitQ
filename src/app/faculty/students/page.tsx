'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/lib/types';

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Assigned Batch Students</h1>
        <p className="text-xs text-gray-500 mt-0.5">Computer Science & Engineering — Semester 4</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">STUDENT ID</th>
                <th className="py-3 px-3">NAME</th>
                <th className="py-3 px-3">ATTENDANCE</th>
                <th className="py-3 px-3">CAMPUS STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2dfd5]">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-[#fafaf7] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#344e41]">{s.studentId}</td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{s.name}</td>
                  <td className="py-3 px-3 font-bold text-[#2e7d32]">{s.attendancePercentage}%</td>
                  <td className="py-3 px-3">
                    {s.isOutside ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
                        OUTSIDE CAMPUS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                        INSIDE CAMPUS
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
