'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SEED_STUDENTS } from '@/lib/seed';
import { ExitReasonCategory } from '@/lib/types';
import { Send, Clock, MapPin, Users, FileText, CheckCircle2 } from 'lucide-react';

export default function StudentExitRequestPage() {
  const router = useRouter();
  const student = SEED_STUDENTS[0];

  const [reasonCategory, setReasonCategory] = useState<ExitReasonCategory>('MEDICAL');
  const [reasonDescription, setReasonDescription] = useState('Dental appointment at City Health Clinic.');
  const [destination, setDestination] = useState('City Health Center, MG Road');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitTime, setExitTime] = useState('14:00');
  const [expectedReturnTime, setExpectedReturnTime] = useState('16:00');
  const [accompanyingCount, setAccompanyingCount] = useState(0);
  const [accompanyingNames, setAccompanyingNames] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        studentName: student.name,
        studentRoll: student.studentId,
        department: student.department,
        semester: student.semester,
        reasonCategory,
        reasonDescription,
        destination,
        exitTime,
        expectedReturnTime,
        date,
        accompanyingCount: Number(accompanyingCount),
        accompanyingStudentNames: accompanyingNames ? accompanyingNames.split(',').map((s) => s.trim()) : [],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.application) {
          router.push('/student/passes');
        }
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Request Campus Exit Permission</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Submit gate pass request for HOD review & timetable evaluation
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reason Category */}
          <div>
            <label className="font-bold text-[#344e41] block mb-1">Exit Reason Category</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as ExitReasonCategory)}
              className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-bold text-[#344e41]"
            >
              <option value="MEDICAL">Medical Appointment / Hospital</option>
              <option value="FAMILY_EMERGENCY">Family Emergency</option>
              <option value="OFFICIAL_WORK">Official College Work / Symposium</option>
              <option value="PERSONAL">Personal Task</option>
              <option value="OTHER">Other Purpose</option>
            </select>
          </div>

          {/* Detailed Reason */}
          <div>
            <label className="font-bold text-[#344e41] block mb-1">Detailed Explanation</label>
            <textarea
              rows={3}
              value={reasonDescription}
              onChange={(e) => setReasonDescription(e.target.value)}
              placeholder="State the exact purpose for leaving campus during hours..."
              className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              required
            />
          </div>

          {/* Destination */}
          <div>
            <label className="font-bold text-[#344e41] block mb-1">Destination Address / Location</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. City Hospital, MG Road"
              className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41] focus:outline-none focus:border-[#588157]"
              required
            />
          </div>

          {/* Date & Time Window */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#344e41] block mb-1">Exit Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
              />
            </div>

            <div>
              <label className="font-bold text-[#344e41] block mb-1">Exit Time (24h)</label>
              <input
                type="time"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
              />
            </div>

            <div>
              <label className="font-bold text-[#344e41] block mb-1">Expected Return</label>
              <input
                type="time"
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
              />
            </div>
          </div>

          {/* Accompanying Students */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-bold text-[#344e41] block mb-1">Accompanying Friends Count</label>
              <select
                value={accompanyingCount}
                onChange={(e) => setAccompanyingCount(Number(e.target.value))}
                className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-bold text-[#344e41]"
              >
                <option value={0}>Solo (Just me)</option>
                <option value={1}>1 Additional Student</option>
                <option value={2}>2 Additional Students</option>
                <option value={3}>3 Additional Students</option>
              </select>
            </div>

            {accompanyingCount > 0 && (
              <div>
                <label className="font-bold text-[#344e41] block mb-1">Accompanying Student Names</label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Gupta"
                  value={accompanyingNames}
                  onChange={(e) => setAccompanyingNames(e.target.value)}
                  className="w-full p-3 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#588157] text-white font-extrabold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Send className="h-4 w-4 text-[#dad7cd]" /> Submit Exit Request (Generate EXQ Reference)
          </button>
        </form>
      </div>
    </div>
  );
}
