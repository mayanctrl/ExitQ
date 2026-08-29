'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/lib/types';
import { Users, LogIn, CheckCircle2 } from 'lucide-react';

export default function GuardOutsidePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => {
        const outside = (data.students || []).filter((s: Student) => s.isOutside);
        setStudents(outside);
      });
  }, []);

  const handleRecordReturn = (studentId: string) => {
    setLoadingId(studentId);

    fetch('/api/gate/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        guardUserId: 'usr_grd_1',
        gateName: 'Gate 1',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingId(null);
        if (data.success) {
          setStudents((prev) => prev.filter((s) => s.id !== studentId));
        }
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Currently Outside Campus</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Live list of students who have exited gate and have not yet recorded return
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs space-y-4">
        {students.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#588157]" />
            <p className="text-xs font-bold text-[#344e41]">All students are currently inside campus!</p>
            <p className="text-[11px] text-gray-400">No active student exit passes currently outside</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {students.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#344e41] text-[#dad7cd] font-bold flex items-center justify-center text-sm">
                    {s.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#344e41] text-sm">{s.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {s.studentId} • {s.department} (Sem {s.semester})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRecordReturn(s.id)}
                  disabled={loadingId === s.id}
                  className="px-4 py-2 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="h-4 w-4 text-[#a3b18a]" /> Record Return
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
