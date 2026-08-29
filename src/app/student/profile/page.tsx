'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/lib/types';
import { Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === 'STUDENT') {
          setStudent(data.user as Student);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="h-8 w-8 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#344e41]">Loading Student profile...</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Student Profile</h1>
        <p className="text-xs text-gray-500 mt-0.5">Academic identity & registered guardian contact records</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-6 max-w-xl mx-auto">
        <div className="flex items-center gap-4 pb-4 border-b border-[#e2dfd5]">
          <div className="h-16 w-16 rounded-2xl bg-[#344e41] text-[#dad7cd] font-bold flex items-center justify-center text-2xl shadow-sm">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#344e41]">{student.name}</h2>
            <p className="text-xs text-gray-500 font-medium">
              {student.studentId} • {student.department}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
              Semester {student.semester} Enrolled
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-[#344e41] uppercase tracking-wider text-[10px]">Guardian & Emergency Contact</h3>
          <div className="p-4 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] space-y-2">
            <div className="font-bold text-[#344e41] text-sm">{student.guardian?.name} ({student.guardian?.relation})</div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-3.5 w-3.5 text-[#588157]" /> {student.guardian?.phone}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-3.5 w-3.5 text-[#588157]" /> {student.guardian?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
